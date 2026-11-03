const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Unified account model for the app.
 * Both "admin" and normal "user" accounts live in this collection.
 * Admin accounts are ONLY ever created by the dev-time seed script
 * (backend/scripts/seedAdmin.js) — the public API always forces role:'user'.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // never returned by queries unless explicitly selected
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Tokens issued before this moment are rejected (see middleware/auth.js)
    passwordChangedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Encrypt password before saving (Mongoose 9: async hooks receive no `next`)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  if (!this.isNew) this.passwordChangedAt = new Date(); // invalidates older sessions
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
