const validateHabitName = (name) => {
  if (!name || typeof name !== 'string') {
    return 'Habit name is required';
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return 'Habit name must be at least 2 characters';
  }
  if (trimmed.length > 50) {
    return 'Habit name must be at most 50 characters';
  }
  return null;
};

const validateDate = (date) => {
  if (!date || typeof date !== 'string') {
    return 'Date is required';
  }
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) {
    return 'Date must be in YYYY-MM-DD format';
  }
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    return 'Date is invalid';
  }
  return null;
};

const validateStatus = (status) => {
  if (!status || typeof status !== 'string') {
    return 'Status is required';
  }
  if (status !== 'done' && status !== 'not done') {
    return 'Status must be "done" or "not done"';
  }
  return null;
};

module.exports = {
  validateHabitName,
  validateDate,
  validateStatus,
};
