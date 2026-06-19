import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const ICON_CATEGORIES = [
  {
    name: 'Fitness',
    icons: ['💪', '🏋️', '🚴', '🏃', '🧘', '🤸', '🏊'],
  },
  {
    name: 'Study',
    icons: ['📖', '📚', '✍️', '🎓', '💻', '🔬'],
  },
  {
    name: 'Health',
    icons: ['🌿', '💧', '🥗', '😴', '🧘', '💊'],
  },
  {
    name: 'Productivity',
    icons: ['⚡', '✅', '🎯', '📝', '⏰', '🔥'],
  },
  {
    name: 'Lifestyle',
    icons: ['😊', '🎵', '🎨', '🌅', '🐾', '🌱'],
  },
];

export default function AddHabitModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('✅');
  const [showPicker, setShowPicker] = useState(false);
  const [customEmoji, setCustomEmoji] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const pickerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Habit name is required');
      return;
    }
    if (name.trim().length < 2) {
      setError('Habit name must be at least 2 characters');
      return;
    }
    if (name.trim().length > 50) {
      setError('Habit name must be less than 50 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onCreate(name.trim(), icon);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create habit');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomEmoji = (e) => {
    const val = e.target.value;
    setCustomEmoji(val);
    if (val) setIcon(val);
  };

  const selectIcon = (emoji) => {
    setIcon(emoji);
    setCustomEmoji(emoji);
    setShowPicker(false);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    }
    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPicker]);

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
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="accent-gradient-r p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Create New Habit</h2>
              <p className="text-white/70 mt-1">Start tracking something new</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Icon Picker */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Icon
            </label>
            <div className="relative" ref={pickerRef}>
              <button
                type="button"
                onClick={() => setShowPicker(!showPicker)}
                className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 text-slate-800 dark:text-slate-100 focus:outline-none accent-ring transition text-base"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{icon === '✅' ? 'Default' : 'Custom icon'}</span>
                </div>
                <ChevronDown size={18} className="text-slate-400" />
              </button>

              <AnimatePresence>
                {showPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-4 z-50 max-h-[320px] overflow-y-auto"
                  >
                    {ICON_CATEGORIES.map((cat) => (
                      <div key={cat.name} className="mb-4 last:mb-0">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                          {cat.name}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {cat.icons.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => selectIcon(emoji)}
                              className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition hover:scale-110 ${
                                icon === emoji
                                  ? 'bg-accent-100 dark:bg-accent-900/30 ring-2 ring-accent-500'
                                  : 'bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600'
                              }`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                        Custom
                      </p>
                      <input
                        type="text"
                        value={customEmoji}
                        onChange={handleCustomEmoji}
                        placeholder="Type or paste any emoji..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-accent-500 text-sm"
                        maxLength={10}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Habit Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Exercise, Read 30 mins..."
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-300 dark:focus:border-indigo-500 accent-ring transition text-base"
              autoFocus
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5"
              >
                <X size={14} />
                {error}
              </motion.p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl accent-gradient-r text-sm font-semibold text-white shadow-lg accent-shadow hover:shadow-xl transition disabled:opacity-50"
            >
              <Plus size={18} />
              {loading ? 'Creating...' : 'Create Habit'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
