const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true }, // 'text' ko 'title' kar diya
    tag: { type: String, default: 'Personal' },
    priority: { type: String, default: 'Medium' },
    due: { type: String, default: 'Today' },
    color: { type: String, default: '#8b5cf6' }, // Tag color persist karne ke liye
    completed: { type: Boolean, default: false }, // 'isCompleted' ko 'completed' kar diya simple rakhne ke liye
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);