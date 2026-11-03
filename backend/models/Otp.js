const mongoose = require('mongoose');

/**
 * Email OTP codes for: register | reset (forgot password) | password-change.
 * The raw code is NEVER stored — only an HMAC-SHA256 hash of it.
 */
const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    purpose: {
      type: String,
      enum: ['register', 'reset', 'password-change'],
      required: true,
    },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    consumedAt: { type: Date, default: null },
    lastSentAt: { type: Date, default: Date.now },
    usedForReset: { type: Boolean, default: false }, // single-use guard for resetToken
  },
  { timestamps: true }
);

// MongoDB TTL — documents auto-delete shortly after expiry
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// Fast lookups for resend-cooldown and hourly-cap checks
otpSchema.index({ email: 1, purpose: 1, lastSentAt: -1 });

module.exports = mongoose.model('Otp', otpSchema);
