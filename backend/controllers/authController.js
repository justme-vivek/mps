const jwt = require('jsonwebtoken');
const { z } = require('zod');
const User = require('../models/User');
const Otp = require('../models/Otp');
const { createAndSendOtp, verifyOtp, fail } = require('../utils/otp');

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

const buildAuthResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  token: generateToken(user),
});

// --- validation schemas ---
const emailSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
});

const otpCodeSchema = z.object({
  otpId: z.string().min(10, 'Invalid code reference'),
  code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
});

const registerVerifySchema = otpCodeSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

const resetPasswordSchema = z.object({
  resetToken: z.string().min(10, 'Invalid reset session'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

const changeConfirmSchema = otpCodeSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

const parseOr400 = (schema, body, res) => {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return null;
  }
  return parsed.data;
};

const otpSentResponse = (res, result, message) => {
  const payload = { otpId: result.otpId, message };
  if (result.devOtp) payload.devOtp = result.devOtp; // dev mode only
  res.status(202).json(payload);
};

const otpError = (res, error) => {
  res.status(error.status || 500).json({ message: error.message || 'Something went wrong. Please try again.' });
};

/**
 * @desc    Login — ONE endpoint for every account type.
 *          The server decides the role; the client never picks one.
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  const data = parseOr400(
    z.object({
      email: z.string().email('Please provide a valid email address'),
      password: z.string().min(1, 'Password is required'),
    }),
    req.body,
    res
  );
  if (!data) return;

  const user = await User.findOne({ email: data.email.toLowerCase() }).select('+password');

  if (!user || !user.isActive || !(await user.matchPassword(data.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json(buildAuthResponse(user));
};

/**
 * @desc    Session bootstrap
 * @route   GET /api/auth/me
 * @access  Private (any logged-in user)
 */
const getMe = async (req, res) => {
  res.json(buildAuthResponse(req.user));
};

/**
 * @desc    Start registration — validates the email, sends an OTP.
 *          NO account is created until the code is verified.
 * @route   POST /api/auth/register/initiate
 * @access  Public
 */
const registerInitiate = async (req, res) => {
  const data = parseOr400(emailSchema, req.body, res);
  if (!data) return;
  const email = data.email.toLowerCase();

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists. Please sign in instead.' });
  }

  try {
    const result = await createAndSendOtp(email, 'register');
    otpSentResponse(res, result, 'A 6-digit code has been sent to your email. It is valid for 10 minutes.');
  } catch (error) {
    otpError(res, error);
  }
};

/**
 * @desc    Finish registration — verifies the OTP, THEN creates the account.
 *          role is hardcoded 'user' — no OTP flow can ever create an admin.
 * @route   POST /api/auth/register/verify
 * @access  Public
 */
const registerVerify = async (req, res) => {
  const data = parseOr400(registerVerifySchema, req.body, res);
  if (!data) return;

  try {
    const otp = await verifyOtp({ otpId: data.otpId, purpose: 'register', code: data.code });
    const email = otp.email;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists. Please sign in instead.' });
    }

    const user = await User.create({ name: data.name.trim(), email, password: data.password, role: 'user' });
    res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    otpError(res, error);
  }
};

/**
 * @desc    Forgot password step 1 — always responds generically (no account
 *          enumeration). Sends the OTP only when the account exists.
 * @route   POST /api/auth/forgot-password/initiate
 * @access  Public
 */
const forgotPasswordInitiate = async (req, res) => {
  const data = parseOr400(emailSchema, req.body, res);
  if (!data) return;
  const email = data.email.toLowerCase();
  const genericMessage =
    'If an account exists for this email, a 6-digit code has been sent. It is valid for 10 minutes.';

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ message: genericMessage });
  }

  try {
    const result = await createAndSendOtp(email, 'reset');
    const payload = { message: genericMessage, otpId: result.otpId };
    if (result.devOtp) payload.devOtp = result.devOtp;
    res.status(200).json(payload);
  } catch (error) {
    otpError(res, error);
  }
};

/**
 * @desc    Forgot password step 2 — verify the code, issue a single-use
 *          10-minute resetToken that unlocks the new-password step.
 * @route   POST /api/auth/forgot-password/verify
 * @access  Public
 */
const forgotPasswordVerify = async (req, res) => {
  const data = parseOr400(otpCodeSchema, req.body, res);
  if (!data) return;

  try {
    const otp = await verifyOtp({ otpId: data.otpId, purpose: 'reset', code: data.code });

    const user = await User.findOne({ email: otp.email });
    if (!user) fail('No account found for this email.', 404);

    const resetToken = jwt.sign(
      { id: user._id.toString(), jti: otp._id.toString(), purpose: 'reset' },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    res.json({ resetToken, message: 'Code verified. Set your new password now.' });
  } catch (error) {
    otpError(res, error);
  }
};

/**
 * @desc    Forgot password step 3 — save the new password. The resetToken is
 *          single-use; the old password and ALL sessions issued before this
 *          moment become invalid (passwordChangedAt).
 * @route   POST /api/auth/reset-password
 * @access  Public (requires resetToken)
 */
const resetPassword = async (req, res) => {
  const data = parseOr400(resetPasswordSchema, req.body, res);
  if (!data) return;

  try {
    let decoded;
    try {
      decoded = jwt.verify(data.resetToken, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        fail('Your reset session expired. Please start again.', 400);
      }
      fail('Invalid reset session. Please start again.', 400);
    }
    if (decoded.purpose !== 'reset') fail('Invalid reset session. Please start again.', 400);

    // Single-use: the referenced OTP can complete exactly one reset
    const otp = await Otp.findOneAndUpdate(
      { _id: decoded.jti, usedForReset: { $ne: true } },
      { $set: { usedForReset: true } },
      { new: true }
    );
    if (!otp) {
      fail('This password reset has already been completed. Please sign in or start again.', 400);
    }

    const user = await User.findById(decoded.id);
    if (!user) fail('Account not found.', 404);

    user.password = data.password; // pre-save hook hashes it + sets passwordChangedAt
    await user.save();

    res.json({ message: 'Password updated. Please sign in with your new password.' });
  } catch (error) {
    otpError(res, error);
  }
};

/**
 * @desc    Change password step 1 (logged in) — send OTP to own email.
 * @route   POST /api/auth/change-password/initiate
 * @access  Private
 */
const changePasswordInitiate = async (req, res) => {
  try {
    const result = await createAndSendOtp(req.user.email, 'password-change');
    otpSentResponse(res, result, 'A 6-digit code has been sent to your email to confirm the change.');
  } catch (error) {
    otpError(res, error);
  }
};

/**
 * @desc    Change password step 2 — verify OTP + save the new password.
 *          passwordChangedAt invalidates ALL existing sessions.
 * @route   POST /api/auth/change-password/confirm
 * @access  Private
 */
const changePasswordConfirm = async (req, res) => {
  const data = parseOr400(changeConfirmSchema, req.body, res);
  if (!data) return;

  try {
    await verifyOtp({
      otpId: data.otpId,
      purpose: 'password-change',
      email: req.user.email,
      code: data.code,
    });

    req.user.password = data.password; // hashed by pre-save + passwordChangedAt set
    await req.user.save();

    res.json({ message: 'Password changed. Please sign in with your new password.' });
  } catch (error) {
    otpError(res, error);
  }
};

module.exports = {
  login,
  getMe,
  registerInitiate,
  registerVerify,
  forgotPasswordInitiate,
  forgotPasswordVerify,
  resetPassword,
  changePasswordInitiate,
  changePasswordConfirm,
};
