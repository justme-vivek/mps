/**
 * Dev-time ONLY script that creates (or updates) the admin account.
 *
 * There is deliberately NO API endpoint that can create an admin —
 * this script is the single source of admin accounts.
 *
 * Usage:
 *   npm run seed:admin
 *
 * Env vars used (set in backend/.env):
 *   ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, SEED_RESET_PASSWORD
 */
// Load env vars (.env first, .env.example as fallback for missing keys)
require('../config/env');
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  const { MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, SEED_RESET_PASSWORD } = process.env;

  if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error(
      'Missing required env vars. Please set MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env'
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const email = ADMIN_EMAIL.toLowerCase();
    let user = await User.findOne({ email }).select('+password');

    if (user) {
      user.role = 'admin';
      user.isActive = true;
      if (SEED_RESET_PASSWORD === 'true') {
        user.password = ADMIN_PASSWORD;
        console.log('Password reset flag set — password updated');
      }
      await user.save();
      console.log(`Existing account promoted/ensured as admin: ${email}`);
    } else {
      user = await User.create({
        name: ADMIN_NAME || 'MPS Admin',
        email,
        password: ADMIN_PASSWORD,
        role: 'admin',
      });
      console.log(`Admin account created: ${email}`);
    }

    console.log(`\nDone. Login with:\n  email: ${email}\n  role:  ${user.role}\n`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();
