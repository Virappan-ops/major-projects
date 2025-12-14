const Note = require('../models/Note');
const Task = require('../models/Task');
const Event = require('../models/Event');

const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Fetch Counts
    const totalNotes = await Note.countDocuments({ user: userId });
    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({ user: userId, isCompleted: true });
    const totalEvents = await Event.countDocuments({ user: userId });

    // 2. Calculate Task Completion Rate
    const taskRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // 3. Dummy Data for Activity Graph (Simulation for Premium Visuals)
    // In a real app, you would aggregate data by creation date
    const activityData = [
      { name: 'Mon', tasks: 4, notes: 2 },
      { name: 'Tue', tasks: 3, notes: 5 },
      { name: 'Wed', tasks: 2, notes: 1 },
      { name: 'Thu', tasks: 6, notes: 4 },
      { name: 'Fri', tasks: 8, notes: 3 },
      { name: 'Sat', tasks: 5, notes: 2 },
      { name: 'Sun', tasks: 4, notes: 6 },
    ];

    res.json({
      totalNotes,
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
      totalEvents,
      taskRate,
      activityData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getAnalytics };