const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    content: { type: String, required: [true, 'Content is required'] },
    date: { type: Date, default: Date.now },
    isImportant: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
    pdfUrl: { type: String, default: '' }, // optional PDF attachment (ImageKit)
    pdfFileId: { type: String }, // ImageKit fileId for deletion
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);
