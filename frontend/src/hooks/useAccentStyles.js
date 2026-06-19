import { useTheme } from '../contexts/ThemeContext';

export function useAccentStyles() {
  const { accentColor } = useTheme();

  const getGradient = (direction = 'to right') => ({
    backgroundImage: `linear-gradient(${direction}, var(--accent-600), var(--accent-700))`,
  });

  const getGradientBr = () => ({
    backgroundImage: `linear-gradient(to bottom right, var(--accent-500), var(--accent-700))`,
  });

  const getTextGradient = () => ({
    backgroundImage: `linear-gradient(to right, var(--accent-600), var(--accent-700))`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  });

  const getSolid = (shade = 600) => ({
    backgroundColor: `var(--accent-${shade})`,
  });

  const getTextColor = (shade = 600) => ({
    color: `var(--accent-${shade})`,
  });

  const getBorderColor = (shade = 500) => ({
    borderColor: `var(--accent-${shade})`,
  });

  const getShadow = () => ({
    boxShadow: `0 10px 15px -3px var(--accent-500)33, 0 4px 6px -4px var(--accent-500)33`,
  });

  const getRing = () => ({
    '--tw-ring-color': 'var(--accent-500)',
  });

  return {
    accentColor,
    getGradient,
    getGradientBr,
    getTextGradient,
    getSolid,
    getTextColor,
    getBorderColor,
    getShadow,
    getRing,
  };
}
