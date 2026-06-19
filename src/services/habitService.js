// In-memory storage for habits
let habits = [];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

function createHabit(name, icon = '✅') {
  const { validateHabitName } = require('../utils/validation');
  const error = validateHabitName(name);
  if (error) {
    const err = new Error(error);
    err.statusCode = 400;
    throw err;
  }

  const habit = {
    id: generateId(),
    name: name.trim(),
    icon: icon || '✅',
    createdAt: getCurrentDate(),
    logs: [],
  };

  habits.push(habit);
  return habit;
}

function getAllHabits() {
  return habits;
}

function getHabitById(id) {
  const habit = habits.find((h) => h.id === id);
  if (!habit) {
    const err = new Error('Habit not found');
    err.statusCode = 404;
    throw err;
  }
  return habit;
}

function logHabitStatus(id, date, status) {
  const habit = getHabitById(id);
  const { validateDate, validateStatus } = require('../utils/validation');

  const dateError = validateDate(date);
  if (dateError) {
    const err = new Error(dateError);
    err.statusCode = 400;
    throw err;
  }

  const statusError = validateStatus(status);
  if (statusError) {
    const err = new Error(statusError);
    err.statusCode = 400;
    throw err;
  }

  const existingLog = habit.logs.find((log) => log.date === date);
  if (existingLog) {
    existingLog.status = status;
  } else {
    habit.logs.push({ date, status });
  }

  return habit;
}

function updateHabit(id, name, icon) {
  const { validateHabitName } = require('../utils/validation');
  const habit = getHabitById(id);

  if (name !== undefined) {
    const error = validateHabitName(name);
    if (error) {
      const err = new Error(error);
      err.statusCode = 400;
      throw err;
    }
    habit.name = name.trim();
  }

  if (icon !== undefined) habit.icon = icon || '✅';
  return habit;
}

function deleteHabit(id) {
  const index = habits.findIndex((h) => h.id === id);
  if (index === -1) {
    const err = new Error('Habit not found');
    err.statusCode = 404;
    throw err;
  }
  const removed = habits.splice(index, 1)[0];
  return removed;
}

function getWeeklyAnalytics(id) {
  const habit = getHabitById(id);
  const { calculateWeeklyAnalytics } = require('../utils/analytics');
  const analytics = calculateWeeklyAnalytics(habit.logs);

  return {
    habitId: habit.id,
    habitName: habit.name,
    ...analytics,
  };
}

module.exports = {
  createHabit,
  getAllHabits,
  getHabitById,
  logHabitStatus,
  updateHabit,
  deleteHabit,
  getWeeklyAnalytics,
};
