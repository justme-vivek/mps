const express = require('express');
const router = express.Router();
const {
  getFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} = require('../controllers/facultyController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public reads
router.route('/').get(getFaculty);
router.route('/:id').get(getFacultyById);

// Admin writes
router.route('/').post(protect, adminOnly, upload.single('profileFile'), upload.validateFile, createFaculty);
router
  .route('/:id')
  .put(protect, adminOnly, upload.single('profileFile'), upload.validateFile, updateFaculty)
  .delete(protect, adminOnly, deleteFaculty);

module.exports = router;
