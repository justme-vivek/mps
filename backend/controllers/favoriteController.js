const mongoose = require('mongoose');
const Favorite = require('../models/Favorite');
const Notice = require('../models/Notice');
const Event = require('../models/Event');
const Gallery = require('../models/Gallery');

const ITEM_MODELS = {
  notice: Notice,
  event: Event,
  gallery: Gallery,
};

// @desc    List the current user's favourites with the actual item data
// @route   GET /api/favorites
// @access  Private (any logged-in user)
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 });

    const enriched = await Promise.all(
      favorites.map(async (fav) => {
        const Model = ITEM_MODELS[fav.itemType];
        const item = Model ? await Model.findById(fav.itemId).lean() : null;
        return {
          _id: fav._id,
          itemType: fav.itemType,
          itemId: fav.itemId,
          item,
          createdAt: fav.createdAt,
        };
      })
    );

    // Drop favourites whose underlying item no longer exists
    res.json(enriched.filter((f) => f.item));
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get favourited item ids (for flagging lists) — ?itemType=notice
// @route   GET /api/favorites/ids
// @access  Private (any logged-in user)
const getFavoriteIds = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.itemType && ITEM_MODELS[req.query.itemType]) {
      filter.itemType = req.query.itemType;
    }
    const favorites = await Favorite.find(filter).select('itemId');
    res.json({ ids: favorites.map((f) => f.itemId.toString()) });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Toggle favourite on/off for an item
// @route   POST /api/favorites  { itemType, itemId }
// @access  Private (any logged-in user)
const toggleFavorite = async (req, res) => {
  try {
    const { itemType, itemId } = req.body;

    if (!ITEM_MODELS[itemType]) {
      return res.status(400).json({ message: 'Invalid item type' });
    }
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: 'Invalid item id' });
    }

    const existing = await Favorite.findOne({
      user: req.user._id,
      itemType,
      itemId,
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({ favorited: false });
    }

    // Only allow favouriting items that actually exist
    const item = await ITEM_MODELS[itemType].findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await Favorite.create({ user: req.user._id, itemType, itemId });
    res.status(201).json({ favorited: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Remove a favourite by its own id
// @route   DELETE /api/favorites/:id
// @access  Private (owner only)
const deleteFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ _id: req.params.id, user: req.user._id });
    if (!favorite) return res.status(404).json({ message: 'Favourite not found' });
    await favorite.deleteOne();
    res.json({ message: 'Favourite removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getFavorites, getFavoriteIds, toggleFavorite, deleteFavorite };
