import { Activity, LayoutDashboard, BarChart3, User, ChevronLeft, ChevronRight, Search, Bell, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileModal from '../components/ProfileModal';
import SettingsModal from '../components/SettingsModal';
import NotificationDropdown from '../components/NotificationDropdown';
import { useTheme } from '../contexts/ThemeContext';

export default function Layout({ children }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/habits', label: 'My Habits', icon: Activity },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const activeLabel = navItems.find(n => n.path === location.pathname)?.label || 'Dashboard';

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-screen bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-white/50 dark:border-slate-700/50 z-50 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.04)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]"
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl accent-gradient-br flex items-center justify-center flex-shrink-0 shadow-lg accent-shadow">
              <Activity size={20} className="text-white" />
            </div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl font-bold accent-text-gradient whitespace-nowrap"
              >
                Habit Tracker
              </motion.span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            {collapsed ? <ChevronRight size={18} className="text-slate-600 dark:text-slate-300" /> : <ChevronLeft size={18} className="text-slate-600 dark:text-slate-300" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                  isActive
                    ? 'accent-bg-50 dark:accent-bg-900/30 accent-text-700 dark:accent-text-300 font-medium shadow-sm accent-shadow'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon size={20} />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                {collapsed && isActive && (
                  <div className="absolute left-0 w-1 h-8 accent-gradient-r rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={() => setShowProfile(true)}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition text-left"
          >
            <div className="w-10 h-10 rounded-full accent-gradient-br flex items-center justify-center flex-shrink-0 shadow-md accent-shadow">
              <User size={18} className="text-white" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">User</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">Pro Plan</p>
              </div>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{ marginLeft: collapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 min-h-screen"
      >
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/60 dark:border-slate-700/60 px-8 py-4 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{activeLabel}</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search habits..."
                  className="pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border-none text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none accent-ring w-64 transition"
                />
              </div>
              <NotificationDropdown />
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition hover:scale-105 active:scale-95"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button
                onClick={() => setShowProfile(true)}
                className="w-10 h-10 rounded-full accent-gradient-br flex items-center justify-center shadow-md accent-shadow hover:shadow-lg transition"
              >
                <User size={18} className="text-white" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </motion.main>

      {/* Modals */}
      <AnimatePresence>
        {showProfile && (
          <ProfileModal
            onClose={() => setShowProfile(false)}
            onOpenSettings={() => setShowSettings(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
