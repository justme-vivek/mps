const express = require('express');
const router = express.Router();
const {
  getFavorites,
  getFavoriteIds,
  toggleFavorite,
  deleteFavorite,
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

// All favourite endpoints require a logged-in account (user or admin)
router.route('/').get(protect, getFavorites).post(protect, toggleFavorite);
router.route('/ids').get(protect, getFavoriteIds);
router.route('/:id').delete(protect, deleteFavorite);

module.exports = router;
