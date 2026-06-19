import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCircle,
  Flame,
  Calendar,
  Award,
  BarChart3,
  X,
  Check,
  Inbox,
  Clock,
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

const iconMap = {
  CheckCircle,
  Flame,
  Calendar,
  Award,
  BarChart3,
};

const typeStyles = {
  success: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  streak: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  reminder: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  achievement: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  analytics: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
};

function formatTimeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1 border-2 border-white dark:border-slate-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-3 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-slate-500 dark:text-slate-400" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 transition"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                    <Inbox size={28} className="text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    No notifications
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = iconMap[notification.icon] || Bell;
                  return (
                    <button
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`w-full flex items-start gap-3 px-5 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                        notification.read
                          ? 'opacity-60'
                          : 'bg-slate-50/50 dark:bg-slate-700/20'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl flex-shrink-0 ${
                          typeStyles[notification.type] || typeStyles.reminder
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                          <Clock size={10} />
                          {formatTimeAgo(notification.timestamp)}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
