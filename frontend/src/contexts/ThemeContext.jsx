import { createContext, useContext, useEffect, useState } from 'react';

const ACCENT_COLORS = {
  indigo: {
    50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
    400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
    800: '#3730a3', 900: '#312e81', 950: '#1e1b4b',
  },
  blue: {
    50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
    400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
    800: '#1e40af', 900: '#1e3a8a', 950: '#172554',
  },
  purple: {
    50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe',
    400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce',
    800: '#6b21a8', 900: '#581c87', 950: '#3b0764',
  },
  emerald: {
    50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
    400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
    800: '#065f46', 900: '#064e3b', 950: '#022c22',
  },
  orange: {
    50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74',
    400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c',
    800: '#9a3412', 900: '#7c2d12', 950: '#431407',
  },
  rose: {
    50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af',
    400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c',
    800: '#9f1239', 900: '#881337', 950: '#4c0519',
  },
};

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  accentColor: 'indigo',
  setAccentColor: () => {},
});

function applyAccentColor(colorKey) {
  const colors = ACCENT_COLORS[colorKey];
  if (!colors) return;
  const root = document.documentElement;
  for (let i = 50; i <= 950; i += i < 100 ? 50 : 100) {
    root.style.setProperty(`--accent-${i}`, colors[i]);
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('habitflow-theme');
      if (stored === 'dark' || stored === 'light') return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [accentColor, setAccentColor] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('habitflow-accent');
      if (stored && ACCENT_COLORS[stored]) return stored;
    }
    return 'indigo';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('habitflow-theme', theme);
  }, [theme]);

  useEffect(() => {
    applyAccentColor(accentColor);
    localStorage.setItem('habitflow-accent', accentColor);
  }, [accentColor]);

  // Apply on mount
  useEffect(() => {
    applyAccentColor(accentColor);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
