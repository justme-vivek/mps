const express = require('express');
const router = express.Router();
const { uploadMedia, getMedia, deleteMedia } = require('../controllers/mediaController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All media-library management is admin only
router
  .route('/')
  .get(protect, adminOnly, getMedia)
  .post(protect, adminOnly, upload.single('file'), upload.validateFile, uploadMedia);

router.route('/:id').delete(protect, adminOnly, deleteMedia);

module.exports = router;
