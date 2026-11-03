const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    date: { type: Date, required: [true, 'Date is required'] },
    bannerUrl: { type: String, default: '' }, // ImageKit image URL
    bannerFileId: { type: String }, // ImageKit fileId for deletion
    location: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
