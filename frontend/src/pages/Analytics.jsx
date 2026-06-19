import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, BarChart3, Calendar, TrendingUp, ArrowLeft, Target, Zap, Award, Flame, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import api from '../services/api';
import { useChartTheme } from '../hooks/useChartTheme';

export default function Analytics() {
  const navigate = useNavigate();
  const chartTheme = useChartTheme();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await api.get('/habits');
      setHabits(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-slate-100 dark:bg-slate-700 rounded-[2rem]" />
            ))}
          </div>
          <div className="h-80 bg-slate-100 dark:bg-slate-700 rounded-[2rem]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col items-center justify-center py-24 text-red-600 dark:text-red-400">
          <X size={48} className="mb-4" />
          <p className="text-xl font-semibold">{error}</p>
          <button
            onClick={fetchHabits}
            className="mt-4 rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hasHabits = habits.length > 0;

  // Overall stats
  const totalHabits = habits.length;
  const totalLogs = habits.reduce((sum, h) => sum + (h.logs?.length || 0), 0);
  const doneLogs = habits.reduce((sum, h) => sum + (h.logs?.filter(l => l.status === 'done').length || 0), 0);
  const missedLogs = totalLogs - doneLogs;
  const overallCompletion = totalLogs > 0 ? Math.round((doneLogs / totalLogs) * 100) : 0;

  let bestStreak = 0;
  let bestStreakHabit = null;
  for (const habit of habits) {
    let streak = 0;
    const sorted = [...(habit.logs || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
    for (const log of sorted) {
      if (log.status === 'done') streak++;
      else break;
    }
    if (streak > bestStreak) {
      bestStreak = streak;
      bestStreakHabit = habit;
    }
  }

  // Chart data - habit completion overview
  const weeklyData = habits.map(h => {
    const done = h.logs?.filter(l => l.status === 'done').length || 0;
    const total = h.logs?.length || 0;
    return {
      name: h.name.length > 10 ? h.name.substring(0, 10) + '...' : h.name,
      completed: done,
      missed: total - done
    };
  });

  // Pie chart data
  const pieData = [
    { name: 'Completed', value: doneLogs, color: '#10b981' },
    { name: 'Missed', value: missedLogs, color: '#ef4444' }
  ];

  // Monthly trend (mock data based on logs)
  const monthlyData = [
    { name: 'Week 1', completion: 65 },
    { name: 'Week 2', completion: 72 },
    { name: 'Week 3', completion: 58 },
    { name: 'Week 4', completion: overallCompletion },
  ];

  // Habit comparison
  const comparisonData = habits.map(h => {
    const done = h.logs?.filter(l => l.status === 'done').length || 0;
    const total = h.logs?.length || 0;
    return {
      name: h.name.length > 8 ? h.name.substring(0, 8) + '...' : h.name,
      rate: total > 0 ? Math.round((done / total) * 100) : 0
    };
  }).sort((a, b) => b.rate - a.rate);

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:accent-text-600 dark:hover:accent-text-400 transition backdrop-blur-sm"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Analytics</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Deep insights into your habits</p>
        </div>
      </motion.div>

      {!hasHabits && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-[2rem] bg-white/60 dark:bg-slate-800/60 border-2 border-dashed border-slate-200 dark:border-slate-600 py-24 text-center backdrop-blur-sm"
        >
          <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-6">
            <BarChart3 size={48} className="text-slate-300" />
          </div>
          <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">No data yet</p>
          <p className="text-slate-400 dark:text-slate-500 mb-10 max-w-md">Create habits and log your progress to see analytics.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/habits')}
            className="flex items-center gap-2 rounded-2xl accent-gradient-r px-8 py-4 text-sm font-semibold text-white shadow-lg accent-shadow hover:shadow-xl transition"
          >
            Go to Habits
          </motion.button>
        </motion.div>
      )}

      {hasHabits && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-700/80 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3.5 rounded-2xl accent-gradient-br text-white shadow-lg accent-shadow">
                  <Target size={24} />
                </div>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Overall Completion</span>
              </div>
              <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">{overallCompletion}%</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">{doneLogs} of {totalLogs} logs</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-700/80 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-200 dark:shadow-amber-900/30">
                  <Zap size={24} />
                </div>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Best Streak</span>
              </div>
              <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">{bestStreak}</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">{bestStreakHabit?.name || 'No streaks yet'}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-700/80 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30">
                  <Award size={24} />
                </div>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Habits</span>
              </div>
              <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">{totalHabits}</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Active tracking</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-700/80 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30">
                  <Activity size={24} />
                </div>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Logs</span>
              </div>
              <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">{totalLogs}</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Entries recorded</p>
            </motion.div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-700/80 backdrop-blur-sm"
            >
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <BarChart3 size={20} className="accent-text-500" />
                  Habit Completion Overview
                </h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Completed vs missed logs per habit</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridStroke} vertical={false} />
                  <XAxis dataKey="name" stroke={chartTheme.axisStroke} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={chartTheme.axisStroke} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.12)', 
                      padding: '12px 16px',
                      backgroundColor: chartTheme.tooltipBg,
                      color: chartTheme.tooltipText
                    }}
                    cursor={{ fill: chartTheme.cursorFill }}
                  />
                  <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="missed" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-700/80 backdrop-blur-sm"
            >
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <PieChartIcon size={20} className="text-amber-500" />
                  Completion Distribution
                </h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Overall done vs missed ratio</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                    backgroundColor: chartTheme.tooltipBg,
                    color: chartTheme.tooltipText
                  }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-8 mt-4">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-700/80 backdrop-blur-sm"
            >
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <TrendingUp size={20} className="accent-text-500" />
                  Monthly Trend
                </h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Completion rate over time</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridStroke} vertical={false} />
                  <XAxis dataKey="name" stroke={chartTheme.axisStroke} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={chartTheme.axisStroke} fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.12)', 
                      padding: '12px 16px',
                      backgroundColor: chartTheme.tooltipBg,
                      color: chartTheme.tooltipText
                    }}
                    cursor={{ stroke: chartTheme.cursorStroke, strokeWidth: 2 }}
                    formatter={(value) => `${value}%`}
                  />
                  <Area
                    type="monotone"
                    dataKey="completion"
                    stroke="#8b5cf6"
                    fill="url(#trendGradient)"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, fill: '#7c3aed', strokeWidth: 3, stroke: '#fff' }}
                  />
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-700/80 backdrop-blur-sm"
            >
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Flame size={20} className="text-orange-500" />
                  Habit Comparison
                </h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Ranked by completion rate</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={comparisonData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridStroke} horizontal={false} />
                  <XAxis type="number" stroke={chartTheme.axisStroke} fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" stroke={chartTheme.axisStroke} fontSize={12} tickLine={false} axisLine={false} width={80} />
                  <Tooltip
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.12)', 
                      padding: '12px 16px',
                      backgroundColor: chartTheme.tooltipBg,
                      color: chartTheme.tooltipText
                    }}
                    cursor={{ fill: chartTheme.cursorFill }}
                    formatter={(value) => `${value}%`}
                  />
                  <Bar dataKey="rate" fill="#f59e0b" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Calendar Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-700/80 backdrop-blur-sm"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Calendar size={20} className="text-emerald-500" />
                Activity Calendar
              </h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Last 28 days activity heatmap</p>
            </div>
            <CalendarHeatmap habits={habits} />
          </motion.div>
        </>
      )}
    </div>
  );
}

function CalendarHeatmap({ habits }) {
  const today = new Date();
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const days = [];
  for (let i = 27; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push(date);
  }

  // Build daily data structure: { "YYYY-MM-DD": { completed: [...], total: N } }
  const getDayData = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const completed = [];
    const missed = [];
    let total = 0;

    for (const habit of habits) {
      const log = habit.logs?.find(l => l.date === dateStr);
      if (log) {
        total++;
        if (log.status === 'done') {
          completed.push(habit.name);
        } else {
          missed.push(habit.name);
        }
      }
    }

    return { dateStr, completed, missed, total, doneCount: completed.length };
  };

  // Intensity levels: 0=none, 1=low, 2=medium, 3=high
  const getIntensity = (dayData) => {
    if (dayData.total === 0) return 0;
    const rate = dayData.doneCount / dayData.total;
    if (rate === 0) return 0;
    if (rate < 0.5) return 1;
    if (rate < 1) return 2;
    return 3;
  };

  const intensityColors = {
    0: 'bg-slate-100 dark:bg-slate-700',
    1: 'bg-emerald-200 dark:bg-emerald-900/40',
    2: 'bg-emerald-400 dark:bg-emerald-700',
    3: 'bg-emerald-600 dark:bg-emerald-500'
  };

  const intensityLabels = {
    0: 'No activity',
    1: 'Low activity',
    2: 'Medium activity',
    3: 'High activity'
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Weekly summary (last 7 days)
  const last7Days = days.slice(-7);
  const weekData = last7Days.map(d => getDayData(d));
  const weekCompleted = weekData.reduce((sum, d) => sum + d.doneCount, 0);
  const weekTotal = weekData.reduce((sum, d) => sum + d.total, 0);
  const weekCompletionPct = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;

  const bestDay = weekData.reduce((best, d) => {
    if (d.total === 0) return best;
    const rate = d.doneCount / d.total;
    if (!best || rate > best.rate) return { ...d, rate };
    return best;
  }, null);

  // Current streak (from today backwards)
  let currentStreak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const d = getDayData(days[i]);
    const intensity = getIntensity(d);
    if (intensity >= 2) currentStreak++;
    else if (intensity === 0 && d.total > 0) break;
    else if (i < days.length - 1) break;
  }

  const handleMouseEnter = (e, day) => {
    const rect = e.target.getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
    setHoveredDay(day);
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  return (
    <div>
      {/* Weekly Summary */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[140px] bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">This Week</p>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{weekCompletionPct}%</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">completion rate</p>
        </div>
        <div className="flex-1 min-w-[140px] bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Best Day</p>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {bestDay ? new Date(bestDay.dateStr).toLocaleDateString('en-US', { weekday: 'short' }) : '—'}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {bestDay ? `${bestDay.doneCount}/${bestDay.total} habits` : 'No data'}
          </p>
        </div>
        <div className="flex-1 min-w-[140px] bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Current Streak</p>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{currentStreak} days</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">medium+ activity</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {weekDays.map(d => (
          <span key={d} className="w-10 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">{d}</span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 relative">
        {days.map((day, i) => {
          const dayData = getDayData(day);
          const intensity = getIntensity(dayData);
          const isHovered = hoveredDay && hoveredDay.toISOString().split('T')[0] === dayData.dateStr;

          return (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className={`w-10 h-10 rounded-xl ${intensityColors[intensity]} flex items-center justify-center transition hover:scale-110 cursor-pointer relative ${isHovered ? 'ring-2 ring-slate-400 dark:ring-slate-500 z-10' : ''}`}
              onMouseEnter={(e) => handleMouseEnter(e, day)}
              onMouseLeave={handleMouseLeave}
            >
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{day.getDate()}</span>
            </motion.div>
          );
        })}

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredDay && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="fixed z-50 pointer-events-none"
              style={{
                left: tooltipPos.x,
                top: tooltipPos.y,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <DayTooltip day={hoveredDay} habits={habits} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <span className="text-xs text-slate-400 dark:text-slate-500">Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map(level => (
            <div key={level} className={`w-4 h-4 rounded ${intensityColors[level]}`} title={intensityLabels[level]} />
          ))}
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">More</span>
      </div>
    </div>
  );
}

function DayTooltip({ day, habits }) {
  const dateStr = day.toISOString().split('T')[0];
  const completed = [];
  const missed = [];
  let total = 0;

  for (const habit of habits) {
    const log = habit.logs?.find(l => l.date === dateStr);
    if (log) {
      total++;
      if (log.status === 'done') completed.push(habit.name);
      else missed.push(habit.name);
    }
  }

  const pct = total > 0 ? Math.round((completed.length / total) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-4 min-w-[220px] max-w-[280px]">
      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">
        {day.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
      </p>

      {total === 0 ? (
        <p className="text-xs text-slate-400 dark:text-slate-500">No habits tracked</p>
      ) : (
        <div className="space-y-2">
          {completed.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Completed:</p>
              <div className="flex flex-wrap gap-1">
                {completed.map((name, idx) => (
                  <span key={name} className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[10px] font-medium flex items-center gap-1">
                    {habits.find(h => h.name === name)?.icon || '✅'} {name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {missed.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-500 dark:text-red-400 mb-1">Missed:</p>
              <div className="flex flex-wrap gap-1">
                {missed.map((name, idx) => (
                  <span key={name} className="px-2 py-0.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-[10px] font-medium flex items-center gap-1">
                    {habits.find(h => h.name === name)?.icon || '✅'} {name}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold">{completed.length}/{total}</span> habits — <span className="font-bold">{pct}%</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
