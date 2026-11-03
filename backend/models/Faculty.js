const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    designation: { type: String, required: [true, 'Designation is required'], trim: true },
    photoUrl: { type: String, required: [true, 'Photo is required'] },
    fileId: { type: String }, // ImageKit fileId for deletion
    bio: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Faculty', facultySchema);
