const asyncHandler = require('express-async-handler');
const Note = require('../models/Note');

// @desc    Get user notes
// @route   GET /api/notes
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(notes);
});

// @desc    Create new note
// @route   POST /api/notes
const createNote = asyncHandler(async (req, res) => {
  const { title, pages, size } = req.body; // Ab hum pages aur size expect kar rahe hain

  if (!title) {
    res.status(400);
    throw new Error('Please add a title field');
  }

  const note = await Note.create({
    user: req.user.id,
    title,
    pages: pages || [""], // Agar pages nahi aaye to empty array
    size: size || 'square',
  });

  res.status(200).json(note);
});

// @desc    Update note
// @route   PUT /api/notes/:id
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the note user
  if (note.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    req.body, // Poora body update kardo (title, pages, size sab aa jayega)
    { new: true }
  );

  res.status(200).json(updatedNote);
});

// @desc    Delete note
// @route   DELETE /api/notes/:id
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  if (note.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await note.deleteOne();
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};