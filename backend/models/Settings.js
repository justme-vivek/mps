const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  isGlobal: { type: Boolean, default: true, unique: true }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Settings', settingsSchema);
