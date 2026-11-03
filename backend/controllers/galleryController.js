const Gallery = require('../models/Gallery');
const { uploadToImagekit, deleteFromImagekit } = require('../utils/media');

// @desc    Fetch all gallery photos
// @route   GET /api/gallery
// @access  Public
const getGallery = async (req, res) => {
  try {
    const photos = await Gallery.find({}).sort({ date: -1, createdAt: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch a single gallery photo
// @route   GET /api/gallery/:id
// @access  Public
const getGalleryById = async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Gallery item not found' });
    res.json(photo);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Add a gallery photo
// @route   POST /api/gallery
// @access  Private/Admin
const createGallery = async (req, res) => {
  try {
    const { title, category, date } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    let imageUrl = req.body.imageUrl || '';
    let fileId;

    if (req.file) {
      const uploaded = await uploadToImagekit(req.file, '/mps/gallery');
      imageUrl = uploaded.url;
      fileId = uploaded.fileId;
    }
    if (!imageUrl) return res.status(400).json({ message: 'An image is required' });

    const photo = await Gallery.create({
      title,
      imageUrl,
      fileId,
      category: category || 'General',
      date: date || Date.now(),
    });

    res.status(201).json(photo);
  } catch (error) {
    res.status(400).json({ message: 'Invalid gallery data', error: error.message });
  }
};

// @desc    Update a gallery photo (optionally replace the image)
// @route   PUT /api/gallery/:id
// @access  Private/Admin
const updateGallery = async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Gallery item not found' });

    const { title, category, date } = req.body;
    if (title !== undefined) photo.title = title;
    if (category !== undefined) photo.category = category;
    if (date !== undefined) photo.date = date;

    if (req.file) {
      const uploaded = await uploadToImagekit(req.file, '/mps/gallery');
      await deleteFromImagekit(photo.fileId);
      photo.imageUrl = uploaded.url;
      photo.fileId = uploaded.fileId;
    } else if (req.body.imageUrl && req.body.imageUrl !== photo.imageUrl) {
      await deleteFromImagekit(photo.fileId);
      photo.imageUrl = req.body.imageUrl;
      photo.fileId = undefined;
    }

    await photo.save();
    res.json(photo);
  } catch (error) {
    res.status(400).json({ message: 'Invalid gallery data', error: error.message });
  }
};

// @desc    Delete a gallery photo (removes the image from ImageKit too)
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGallery = async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Gallery item not found' });

    await deleteFromImagekit(photo.fileId);
    await photo.deleteOne();

    res.json({ message: 'Gallery item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getGallery, getGalleryById, createGallery, updateGallery, deleteGallery };
