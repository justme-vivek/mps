const mongoose = require('mongoose');

/**
 * One record per file stored in ImageKit via the central media library.
 */
const mediaAssetSchema = new mongoose.Schema(
  {
    fileId: { type: String, required: true, unique: true }, // ImageKit fileId
    url: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['image', 'pdf'], required: true },
    size: { type: Number, default: 0 },
    folder: { type: String, default: '/mps/media' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MediaAsset', mediaAssetSchema);
