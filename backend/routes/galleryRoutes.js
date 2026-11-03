const express = require('express');
const router = express.Router();
const {
  getGallery,
  getGalleryById,
  createGallery,
  updateGallery,
  deleteGallery,
} = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public reads
router.route('/').get(getGallery);
router.route('/:id').get(getGalleryById);

// Admin writes
router.route('/').post(protect, adminOnly, upload.single('imageFile'), upload.validateFile, createGallery);
router
  .route('/:id')
  .put(protect, adminOnly, upload.single('imageFile'), upload.validateFile, updateGallery)
  .delete(protect, adminOnly, deleteGallery);

module.exports = router;
