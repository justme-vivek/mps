const Download = require('../models/Download');
const { uploadToImagekit, deleteFromImagekit } = require('../utils/media');

// @desc    List downloadable PDFs
// @route   GET /api/downloads
// @access  Public
const getDownloads = async (req, res) => {
  try {
    const downloads = await Download.find({}).sort({ order: 1, createdAt: -1 });
    res.json(downloads);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a downloadable PDF (PDF file required)
// @route   POST /api/downloads
// @access  Private/Admin
const createDownload = async (req, res) => {
  try {
    const { title, description, category, order } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    if (!req.file) return res.status(400).json({ message: 'A PDF file is required' });
    if (req.file.meta.type !== 'pdf') {
      return res.status(400).json({ message: 'Only PDF files are accepted for downloads' });
    }

    const uploaded = await uploadToImagekit(req.file, '/mps/downloads');

    const download = await Download.create({
      title,
      description,
      category: category || 'General',
      order: order || 0,
      fileUrl: uploaded.url,
      fileId: uploaded.fileId,
      type: 'pdf',
    });

    res.status(201).json(download);
  } catch (error) {
    res.status(400).json({ message: 'Invalid download data', error: error.message });
  }
};

// @desc    Update a downloadable PDF (optionally replace the PDF)
// @route   PUT /api/downloads/:id
// @access  Private/Admin
const updateDownload = async (req, res) => {
  try {
    const download = await Download.findById(req.params.id);
    if (!download) return res.status(404).json({ message: 'Download not found' });

    const { title, description, category, order } = req.body;
    if (title !== undefined) download.title = title;
    if (description !== undefined) download.description = description;
    if (category !== undefined) download.category = category;
    if (order !== undefined) download.order = order;

    if (req.file) {
      if (req.file.meta.type !== 'pdf') {
        return res.status(400).json({ message: 'Only PDF files are accepted for downloads' });
      }
      const uploaded = await uploadToImagekit(req.file, '/mps/downloads');
      await deleteFromImagekit(download.fileId);
      download.fileUrl = uploaded.url;
      download.fileId = uploaded.fileId;
    }

    await download.save();
    res.json(download);
  } catch (error) {
    res.status(400).json({ message: 'Invalid download data', error: error.message });
  }
};

// @desc    Delete a downloadable PDF (removes the file from ImageKit too)
// @route   DELETE /api/downloads/:id
// @access  Private/Admin
const deleteDownload = async (req, res) => {
  try {
    const download = await Download.findById(req.params.id);
    if (!download) return res.status(404).json({ message: 'Download not found' });

    await deleteFromImagekit(download.fileId);
    await download.deleteOne();

    res.json({ message: 'Download removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Increment download counter (called when a user downloads the PDF)
// @route   POST /api/downloads/:id/download
// @access  Private (any logged-in user)
const incrementDownloadCount = async (req, res) => {
  try {
    const download = await Download.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    if (!download) return res.status(404).json({ message: 'Download not found' });
    res.json({ downloadCount: download.downloadCount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getDownloads, createDownload, updateDownload, deleteDownload, incrementDownloadCount };
