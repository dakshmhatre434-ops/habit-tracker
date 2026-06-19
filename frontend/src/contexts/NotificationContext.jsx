import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  addNotification: () => {},
});

const SAMPLE_NOTIFICATIONS = [
  {
    id: '1',
    type: 'success',
    title: 'Habit completed!',
    message: 'You completed "Morning Exercise" today. Keep it up!',
    icon: 'CheckCircle',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
  },
  {
    id: '2',
    type: 'streak',
    title: 'New streak achieved!',
    message: 'You reached a 7-day streak on "Read 30 Minutes"!',
    icon: 'Flame',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Daily reminder',
    message: 'You haven\'t completed "Drink 8 Glasses of Water" yet today.',
    icon: 'Calendar',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: '4',
    type: 'achievement',
    title: 'Achievement unlocked!',
    message: 'Early Bird: Complete a habit before 8 AM for 5 days.',
    icon: 'Award',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: '5',
    type: 'analytics',
    title: 'Weekly analytics available',
    message: 'Your weekly habit report is ready. View your progress!',
    icon: 'BarChart3',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('habitflow-notifications');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return SAMPLE_NOTIFICATIONS;
        }
      }
    }
    return SAMPLE_NOTIFICATIONS;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    localStorage.setItem('habitflow-notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (notification) => {
    setNotifications((prev) => [
      {
        id: Date.now().toString(),
        read: false,
        timestamp: new Date().toISOString(),
        ...notification,
      },
      ...prev,
    ]);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}
