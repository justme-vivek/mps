const MediaAsset = require('../models/MediaAsset');
const { uploadToImagekit, deleteFromImagekit } = require('../utils/media');

// @desc    Upload an image or PDF to the media library (ImageKit)
// @route   POST /api/media
// @access  Private/Admin
const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const uploaded = await uploadToImagekit(req.file, '/mps/media');

    const asset = await MediaAsset.create({
      fileId: uploaded.fileId,
      url: uploaded.url,
      name: req.file.originalname,
      type: req.file.meta.type,
      size: uploaded.size,
      folder: '/mps/media',
      uploadedBy: req.user._id,
    });

    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

// @desc    List media assets (optionally ?type=image|pdf)
// @route   GET /api/media
// @access  Private/Admin
const getMedia = async (req, res) => {
  try {
    const filter = {};
    if (['image', 'pdf'].includes(req.query.type)) {
      filter.type = req.query.type;
    }
    const assets = await MediaAsset.find(filter).sort({ createdAt: -1 });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load media', error: error.message });
  }
};

// @desc    Delete a media asset (removes it from ImageKit too)
// @route   DELETE /api/media/:id
// @access  Private/Admin
const deleteMedia = async (req, res) => {
  try {
    const asset = await MediaAsset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Media asset not found' });
    }

    await deleteFromImagekit(asset.fileId);
    await asset.deleteOne();

    res.json({ message: 'Media asset deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete media', error: error.message });
  }
};

module.exports = { uploadMedia, getMedia, deleteMedia };
