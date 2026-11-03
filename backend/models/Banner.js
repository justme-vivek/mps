const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    subtitle: { type: String, default: '' },
    imageUrl: { type: String, required: [true, 'Banner image is required'] },
    fileId: { type: String }, // ImageKit fileId (when uploaded through the app)
    link: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
