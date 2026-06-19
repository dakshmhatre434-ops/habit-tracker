import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Palette, Bell, Info, ChevronRight, Check, Monitor, Sparkles, Zap, BarChart3, User, LogOut, HelpCircle, Settings, Calendar, Award } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ProfileModal({ onClose, onOpenSettings }) {
  const { theme, toggleTheme } = useTheme();

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
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative accent-gradient-br p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 hover:bg-white/30 transition"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">User</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
                  Pro Plan
                </span>
                <span className="text-xs text-white/70">Member since Jan 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-1">
          <ProfileMenuItem
            icon={<Settings size={20} />}
            label="Settings"
            onClick={() => { onClose(); onOpenSettings(); }}
          />
          <ProfileMenuItem
            icon={theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            label={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            description={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            onClick={() => { toggleTheme(); }}
          />
          <ProfileMenuItem
            icon={<HelpCircle size={20} />}
            label="Help & Support"
            description="Documentation & FAQ"
          />
          <ProfileMenuItem
            icon={<Info size={20} />}
            label="About"
            description="Habit Tracker v1.0.0"
          />
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <ProfileMenuItem
              icon={<LogOut size={20} />}
              label="Logout"
              danger
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProfileMenuItem({ icon, label, description, onClick, disabled, danger }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : danger
          ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400'
          : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200'
      }`}
    >
      <div className={`p-2 rounded-xl ${danger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm">{label}</p>
        {description && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      <ChevronRight size={16} className="text-slate-400 dark:text-slate-500" />
    </button>
  );
}
