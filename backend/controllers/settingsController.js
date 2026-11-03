const Settings = require('../models/Settings');

exports.getGlobalSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ isGlobal: true });
    if (!settings) {
      settings = await Settings.create({ isGlobal: true });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateGlobalSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { isGlobal: true },
      req.body,
      { new: true, upsert: true, strict: false }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
