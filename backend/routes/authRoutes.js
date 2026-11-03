const express = require('express');
const router = express.Router();
const {
  login,
  getMe,
  registerInitiate,
  registerVerify,
  forgotPasswordInitiate,
  forgotPasswordVerify,
  resetPassword,
  changePasswordInitiate,
  changePasswordConfirm,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public
router.post('/login', login);

// Registration — OTP-verified; NO direct register endpoint exists
router.post('/register/initiate', registerInitiate);
router.post('/register/verify', registerVerify);

// Forgot password — OTP first, then new password
router.post('/forgot-password/initiate', forgotPasswordInitiate);
router.post('/forgot-password/verify', forgotPasswordVerify);
router.post('/reset-password', resetPassword);

// Private — session bootstrap for any logged-in user
router.get('/me', protect, getMe);

// Change password — password first, then OTP confirmation
router.post('/change-password/initiate', protect, changePasswordInitiate);
router.post('/change-password/confirm', protect, changePasswordConfirm);

module.exports = router;
