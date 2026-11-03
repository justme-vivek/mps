const nodemailer = require('nodemailer');

/**
 * SMTP mailer for OTP emails.
 * Works with any provider — Gmail App Password (recommended, free):
 *   SMTP_HOST=smtp.gmail.com, SMTP_PORT=465, SMTP_SECURE=true
 *
 * Dev fallback: when SMTP is not configured and NODE_ENV !== 'production',
 * the code is logged to the server console and returned as `devOtp` in API
 * responses so the whole flow is testable without an email provider.
 * In production without SMTP the API fails loudly instead of leaking codes.
 */
const smtpConfigured = () =>
  !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const isDev = () => process.env.NODE_ENV !== 'production';

let transporter = null;
if (smtpConfigured()) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Startup connection check — prints immediately if the credentials are wrong
  transporter
    .verify()
    .then(() =>
      console.log(
        `[mailer] SMTP ready — sending as ${process.env.SMTP_USER} via ${process.env.SMTP_HOST}:${process.env.SMTP_PORT || 587}`
      )
    )
    .catch((error) =>
      console.warn(
        `[mailer] SMTP login check FAILED — OTP emails will not send until fixed. ` +
          `Check SMTP_USER / SMTP_PASS (use a Gmail App Password, not your account password). (${error.message})`
      )
    );
} else if (isDev()) {
  console.log('[mailer] SMTP not configured — dev OTP mode (codes in console + API responses)');
}

const SUBJECTS = {
  register: 'Verify your email',
  reset: 'Reset your password',
  'password-change': 'Confirm your password change',
};

const buildHtml = (code, purpose) => {
  const heading = SUBJECTS[purpose] || 'Your verification code';
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
    <div style="background:#4338ca;padding:22px;text-align:center;color:#ffffff">
      <div style="font-size:24px;font-weight:bold;letter-spacing:3px">MPS</div>
      <div style="font-size:12px;opacity:.85">Modern Public School</div>
    </div>
    <div style="padding:26px;text-align:center">
      <p style="margin:0 0 6px;color:#111827;font-size:15px">${heading}</p>
      <p style="margin:0;color:#6b7280;font-size:13px">Use this code to continue:</p>
      <div style="font-size:34px;letter-spacing:10px;font-weight:bold;color:#4338ca;margin:16px 0">${code}</div>
      <p style="margin:0;color:#6b7280;font-size:13px">This code expires in 10 minutes.</p>
      <p style="margin:18px 0 0;color:#9ca3af;font-size:12px">If you did not request this, you can safely ignore this email.</p>
    </div>
  </div>`;
};

/**
 * Sends the OTP email. Returns { devOtp } ONLY in dev mode without SMTP.
 * Throws { status, message } errors the API layer can pass through.
 */
async function sendOtpEmail(email, code, purpose) {
  if (!transporter) {
    if (isDev()) {
      console.log(`[dev-otp] ${purpose} code for ${email}: ${code}`);
      return { devOtp: code };
    }
    const err = new Error('Email service is not configured. Please set SMTP_HOST, SMTP_USER and SMTP_PASS.');
    err.status = 500;
    throw err;
  }

  const from = process.env.MAIL_FROM || `MPS School <${process.env.SMTP_USER}>`;

  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: `${code} is your MPS verification code`,
      text: `Your MPS code is ${code}. It expires in 10 minutes. If you did not request this, you can safely ignore this email.`,
      html: buildHtml(code, purpose),
    });
    return {};
  } catch (error) {
    console.error('[mailer] send failed:', error.message);
    const authFailed =
      error.code === 'EAUTH' ||
      error.code === 'EAUTHENC' ||
      /535|5\.7\.8|username and password not accepted|invalid login/i.test(
        `${error.response || ''} ${error.message || ''}`
      );
    const err = new Error(
      authFailed
        ? 'Gmail rejected the SMTP login. Check that SMTP_PASS is a 16-character App Password (not your account password) and SMTP_USER is your full Gmail address.'
        : 'Could not send the email. Please try again shortly.'
    );
    err.status = 502;
    throw err;
  }
}

module.exports = { sendOtpEmail, smtpConfigured };
