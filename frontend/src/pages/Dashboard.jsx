import { Activity, CheckCircle, Target, Zap, Plus, Loader2, AlertCircle, Inbox, Sparkles, X, TrendingUp, ArrowRight, Info, Flame, BarChart3, Calendar, Award } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabits } from '../hooks/useHabits';
import HabitCard from '../components/HabitCard';
import AddHabitModal from '../components/AddHabitModal';
import Toast from '../components/Toast';
import WaveCanvas from '../components/WaveCanvas';
import { getRandomQuote, getTodayFormatted } from '../utils/helpers';

export default function Dashboard() {
  const navigate = useNavigate();
  const { habits, loading, error, fetchHabits, createHabit, logStatus, deleteHabit } = useHabits();
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState(null);
  const [quote] = useState(getRandomQuote);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const totalHabits = habits.length;
  const completedToday = habits.filter((h) =>
    h.logs?.some((l) => l.date === today && l.status === 'done')
  ).length;

  const totalLogs = habits.reduce((sum, h) => sum + (h.logs?.length || 0), 0);
  const doneLogs = habits.reduce(
    (sum, h) => sum + (h.logs?.filter((l) => l.status === 'done').length || 0),
    0
  );
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

  const handleCreate = async (name, icon) => {
    await createHabit(name, icon);
    setToast({ message: 'Habit created successfully', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLog = async (id, date, status) => {
    await logStatus(id, date, status);
    setToast({ message: status === 'done' ? 'Marked as done' : 'Marked as not done', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this habit?')) return;
    try {
      await deleteHabit(id);
      setToast({ message: 'Habit deleted', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ message: 'Failed to delete habit', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleUpdateIcon = async (id, icon) => {
    try {
      await updateHabit(id, undefined, icon);
      setToast({ message: 'Icon updated', type: 'success' });
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      setToast({ message: 'Failed to update icon', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const recentHabits = habits.slice(0, 5);
  const hasHabits = habits.length > 0;

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Welcome Banner */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'linear-gradient(135deg, #4f0acc 0%, #7c3aed 30%, #a855f7 60%, #ec4899 100%)',
          border: '1px solid rgba(120, 80, 255, 0.3)',
          boxShadow: '0 0 30px rgba(80, 40, 200, 0.2), inset 0 0 30px rgba(0, 0, 0, 0.3)',
        }}
        className="relative overflow-hidden rounded-[2rem] p-10 text-white hero-banner-animated"
      >
        <WaveCanvas />
        <div className="hero-banner-shimmer" style={{ zIndex: 2 }}>
          <div className="hero-banner-shimmer-bar" />
        </div>
        <div className="relative hero-banner-text flex items-center justify-between" style={{ zIndex: 3, minHeight: 120 }}>
          {/* Left */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles size={28} className="text-amber-300" />
              <span className="text-sm font-medium text-white/70">{getTodayFormatted()}</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Habit Tracker</h1>
            <p className="text-xl text-white/80 italic max-w-2xl leading-relaxed">{quote}</p>
          </div>

          {/* Center — Progress Ring */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative" style={{ width: 100, height: 100 }}>
              <svg width="100" height="100" className="-rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - (totalHabits > 0 ? completedToday / totalHabits : 0))}`}
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0}%
                </span>
              </div>
            </div>
            <span className="text-xs font-medium text-white/80">Today's Progress</span>
          </div>

          {/* Right — Stats */}
          <div className="flex flex-col gap-3 items-end">
            <div className="flex items-center gap-2 rounded-[20px] px-4 py-1.5" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Flame size={16} className="text-amber-400" />
              <span className="text-[13px] text-white"><strong>{bestStreak}</strong> day streak</span>
            </div>
            <div className="flex items-center gap-2 rounded-[20px] px-4 py-1.5" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <CheckCircle size={16} className="text-emerald-400" />
              <span className="text-[13px] text-white"><strong>{completedToday}/{totalHabits}</strong> done</span>
            </div>
            <div className="flex items-center gap-2 rounded-[20px] px-4 py-1.5" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Calendar size={16} className="text-blue-400" />
              <span className="text-[13px] text-white">Best: <strong>{bestStreakHabit ? bestStreakHabit.name : '—'}</strong></span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Statistics</h2>
          <span className="text-sm text-slate-400 dark:text-slate-500">Real-time overview</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Activity size={28} />}
            label="Total Habits"
            value={totalHabits}
            subtext={hasHabits ? 'Click to view' : 'Create a habit'}
            color="accent-gradient-br"
            onClick={hasHabits ? () => navigate('/habits') : undefined}
            disabled={!hasHabits}
          />
          <StatCard
            icon={<CheckCircle size={28} />}
            label="Completed Today"
            value={completedToday}
            subtext={hasHabits ? 'Click to view' : 'Create a habit'}
            color="from-emerald-500 to-teal-600"
            onClick={hasHabits ? () => navigate('/habits') : undefined}
            disabled={!hasHabits}
          />
          <StatCard
            icon={<Target size={28} />}
            label="Overall Completion"
            value={`${overallCompletion}%`}
            subtext="Click for details"
            color="accent-gradient-br"
            onClick={hasHabits ? () => setShowCompletionModal(true) : undefined}
            disabled={!hasHabits}
            showProgress
            progress={overallCompletion}
          />
          <StatCard
            icon={<Zap size={28} />}
            label="Best Streak"
            value={bestStreak}
            subtext="Click to view"
            color="from-amber-500 to-orange-600"
            onClick={hasHabits ? () => setShowStreakModal(true) : undefined}
            disabled={!hasHabits}
          />
        </div>
      </section>

      {/* Today's Progress */}
      {hasHabits && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Today's Progress</h2>
            <span className="text-sm text-slate-400 dark:text-slate-500">{completedToday} of {totalHabits} completed</span>
          </div>
          <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full accent-gradient-r"
            />
          </div>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-3">
            {completedToday === totalHabits && totalHabits > 0
              ? 'All habits completed today!'
              : `${totalHabits - completedToday} habit${totalHabits - completedToday !== 1 ? 's' : ''} remaining`}
          </p>
        </section>
      )}

      {/* Recent Habits */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Recent Habits</h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Last {recentHabits.length} active habits</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 rounded-2xl accent-gradient-r px-6 py-3.5 text-sm font-semibold text-white shadow-lg accent-shadow hover:shadow-xl transition"
            >
              <Plus size={18} />
              Quick Add
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/habits')}
              className="flex items-center gap-2 rounded-2xl bg-white dark:bg-slate-800 px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:bg-slate-800 transition"
            >
              View All
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-[2rem] bg-white dark:bg-slate-800 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-700/80 animate-pulse">
                <div className="h-32 bg-slate-100 dark:bg-slate-700 rounded-2xl mb-4" />
                <div className="h-5 bg-slate-100 dark:bg-slate-700 rounded w-2/3 mb-3" />
                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-[2rem] bg-red-50 dark:bg-red-900/20/80 border border-red-200/60 py-20 text-red-600 dark:text-red-400 backdrop-blur-sm">
            <AlertCircle size={48} />
            <p className="text-xl font-semibold">{error}</p>
            <button
              onClick={fetchHabits}
              className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && habits.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-[2rem] bg-white/60 dark:bg-slate-800/60 border-2 border-dashed border-slate-200 dark:border-slate-600 py-24 text-center backdrop-blur-sm"
          >
            <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-6">
              <Inbox size={48} className="text-slate-300" />
            </div>
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">No habits yet</p>
            <p className="text-slate-400 dark:text-slate-500 mb-10 max-w-md">Create your first habit to start tracking your progress and building streaks.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 rounded-2xl accent-gradient-r px-8 py-4 text-sm font-semibold text-white shadow-lg accent-shadow hover:shadow-xl transition"
            >
              <Plus size={20} />
              Create your first habit
            </motion.button>
          </motion.div>
        )}

        {!loading && !error && recentHabits.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentHabits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <HabitCard
                  habit={habit}
                  onLog={handleLog}
                  onEdit={() => navigate('/habits')}
                  onDelete={() => handleDelete(habit.id)}
                  onViewAnalytics={() => navigate(`/analytics/${habit.id}`)}
                  onUpdateIcon={handleUpdateIcon}
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      <AnimatePresence>
        {showAdd && <AddHabitModal onClose={() => setShowAdd(false)} onCreate={handleCreate} />}
      </AnimatePresence>

      <AnimatePresence>
        {showCompletionModal && (
          <CompletionModal
            overallCompletion={overallCompletion}
            doneLogs={doneLogs}
            missedLogs={missedLogs}
            totalLogs={totalLogs}
            onClose={() => setShowCompletionModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStreakModal && bestStreakHabit && (
          <StreakModal
            habit={bestStreakHabit}
            bestStreak={bestStreak}
            onClose={() => setShowStreakModal(false)}
            onViewAnalytics={() => navigate(`/analytics`)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon, label, value, subtext, color, onClick, disabled, active, showProgress, progress }) {
  const content = (
    <>
      <div className="flex items-center justify-between mb-5">
        <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
          {icon}
        </div>
        {active && (
          <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            Active
          </span>
        )}
      </div>
      <p className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">{value}</p>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-4">{label}</p>
      {showProgress && (
        <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${color}`}
          />
        </div>
      )}
      <p className="text-xs text-slate-400 dark:text-slate-500">{subtext}</p>
    </>
  );

  if (disabled) {
    return (
      <div className="relative rounded-[2rem] bg-white/80 dark:bg-slate-900/80 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-700/80 opacity-50 cursor-not-allowed group backdrop-blur-sm">
        {content}
        <div className="absolute inset-0 rounded-[2rem] bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500">Create a habit to view</span>
        </div>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ y: -6, boxShadow: '0 24px 48px rgba(0,0,0,0.12)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full text-left rounded-[2rem] bg-white/80 dark:bg-slate-900/80 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-700/80 transition-all duration-300 focus:outline-none focus:ring-4 accent-ring backdrop-blur-sm"
    >
      {content}
    </motion.button>
  );
}

function CompletionModal({ overallCompletion, doneLogs, missedLogs, totalLogs, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl accent-bg-100 accent-text-600 dark:accent-text-400">
              <Target size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Overall Completion</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-700 transition">
            <X size={20} />
          </button>
        </div>

        <div className="text-center mb-8">
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-6xl font-bold accent-text-gradient mb-2"
          >
            {overallCompletion}%
          </motion.p>
          <p className="text-slate-400 dark:text-slate-500">of all habits completed</p>
        </div>

        <div className="h-5 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden mb-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallCompletion}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full rounded-full accent-gradient-r"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20/80 p-6 text-center border border-emerald-100/60 dark:border-emerald-700/40">
            <CheckCircle size={28} className="mx-auto mb-3 text-emerald-500" />
            <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{doneLogs}</p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Completed</p>
          </div>
          <div className="rounded-2xl bg-red-50 dark:bg-red-900/20/80 p-6 text-center border border-red-100/60 dark:border-red-700/40">
            <X size={28} className="mx-auto mb-3 text-red-500" />
            <p className="text-3xl font-bold text-red-700 dark:text-red-300">{missedLogs}</p>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">Missed</p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-5 border border-slate-100 dark:border-slate-700/60">
          <div className="flex items-start gap-3">
            <Info size={18} className="text-slate-400 dark:text-slate-500 mt-0.5" />
            <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 leading-relaxed">
              Completion percentage is calculated by dividing completed logs by total logs across all habits. Each daily log entry counts toward your overall progress.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StreakModal({ habit, bestStreak, onClose, onViewAnalytics }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-100 text-amber-600 dark:text-amber-400">
              <Zap size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Best Streak</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-700 transition">
            <X size={20} />
          </button>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 p-6 mb-6 border border-amber-100/60 dark:border-amber-700/40">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1">Habit with longest streak</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{habit.name}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl accent-bg-50 dark:accent-bg-900/20 p-6 text-center border accent-border-100/60 dark:border-slate-700/40">
            <Zap size={28} className="mx-auto mb-3 accent-text-500" />
            <p className="text-4xl font-bold accent-text-700 dark:accent-text-300">{bestStreak}</p>
            <p className="text-sm accent-text-600 dark:accent-text-400 font-medium">Current Streak</p>
          </div>
          <div className="rounded-2xl accent-bg-50 dark:accent-bg-900/20 p-6 text-center border accent-border-100/60 dark:border-slate-700/40">
            <TrendingUp size={28} className="mx-auto mb-3 accent-text-500" />
            <p className="text-4xl font-bold accent-text-700 dark:accent-text-300">{bestStreak}</p>
            <p className="text-sm accent-text-600 dark:accent-text-400 font-medium">Longest Streak</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { onClose(); onViewAnalytics(); }}
          className="w-full flex items-center justify-center gap-2 rounded-2xl accent-gradient-r px-6 py-4 text-sm font-semibold text-white shadow-lg accent-shadow hover:shadow-xl transition"
        >
          <ArrowRight size={18} />
          View Analytics
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
