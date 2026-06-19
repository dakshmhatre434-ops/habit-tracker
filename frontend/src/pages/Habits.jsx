import { Activity, CheckCircle, Target, Zap, Plus, Loader2, AlertCircle, Inbox, Sparkles, X, TrendingUp, ArrowRight, Info, Flame, BarChart3, Calendar, Award, Search, Filter, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabits } from '../hooks/useHabits';
import HabitCard from '../components/HabitCard';
import AddHabitModal from '../components/AddHabitModal';
import Toast from '../components/Toast';
import IconPicker from '../components/IconPicker';

export default function Habits() {
  const navigate = useNavigate();
  const { habits, loading, error, fetchHabits, createHabit, logStatus, updateHabit, deleteHabit } = useHabits();
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const [editingHabit, setEditingHabit] = useState(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('✅');

  const today = new Date().toISOString().split('T')[0];

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

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setEditName(habit.name);
    setEditIcon(habit.icon || '✅');
  };

  const handleSaveEdit = async () => {
    if (!editName.trim() || editName.trim().length < 2) {
      setToast({ message: 'Habit name must be at least 2 characters', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    try {
      await updateHabit(editingHabit.id, editName.trim(), editIcon);
      setEditingHabit(null);
      setToast({ message: 'Habit updated successfully', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Failed to update habit', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filteredHabits = habits.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
    const todayLog = h.logs?.find((l) => l.date === today);
    const isCompleted = todayLog?.status === 'done';

    if (filter === 'completed') return matchesSearch && isCompleted;
    if (filter === 'pending') return matchesSearch && !isCompleted;
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">My Habits</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Manage and track your daily habits</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-2xl accent-gradient-r px-6 py-3.5 text-sm font-semibold text-white shadow-lg accent-shadow hover:shadow-xl transition"
        >
          <Plus size={18} />
          Add Habit
        </motion.button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search habits..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none accent-ring shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'completed', label: 'Completed' },
            { key: 'pending', label: 'Pending' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                filter === f.key
                  ? 'accent-bg-600 text-white shadow-lg accent-shadow'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Habit List */}
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
          <p className="text-slate-400 dark:text-slate-500 mb-10 max-w-md">Create your first habit to start tracking your progress.</p>
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

      {!loading && !error && filteredHabits.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHabits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <HabitCard
                habit={habit}
                onLog={handleLog}
                onEdit={() => handleEdit(habit)}
                onDelete={() => handleDelete(habit.id)}
                onViewAnalytics={() => navigate(`/analytics/${habit.id}`)}
                onUpdateIcon={handleUpdateIcon}
              />
            </motion.div>
          ))}
        </div>
      )}

      {!loading && !error && filteredHabits.length === 0 && habits.length > 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
          <Search size={48} className="mb-4" />
          <p className="text-xl font-semibold">No habits match your filter</p>
          <p className="text-sm">Try adjusting your search or filter</p>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingHabit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setEditingHabit(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Edit Habit</h2>
              {/* Icon Picker */}
              <div className="mb-4 flex items-center gap-3">
                <IconPicker value={editIcon} onChange={setEditIcon}>
                  <div className="w-12 h-12 rounded-2xl accent-gradient-br flex items-center justify-center shadow-lg accent-shadow cursor-pointer hover:scale-105 transition">
                    <span className="text-2xl">{editIcon}</span>
                  </div>
                </IconPicker>
                <span className="text-sm text-slate-500 dark:text-slate-400">Click icon to change</span>
              </div>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-300 dark:focus:border-indigo-500 accent-ring transition text-base mb-6"
                autoFocus
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditingHabit(null)}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveEdit}
                  className="flex-1 py-3.5 rounded-2xl accent-gradient-r text-sm font-semibold text-white shadow-lg accent-shadow"
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && <AddHabitModal onClose={() => setShowAdd(false)} onCreate={handleCreate} />}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
