const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    imageUrl: { type: String, required: [true, 'Image is required'] },
    fileId: { type: String }, // ImageKit fileId for deletion
    category: { type: String, default: 'General', trim: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', gallerySchema);
