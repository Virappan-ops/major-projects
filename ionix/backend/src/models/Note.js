const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    // content hata kar pages array banaya hai UI match karne ke liye
    pages: [{ type: String }], 
    size: { 
      type: String, 
      default: 'square',
      enum: ['square', 'wide', 'tall', 'big'] // Valid sizes
    },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);