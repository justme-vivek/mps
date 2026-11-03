const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public reads
router.route('/').get(getEvents);
router.route('/:id').get(getEventById);

// Admin writes
router.route('/').post(protect, adminOnly, upload.single('bannerFile'), upload.validateFile, createEvent);
router
  .route('/:id')
  .put(protect, adminOnly, upload.single('bannerFile'), upload.validateFile, updateEvent)
  .delete(protect, adminOnly, deleteEvent);

module.exports = router;
