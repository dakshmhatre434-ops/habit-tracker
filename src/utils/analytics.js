function getLast7Days() {
  const dates = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

function buildWeekLogs(logs, dates) {
  const logMap = new Map();
  for (const log of logs) {
    logMap.set(log.date, log.status);
  }

  return dates.map((date) => ({
    date,
    status: logMap.get(date) || 'not done',
  }));
}

function calculateStreaks(weekLogs) {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Count current streak from today backwards
  for (let i = weekLogs.length - 1; i >= 0; i--) {
    if (weekLogs[i].status === 'done') {
      currentStreak++;
    } else {
      break;
    }
  }

  // Count longest streak within the 7-day window
  for (const log of weekLogs) {
    if (log.status === 'done') {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  return { currentStreak, longestStreak };
}

function calculateWeeklyAnalytics(logs) {
  const dates = getLast7Days();
  const week = buildWeekLogs(logs, dates);

  const completedDays = week.filter((d) => d.status === 'done').length;
  const missedDays = 7 - completedDays;
  const completionPercentage = parseFloat(((completedDays / 7) * 100).toFixed(2));

  const { currentStreak, longestStreak } = calculateStreaks(week);

  return {
    week,
    completedDays,
    missedDays,
    completionPercentage,
    currentStreak,
    longestStreak,
  };
}

module.exports = {
  getLast7Days,
  buildWeekLogs,
  calculateStreaks,
  calculateWeeklyAnalytics,
};
