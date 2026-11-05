const Notice = require('../models/Notice');
const { findPaged } = require('../utils/paginate');
const { uploadToImagekit, deleteFromImagekit } = require('../utils/media');

// @desc    Fetch all notices
// @route   GET /api/notices
// @access  Public
const getNotices = async (req, res) => {
  try {
    const notices = await findPaged(Notice, ['draft', 'published'].includes(req.query.status) ? { status: req.query.status } : {}, { isPinned: -1, date: -1, _id: -1 }, req, res);
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch a single notice
// @route   GET /api/notices/:id
// @access  Public
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a notice (optional PDF attachment)
// @route   POST /api/notices
// @access  Private/Admin
const createNotice = async (req, res) => {
  try {
    const { title, content, date, isImportant, isPinned, status } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    let pdfUrl = req.body.pdfUrl || '';
    let pdfFileId;

    if (req.file) {
      if (req.file.meta.type !== 'pdf') {
        return res.status(400).json({ message: 'Notice attachments must be PDF files' });
      }
      const uploaded = await uploadToImagekit(req.file, '/mps/notices');
      pdfUrl = uploaded.url;
      pdfFileId = uploaded.fileId;
    }

    const notice = await Notice.create({
      title,
      content,
      date: date || Date.now(),
      isImportant: isImportant === 'true' || isImportant === true,
      isPinned: isPinned === 'true' || isPinned === true,
      status: status === 'draft' ? 'draft' : 'published',
      pdfUrl,
      pdfFileId,
    });

    res.status(201).json(notice);
  } catch (error) {
    res.status(400).json({ message: 'Invalid notice data', error: error.message });
  }
};

// @desc    Update a notice (optionally replace the PDF attachment)
// @route   PUT /api/notices/:id
// @access  Private/Admin
const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    const { title, content, date, isImportant, isPinned, status } = req.body;
    if (title !== undefined) notice.title = title;
    if (content !== undefined) notice.content = content;
    if (date !== undefined) notice.date = date;
    if (isImportant !== undefined) notice.isImportant = isImportant === 'true' || isImportant === true;
    if (isPinned !== undefined) notice.isPinned = isPinned === 'true' || isPinned === true;
    if (status !== undefined) notice.status = status === 'draft' ? 'draft' : 'published';

    if (req.file) {
      if (req.file.meta.type !== 'pdf') {
        return res.status(400).json({ message: 'Notice attachments must be PDF files' });
      }
      const uploaded = await uploadToImagekit(req.file, '/mps/notices');
      await deleteFromImagekit(notice.pdfFileId);
      notice.pdfUrl = uploaded.url;
      notice.pdfFileId = uploaded.fileId;
    } else if (req.body.pdfUrl !== undefined && req.body.pdfUrl !== notice.pdfUrl) {
      await deleteFromImagekit(notice.pdfFileId);
      notice.pdfUrl = req.body.pdfUrl;
      notice.pdfFileId = undefined;
    }

    await notice.save();
    res.json(notice);
  } catch (error) {
    res.status(400).json({ message: 'Invalid notice data', error: error.message });
  }
};

// @desc    Delete a notice (removes the PDF from ImageKit too)
// @route   DELETE /api/notices/:id
// @access  Private/Admin
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    await deleteFromImagekit(notice.pdfFileId);
    await notice.deleteOne();

    res.json({ message: 'Notice removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getNotices, getNoticeById, createNotice, updateNotice, deleteNotice };
