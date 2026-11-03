const express = require('express');
const router = express.Router();
const { getContentSection, updateContentSection } = require('../controllers/contentController');
const { protect, adminOnly } = require('../middleware/auth');

// Public read
router.route('/:sectionId').get(getContentSection);

// Admin write
router.route('/:sectionId').put(protect, adminOnly, updateContentSection);

module.exports = router;
