const habitService = require('../services/habitService');

// Health check is now handled directly in index.js for /health endpoint
// This controller is kept for backward compatibility if needed
const healthCheck = (req, res) => {
  res.status(200).json({ success: true, message: 'Habit Tracker API running' });
};

const createHabit = (req, res, next) => {
  try {
    const { name, icon } = req.body;
    const habit = habitService.createHabit(name, icon);
    res.status(201).json({ success: true, data: habit });
  } catch (err) {
    next(err);
  }
};

const getAllHabits = (req, res) => {
  const habits = habitService.getAllHabits();
  res.status(200).json({ success: true, data: habits });
};

const getHabitById = (req, res, next) => {
  try {
    const { id } = req.params;
    const habit = habitService.getHabitById(id);
    res.status(200).json({ success: true, data: habit });
  } catch (err) {
    next(err);
  }
};

const logHabitStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, status } = req.body;
    const habit = habitService.logHabitStatus(id, date, status);
    res.status(200).json({ success: true, data: habit });
  } catch (err) {
    next(err);
  }
};

const updateHabit = (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, icon } = req.body;
    const habit = habitService.updateHabit(id, name, icon);
    res.json({ success: true, data: habit });
  } catch (err) {
    next(err);
  }
};

const deleteHabit = (req, res, next) => {
  try {
    const { id } = req.params;
    habitService.deleteHabit(id);
    res.status(200).json({ success: true, message: 'Habit deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const getWeeklyAnalytics = (req, res, next) => {
  try {
    const { id } = req.params;
    const analytics = habitService.getWeeklyAnalytics(id);
    res.status(200).json({ success: true, data: analytics });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  healthCheck,
  createHabit,
  getAllHabits,
  getHabitById,
  logHabitStatus,
  updateHabit,
  deleteHabit,
  getWeeklyAnalytics,
};
