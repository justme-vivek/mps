const Faculty = require('../models/Faculty');
const { uploadToImagekit, deleteFromImagekit } = require('../utils/media');

// @desc    Fetch all faculty
// @route   GET /api/faculty
// @access  Public
const getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find({}).sort({ order: 1, createdAt: -1 });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch a single faculty member
// @route   GET /api/faculty/:id
// @access  Public
const getFacultyById = async (req, res) => {
  try {
    const member = await Faculty.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Faculty member not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a faculty profile
// @route   POST /api/faculty
// @access  Private/Admin
const createFaculty = async (req, res) => {
  try {
    const { name, designation, bio, order } = req.body;
    if (!name || !designation) {
      return res.status(400).json({ message: 'Name and designation are required' });
    }

    let photoUrl = req.body.photoUrl || '';
    let fileId;

    if (req.file) {
      const uploaded = await uploadToImagekit(req.file, '/mps/faculty');
      photoUrl = uploaded.url;
      fileId = uploaded.fileId;
    }
    if (!photoUrl) return res.status(400).json({ message: 'A photo is required' });

    const member = await Faculty.create({ name, designation, bio: bio || '', photoUrl, fileId, order: order || 0 });
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: 'Invalid faculty data', error: error.message });
  }
};

// @desc    Update a faculty profile (optionally replace the photo)
// @route   PUT /api/faculty/:id
// @access  Private/Admin
const updateFaculty = async (req, res) => {
  try {
    const member = await Faculty.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Faculty member not found' });

    const { name, designation, bio, order } = req.body;
    if (name !== undefined) member.name = name;
    if (designation !== undefined) member.designation = designation;
    if (bio !== undefined) member.bio = bio;
    if (order !== undefined) member.order = order;

    if (req.file) {
      const uploaded = await uploadToImagekit(req.file, '/mps/faculty');
      await deleteFromImagekit(member.fileId);
      member.photoUrl = uploaded.url;
      member.fileId = uploaded.fileId;
    } else if (req.body.photoUrl && req.body.photoUrl !== member.photoUrl) {
      await deleteFromImagekit(member.fileId);
      member.photoUrl = req.body.photoUrl;
      member.fileId = undefined;
    }

    await member.save();
    res.json(member);
  } catch (error) {
    res.status(400).json({ message: 'Invalid faculty data', error: error.message });
  }
};

// @desc    Delete a faculty profile (removes the photo from ImageKit too)
// @route   DELETE /api/faculty/:id
// @access  Private/Admin
const deleteFaculty = async (req, res) => {
  try {
    const member = await Faculty.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Faculty member not found' });

    await deleteFromImagekit(member.fileId);
    await member.deleteOne();

    res.json({ message: 'Faculty removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getFaculty, getFacultyById, createFaculty, updateFaculty, deleteFaculty };
