const mongoose = require('mongoose');

/**
 * A downloadable PDF resource (e.g. admission form, syllabus, circular).
 * Files themselves live in ImageKit — only image extensions and PDF are
 * allowed anywhere in the app, and downloads are PDF-only by design.
 */
const downloadSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'General', trim: true },
    fileUrl: { type: String, required: true }, // ImageKit PDF URL
    fileId: { type: String }, // ImageKit fileId for deletion
    type: { type: String, enum: ['pdf'], default: 'pdf' },
    downloadCount: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Download', downloadSchema);
