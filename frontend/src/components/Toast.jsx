import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertTriangle, Info } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  const styles = {
    success: 'bg-emerald-600 dark:bg-emerald-700 border-emerald-700 dark:border-emerald-800',
    error: 'bg-red-600 dark:bg-red-700 border-red-700 dark:border-red-800',
    info: 'bg-blue-600 dark:bg-blue-700 border-blue-700 dark:border-blue-800',
    warning: 'bg-amber-500 dark:bg-amber-600 border-amber-600 dark:border-amber-700',
  };

  const icons = {
    success: Check,
    error: AlertTriangle,
    info: Info,
    warning: AlertTriangle,
  };

  const Icon = icons[type] || Check;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl ${styles[type]} border px-5 py-4 text-sm font-semibold text-white shadow-2xl`}
    >
      <Icon size={18} />
      <span>{message}</span>
      <button onClick={() => { setVisible(false); onClose?.(); }} className="ml-2 rounded-lg p-1.5 hover:bg-white/20 transition">
        <X size={14} />
      </button>
    </motion.div>
  );
}
