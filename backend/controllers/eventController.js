const Event = require('../models/Event');
const { findPaged } = require('../utils/paginate');
const { uploadToImagekit, deleteFromImagekit } = require('../utils/media');

// @desc    Fetch all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await findPaged(Event, {}, { date: -1, _id: -1 }, req, res);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch a single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    if (!title || !description || !date) {
      return res.status(400).json({ message: 'Title, description and date are required' });
    }

    let bannerUrl = req.body.bannerUrl || '';
    let bannerFileId;

    if (req.file) {
      const uploaded = await uploadToImagekit(req.file, '/mps/events');
      bannerUrl = uploaded.url;
      bannerFileId = uploaded.fileId;
    }

    const event = await Event.create({ title, description, date, location: location || '', bannerUrl, bannerFileId });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: 'Invalid event data', error: error.message });
  }
};

// @desc    Update an event (optionally replace the banner image)
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { title, description, date, location } = req.body;
    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (date !== undefined) event.date = date;
    if (location !== undefined) event.location = location;

    if (req.file) {
      const uploaded = await uploadToImagekit(req.file, '/mps/events');
      await deleteFromImagekit(event.bannerFileId);
      event.bannerUrl = uploaded.url;
      event.bannerFileId = uploaded.fileId;
    } else if (req.body.bannerUrl !== undefined && req.body.bannerUrl !== event.bannerUrl) {
      await deleteFromImagekit(event.bannerFileId);
      event.bannerUrl = req.body.bannerUrl;
      event.bannerFileId = undefined;
    }

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: 'Invalid event data', error: error.message });
  }
};

// @desc    Delete an event (removes the banner from ImageKit too)
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await deleteFromImagekit(event.bannerFileId);
    await event.deleteOne();

    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
