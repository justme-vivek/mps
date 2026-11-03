const crypto = require('crypto');
const Otp = require('../models/Otp');
const { sendOtpEmail } = require('../config/mailer');

const TTL_MS = 10 * 60 * 1000; // code valid for 10 minutes
const MAX_ATTEMPTS = 5; // wrong entries before the code dies
const RESEND_COOLDOWN_MS = 60 * 1000; // 60s between codes
const MAX_SENDS_PER_HOUR = 5; // per email + purpose

const generateCode = () => String(crypto.randomInt(100000, 1000000));

// HMAC so a database leak can never reveal live codes
const hashCode = (code) =>
  crypto.createHmac('sha256', process.env.JWT_SECRET).update(code).digest('hex');

const safeEqual = (hexA, hexB) => {
  const a = Buffer.from(hexA, 'hex');
  const b = Buffer.from(hexB, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

/** Throws an Error carrying an HTTP status, passable to the API layer. */
const fail = (message, status = 400) => {
  const err = new Error(message);
  err.status = status;
  throw err;
};

/**
 * Creates an OTP record and emails the code.
 * Enforces: 60s resend cooldown, 5 sends/hour per email+purpose,
 * and one active code at a time (previous unconsumed codes are invalidated).
 * Returns { otpId, devOtp? } — devOtp only in dev mode without SMTP.
 */
const createAndSendOtp = async (email, purpose) => {
  const now = new Date();

  const last = await Otp.findOne({ email, purpose }).sort({ lastSentAt: -1 });
  if (last && now - last.lastSentAt.getTime() < RESEND_COOLDOWN_MS) {
    const wait = Math.ceil((RESEND_COOLDOWN_MS - (now - last.lastSentAt.getTime())) / 1000);
    fail(`Please wait ${wait}s before requesting another code.`, 429);
  }

  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const sentLastHour = await Otp.countDocuments({
    email,
    purpose,
    lastSentAt: { $gte: hourAgo },
  });
  if (sentLastHour >= MAX_SENDS_PER_HOUR) {
    fail('Too many codes requested. Please try again later.', 429);
  }

  // Any previous unconsumed code for this email+purpose becomes unusable
  await Otp.updateMany({ email, purpose, consumedAt: null }, { $set: { consumedAt: now } });

  const code = generateCode();
  const { devOtp } = await sendOtpEmail(email, code, purpose);

  const otp = await Otp.create({
    email,
    purpose,
    otpHash: hashCode(code),
    expiresAt: new Date(now.getTime() + TTL_MS),
    lastSentAt: now,
  });

  return { otpId: otp._id.toString(), devOtp };
};

/**
 * Verifies a code and consumes the OTP on success.
 * Throws { status, message } on any failure.
 */
const verifyOtp = async ({ otpId, purpose, email = null, code }) => {
  const otp = await Otp.findById(otpId);

  if (!otp || otp.purpose !== purpose || (email && otp.email !== email)) {
    fail('This code request is no longer valid. Please request a new one.');
  }
  if (otp.consumedAt) {
    fail('This code was already used. Please request a new one.');
  }
  if (otp.expiresAt < new Date()) {
    fail('This code has expired. Please request a new one.');
  }
  if (otp.attempts >= MAX_ATTEMPTS) {
    fail('Too many incorrect attempts. Please request a new code.');
  }

  if (!safeEqual(hashCode(code), otp.otpHash)) {
    otp.attempts += 1;
    await otp.save();
    const left = MAX_ATTEMPTS - otp.attempts;
    if (left <= 0) fail('Too many incorrect attempts. Please request a new code.');
    fail(`Incorrect code. ${left} attempt${left === 1 ? '' : 's'} left.`);
  }

  otp.consumedAt = new Date();
  await otp.save();
  return otp;
};

module.exports = { createAndSendOtp, verifyOtp, fail, MAX_ATTEMPTS };
