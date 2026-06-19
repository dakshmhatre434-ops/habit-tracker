import { motion } from 'framer-motion';
import { CheckCircle, XCircle, TrendingUp, ArrowRight, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import IconPicker from './IconPicker';

export default function HabitCard({ habit, onLog, onEdit, onDelete, onViewAnalytics, onUpdateIcon }) {
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const todayLog = habit.logs?.find((l) => l.date === today);
  const todayStatus = todayLog?.status || null;

  const totalLogs = habit.logs?.length || 0;
  const doneLogs = habit.logs?.filter((l) => l.status === 'done').length || 0;
  const completionRate = totalLogs > 0 ? Math.round((doneLogs / totalLogs) * 100) : 0;

  let streak = 0;
  const sorted = [...(habit.logs || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
  for (const log of sorted) {
    if (log.status === 'done') streak++;
    else break;
  }

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: '0 24px 48px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-slate-100/80 dark:border-slate-700/80 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <IconPicker value={habit.icon} onChange={(icon) => onUpdateIcon(habit.id, icon)}>
              <div className="w-12 h-12 rounded-2xl accent-gradient-br flex items-center justify-center shadow-lg accent-shadow cursor-pointer hover:scale-105 transition">
                <span className="text-2xl">{habit.icon || '✅'}</span>
              </div>
            </IconPicker>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{habit.name}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Created {new Date(habit.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-100/60 dark:border-amber-700/40">
            <TrendingUp size={14} className="text-amber-500 dark:text-amber-400" />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300">{streak} day streak</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Completion</span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{completionRate}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              completionRate >= 80
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                : completionRate >= 50
                ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                : 'bg-gradient-to-r from-red-400 to-red-500'
            }`}
          />
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{doneLogs} of {totalLogs} days completed</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onLog(habit.id, today, 'done')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition ${
            todayStatus === 'done'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400'
          }`}
        >
          <CheckCircle size={18} />
          {todayStatus === 'done' ? 'Done' : 'Mark Done'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onLog(habit.id, today, 'not done')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition ${
            todayStatus === 'not done'
              ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-200 dark:shadow-red-900/30'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-400'
          }`}
        >
          <XCircle size={18} />
          {todayStatus === 'not done' ? 'Not Done' : 'Mark Not Done'}
        </motion.button>
      </div>

      {/* Management Actions */}
      <div className="flex items-center gap-2 mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          <Pencil size={16} />
          Edit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
        >
          <Trash2 size={16} />
          Delete
        </motion.button>
      </div>

      {/* Footer */}
      <motion.button
        whileHover={{ x: 4 }}
        onClick={onViewAnalytics}
        className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold accent-text-600 dark:accent-text-400 hover:accent-bg-50/80 dark:hover:accent-bg-900/30 transition"
      >
        <span>View Analytics</span>
        <ArrowRight size={16} />
      </motion.button>
    </motion.div>
  );
}
