const express = require('express');
const router = express.Router();
const {
  getDownloads,
  createDownload,
  updateDownload,
  deleteDownload,
  incrementDownloadCount,
} = require('../controllers/downloadController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public: list downloads (guests can browse, but not download files)
router.route('/').get(getDownloads);

// Admin: manage downloads
router
  .route('/')
  .post(protect, adminOnly, upload.single('file'), upload.validateFile, createDownload);

router
  .route('/:id')
  .put(protect, adminOnly, upload.single('file'), upload.validateFile, updateDownload)
  .delete(protect, adminOnly, deleteDownload);

// Any logged-in user can register a download (increments counter)
router.route('/:id/download').post(protect, incrementDownloadCount);

module.exports = router;
