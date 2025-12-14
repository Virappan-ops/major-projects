const express = require('express');
const router = express.Router();
// Dhyan de: 'updateNote' controller bhi import karna padega
const { getNotes, createNote, deleteNote, updateNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getNotes)
  .post(protect, createNote);

router.route('/:id')
  .put(protect, updateNote)   // <--- NEW: Update route add kiya
  .delete(protect, deleteNote);

module.exports = router;