import { useTheme } from '../contexts/ThemeContext';

export function useChartTheme() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return {
    gridStroke: isDark ? '#334155' : '#f1f5f9',
    axisStroke: isDark ? '#64748b' : '#94a3b8',
    tooltipBg: isDark ? '#1e293b' : '#ffffff',
    tooltipBorder: isDark ? '#334155' : '#e2e8f0',
    tooltipText: isDark ? '#f8fafc' : '#1e293b',
    cursorFill: isDark ? '#1e293b' : '#f8fafc',
    cursorStroke: isDark ? '#475569' : '#e2e8f0',
  };
}
