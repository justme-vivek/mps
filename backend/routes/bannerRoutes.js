const express = require('express');
const router = express.Router();
const {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} = require('../controllers/bannerController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public reads
router.route('/').get(getBanners);
router.route('/:id').get(getBannerById);

// Admin writes
router.route('/').post(protect, adminOnly, upload.single('imageFile'), upload.validateFile, createBanner);
router
  .route('/:id')
  .put(protect, adminOnly, upload.single('imageFile'), upload.validateFile, updateBanner)
  .delete(protect, adminOnly, deleteBanner);

module.exports = router;
