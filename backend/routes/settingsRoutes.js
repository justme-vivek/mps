const express = require('express');
const router = express.Router();
const { getGlobalSettings, updateGlobalSettings } = require('../controllers/settingsController');
const { protect, adminOnly } = require('../middleware/auth');

router
  .route('/')
  .get(getGlobalSettings)
  .put(protect, adminOnly, updateGlobalSettings);

module.exports = router;
