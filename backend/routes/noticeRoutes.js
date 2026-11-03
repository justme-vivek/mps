const express = require('express');
const router = express.Router();
const {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} = require('../controllers/noticeController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public reads
router.route('/').get(getNotices);
router.route('/:id').get(getNoticeById);

// Admin writes (PDF-only attachments enforced by validateFile + controller)
router.route('/').post(protect, adminOnly, upload.single('attachmentFile'), upload.validateFile, createNotice);
router
  .route('/:id')
  .put(protect, adminOnly, upload.single('attachmentFile'), upload.validateFile, updateNotice)
  .delete(protect, adminOnly, deleteNotice);

module.exports = router;
