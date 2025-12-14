const asyncHandler = require('express-async-handler'); // Agar aapke paas ye package hai to use kare, nahi to try-catch
const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  const { title, tag, priority, due, color } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Please add a task title' });
  }

  try {
    const task = await Task.create({
      user: req.user._id, // User ID attach karna zaroori hai
      title,
      tag,
      priority,
      due,
      color,
      completed: false
    });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // User Check
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      req.body, // Poora body update (title, completed, tag sab kuch)
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
  
    if (!task) return res.status(404).json({ message: "Task not found" });
  
    // User Check
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized" });
    }
  
    await task.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };