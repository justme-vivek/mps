const Banner = require('../models/Banner');
const { uploadToImagekit, deleteFromImagekit } = require('../utils/media');

// @desc    Fetch all banners
// @route   GET /api/banners
// @access  Public
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({}).sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch a single banner
// @route   GET /api/banners/:id
// @access  Public
const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = async (req, res) => {
  try {
    const { title, subtitle, link, order, isActive } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    let imageUrl = req.body.imageUrl || '';
    let fileId;

    if (req.file) {
      const uploaded = await uploadToImagekit(req.file, '/mps/banners');
      imageUrl = uploaded.url;
      fileId = uploaded.fileId;
    }
    if (!imageUrl) return res.status(400).json({ message: 'A banner image is required' });

    const banner = await Banner.create({
      title,
      subtitle: subtitle || '',
      imageUrl,
      fileId,
      link: link || '',
      order: order || 0,
      isActive: isActive === 'true' || isActive === true,
    });

    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ message: 'Invalid banner data', error: error.message });
  }
};

// @desc    Update a banner (optionally replace the image)
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    const { title, subtitle, link, order, isActive } = req.body;
    if (title !== undefined) banner.title = title;
    if (subtitle !== undefined) banner.subtitle = subtitle;
    if (link !== undefined) banner.link = link;
    if (order !== undefined) banner.order = order;
    if (isActive !== undefined) banner.isActive = isActive === 'true' || isActive === true;

    if (req.file) {
      const uploaded = await uploadToImagekit(req.file, '/mps/banners');
      await deleteFromImagekit(banner.fileId);
      banner.imageUrl = uploaded.url;
      banner.fileId = uploaded.fileId;
    } else if (req.body.imageUrl && req.body.imageUrl !== banner.imageUrl) {
      await deleteFromImagekit(banner.fileId);
      banner.imageUrl = req.body.imageUrl;
      banner.fileId = undefined;
    }

    await banner.save();
    res.json(banner);
  } catch (error) {
    res.status(400).json({ message: 'Invalid banner data', error: error.message });
  }
};

// @desc    Delete a banner (removes the image from ImageKit too)
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    await deleteFromImagekit(banner.fileId);
    await banner.deleteOne();

    res.json({ message: 'Banner removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getBanners, getBannerById, createBanner, updateBanner, deleteBanner };
