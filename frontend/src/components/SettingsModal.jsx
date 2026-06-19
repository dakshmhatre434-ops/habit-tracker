import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Palette, Bell, Info, ChevronRight, Check, Monitor, Sparkles, Zap, BarChart3 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('appearance');
  const { theme, toggleTheme, accentColor, setAccentColor } = useTheme();
  const [showQuote, setShowQuote] = useState(true);
  const [showAnimations, setShowAnimations] = useState(true);
  const [successNotifications, setSuccessNotifications] = useState(true);
  const [reminderNotifications, setReminderNotifications] = useState(false);

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'about', label: 'About', icon: Info },
  ];

  const colors = [
    { id: 'indigo', bg: 'bg-indigo-500', ring: 'ring-indigo-300 dark:ring-indigo-500' },
    { id: 'blue', bg: 'bg-blue-500', ring: 'ring-blue-300 dark:ring-blue-500' },
    { id: 'purple', bg: 'bg-purple-500', ring: 'ring-purple-300 dark:ring-purple-500' },
    { id: 'emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-300 dark:ring-emerald-500' },
    { id: 'orange', bg: 'bg-orange-500', ring: 'ring-orange-300 dark:ring-orange-500' },
    { id: 'rose', bg: 'bg-rose-500', ring: 'ring-rose-300 dark:ring-rose-500' },
  ];

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
        className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              <Zap size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Settings</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <X size={20} />
          </motion.button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-56 border-r border-slate-100 dark:border-slate-700 p-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'accent-bg-50 dark:accent-bg-900/30 accent-text-700 dark:accent-text-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                  {isActive && <ChevronRight size={16} className="ml-auto" />}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'appearance' && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Theme</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => { if (theme === 'dark') toggleTheme(); }}
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition ${
                          theme === 'light' ? 'accent-border-500 accent-bg-50 dark:accent-bg-900/30' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                        }`}
                      >
                        <Sun size={24} className={theme === 'light' ? 'accent-text-600 dark:accent-text-400' : 'text-slate-400 dark:text-slate-500'} />
                        <div className="text-left">
                          <p className={`font-semibold ${theme === 'light' ? 'accent-text-900 dark:accent-text-300' : 'text-slate-700 dark:text-slate-300'}`}>Light</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Default theme</p>
                        </div>
                        {theme === 'light' && <Check size={18} className="ml-auto accent-text-600 dark:accent-text-400" />}
                      </button>
                      <button
                        onClick={() => { if (theme === 'light') toggleTheme(); }}
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition ${
                          theme === 'dark' ? 'accent-border-500 accent-bg-50 dark:accent-bg-900/30' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                        }`}
                      >
                        <Moon size={24} className={theme === 'dark' ? 'accent-text-600 dark:accent-text-400' : 'text-slate-400 dark:text-slate-500'} />
                        <div className="text-left">
                          <p className={`font-semibold ${theme === 'dark' ? 'accent-text-900 dark:accent-text-300' : 'text-slate-700 dark:text-slate-300'}`}>Dark</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Easier on the eyes</p>
                        </div>
                        {theme === 'dark' && <Check size={18} className="ml-auto accent-text-600 dark:accent-text-400" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Accent Color</h3>
                    <div className="flex gap-3">
                      {colors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setAccentColor(color.id)}
                          className={`w-12 h-12 rounded-2xl ${color.bg} transition ${
                            accentColor === color.id ? `ring-4 ${color.ring} scale-110` : 'hover:scale-105'
                          }`}
                        >
                          {accentColor === color.id && (
                            <Check size={20} className="mx-auto text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <ToggleSetting
                    icon={<Sparkles size={20} />}
                    label="Motivational Quote"
                    description="Show a daily quote on the dashboard"
                    enabled={showQuote}
                    onToggle={() => setShowQuote(!showQuote)}
                  />
                  <ToggleSetting
                    icon={<Monitor size={20} />}
                    label="Dashboard Animations"
                    description="Enable smooth animations and transitions"
                    enabled={showAnimations}
                    onToggle={() => setShowAnimations(!showAnimations)}
                  />
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <ToggleSetting
                    icon={<Check size={20} />}
                    label="Success Notifications"
                    description="Show toast when habits are completed"
                    enabled={successNotifications}
                    onToggle={() => setSuccessNotifications(!successNotifications)}
                  />
                  <ToggleSetting
                    icon={<Bell size={20} />}
                    label="Reminder Notifications"
                    description="Daily reminders to log your habits"
                    enabled={reminderNotifications}
                    onToggle={() => setReminderNotifications(!reminderNotifications)}
                  />
                </motion.div>
              )}

              {activeTab === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="text-center py-4">
                    <div className="w-20 h-20 rounded-3xl accent-gradient-br flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Zap size={36} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Habit Tracker</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Version 1.0.0</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-700 p-5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Tech Stack</span>
                      <span className="text-slate-700 dark:text-slate-200 font-medium">React, Vite, Tailwind CSS</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Backend</span>
                      <span className="text-slate-700 dark:text-slate-200 font-medium">Node.js, Express</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Author</span>
                      <span className="text-slate-700 dark:text-slate-200 font-medium">Habit Tracker Team</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ToggleSetting({ icon, label, description, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-700">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-300 shadow-sm">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{label}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-14 h-8 rounded-full transition-colors ${
          enabled ? 'accent-bg-500' : 'bg-slate-300 dark:bg-slate-600'
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
        />
      </button>
    </div>
  );
}
