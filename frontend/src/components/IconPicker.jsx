import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const ICON_CATEGORIES = [
  { name: 'Fitness', icons: ['💪', '🏋️', '🚴', '🏃', '🧘', '🤸', '🏊'] },
  { name: 'Study', icons: ['📖', '📚', '✍️', '🎓', '💻', '🔬'] },
  { name: 'Health', icons: ['🌿', '💧', '🥗', '😴', '💊'] },
  { name: 'Productivity', icons: ['⚡', '✅', '🎯', '📝', '⏰', '🔥'] },
  { name: 'Lifestyle', icons: ['😊', '🎵', '🎨', '🌅', '🐾', '🌱'] },
];

export default function IconPicker({ value, onChange, children }) {
  const [open, setOpen] = useState(false);
  const [customEmoji, setCustomEmoji] = useState(value || '');
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const selectIcon = (emoji) => {
    onChange(emoji);
    setCustomEmoji(emoji);
    setOpen(false);
  };

  const handleCustom = (e) => {
    const val = e.target.value;
    setCustomEmoji(val);
    if (val) onChange(val);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2"
      >
        {children || (
          <>
            <span className="text-2xl">{value || '✅'}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-4 z-50 w-72 max-h-[280px] overflow-y-auto"
          >
            {ICON_CATEGORIES.map((cat) => (
              <div key={cat.name} className="mb-3 last:mb-0">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                  {cat.name}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.icons.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => selectIcon(emoji)}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition hover:scale-110 ${
                        value === emoji
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
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Custom
              </p>
              <input
                type="text"
                value={customEmoji}
                onChange={handleCustom}
                placeholder="Type emoji..."
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-accent-500 text-sm"
                maxLength={10}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
