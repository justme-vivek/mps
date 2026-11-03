const Content = require('../models/Content');

const getContentSection = async (req, res) => {
  const { sectionId } = req.params;
  try {
    const content = await Content.findOne({ sectionId });
    if (content) {
      res.json(content);
    } else {
      res.json({ sectionId });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching content' });
  }
};

const updateContentSection = async (req, res) => {
  const { sectionId } = req.params;
  const payload = req.body;
  
  try {
    const updatedSection = await Content.findOneAndUpdate(
      { sectionId },
      { $set: payload },
      { new: true, upsert: true, strict: false }
    );
    res.json(updatedSection);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating content' });
  }
};

module.exports = { getContentSection, updateContentSection };
