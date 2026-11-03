const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    sectionId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true, strict: false,
  }
);

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
