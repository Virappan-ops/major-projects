const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    
    // Planner 2 Specific Fields
    // NOTE: 'required' hata diya gaya hai taaki Inbox items bina date ke save ho sakein
    date: { type: String }, 
    
    start: { type: Number, default: 9 }, 
    duration: { type: Number, default: 1 }, 
    type: { type: String, default: 'purple' }, 
    tag: { type: String, default: 'Work' }, 
    
    // Inbox vs Schedule identifier
    isBacklog: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);