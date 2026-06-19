import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, BarChart3, Calendar, TrendingUp, ArrowLeft, Target, Zap, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import api from '../services/api';

export default function AnalyticsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [id]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/habits/${id}/weekly`);
      setData(response.data);
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
          <div className="h-16 bg-slate-100 rounded-2xl w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-slate-100 rounded-[2rem]" />
            ))}
          </div>
          <div className="h-80 bg-slate-100 rounded-[2rem]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col items-center justify-center py-24 text-red-600">
          <X size={48} className="mb-4" />
          <p className="text-xl font-semibold">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-4 rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { habit, analytics } = data;

  const chartData = analytics.weekData.map(day => ({
    name: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    fullDate: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    status: day.status,
    value: day.status === 'done' ? 1 : day.status === 'not_done' ? 0 : null
  }));

  const streakData = analytics.weekData.map((day, i) => ({
    name: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    streak: day.status === 'done' ? i + 1 : 0
  }));

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
          onClick={() => navigate('/')}
          className="p-3 rounded-2xl bg-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100/80 text-slate-600 hover:accent-text-600 transition backdrop-blur-sm"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{habit.name}</h1>
          <p className="text-sm text-slate-400 mt-1">Analytics & Insights</p>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100/80 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3.5 rounded-2xl accent-gradient-br text-white shadow-lg accent-shadow">
              <Target size={24} />
            </div>
            <span className="text-sm font-semibold text-slate-500">Completion Rate</span>
          </div>
          <p className="text-4xl font-bold text-slate-900">{analytics.completionRate}%</p>
          <p className="text-sm text-slate-400 mt-2">{analytics.completedDays} of {analytics.totalDays} days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100/80 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-200">
              <Zap size={24} />
            </div>
            <span className="text-sm font-semibold text-slate-500">Current Streak</span>
          </div>
          <p className="text-4xl font-bold text-slate-900">{analytics.currentStreak}</p>
          <p className="text-sm text-slate-400 mt-2">days in a row</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100/80 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200">
              <Award size={24} />
            </div>
            <span className="text-sm font-semibold text-slate-500">Longest Streak</span>
          </div>
          <p className="text-4xl font-bold text-slate-900">{analytics.longestStreak}</p>
          <p className="text-sm text-slate-400 mt-2">days ever</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100/80 backdrop-blur-sm"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 size={20} className="accent-text-500" />
              Weekly Progress
            </h3>
            <p className="text-sm text-slate-400 mt-1">Last 7 days activity</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 1]} ticks={[0, 1]} />
              <Tooltip
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', padding: '12px 16px' }}
                cursor={{ fill: '#f8fafc' }}
                formatter={(value) => value === 1 ? 'Done' : 'Not Done'}
              />
              <Bar
                dataKey="value"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
                shape={(props) => {
                  const { value } = props;
                  return <rect {...props} fill={value === 1 ? '#10b981' : '#ef4444'} />;
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100/80 backdrop-blur-sm"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={20} className="accent-text-500" />
              Streak Trend
            </h3>
            <p className="text-sm text-slate-400 mt-1">Streak accumulation over time</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={streakData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', padding: '12px 16px' }}
                cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="streak"
                stroke="#8b5cf6"
                fill="url(#streakGradient)"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#7c3aed', strokeWidth: 3, stroke: '#fff' }}
              />
              <defs>
                <linearGradient id="streakGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Weekly Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100/80 backdrop-blur-sm"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={20} className="text-emerald-500" />
            Weekly Log
          </h3>
          <p className="text-sm text-slate-400 mt-1">Day-by-day breakdown</p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-6 py-4 text-left font-semibold text-slate-600">Date</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-right font-semibold text-slate-600">Streak</th>
              </tr>
            </thead>
            <tbody>
              {analytics.weekData.map((day, index) => (
                <tr key={day.date} className="border-t border-slate-50 hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    {day.status === 'done' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-100">
                        <Check size={14} />
                        Completed
                      </span>
                    ) : day.status === 'not_done' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 border border-red-100">
                        <X size={14} />
                        Missed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500 border border-slate-100">
                        No Log
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-700">
                    {day.status === 'done' ? index + 1 : 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
