const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');

// @desc    Get all events (Backlog + Scheduled)
// @route   GET /api/events
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ user: req.user._id });
  res.status(200).json(events);
});

// @desc    Create new event (or Backlog item)
// @route   POST /api/events
const createEvent = asyncHandler(async (req, res) => {
  const { title, date, start, duration, type, tag, isBacklog } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }

  const event = await Event.create({
    user: req.user._id,
    title,
    date,      // Optional if backlog
    start,     // Optional
    duration,  // Optional
    type,      // Optional
    tag,       // Optional
    isBacklog: isBacklog || false,
  });

  res.status(201).json(event);
});

// @desc    Update event (Move backlog to schedule, or edit details)
// @route   PUT /api/events/:id
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check user ownership
  if (event.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id,
    req.body, // Updates everything sent from frontend
    { new: true }
  );

  res.status(200).json(updatedEvent);
});

// @desc    Delete event
// @route   DELETE /api/events/:id
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (event.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await event.deleteOne();
  res.status(200).json({ id: req.params.id });
});

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };