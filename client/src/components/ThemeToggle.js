import React from 'react';
import { useTheme, THEMES } from '../context/ThemeContext';

/**
 * ThemeToggle Component
 * Cycles through: dark -> light -> system -> dark
 * Icons: Moon (dark) -> Sun (light) -> Monitor (system)
 */
const ThemeToggle = () => {
  const { theme, cycleTheme, resolvedTheme } = useTheme();

  // Get aria-label based on current theme
  const getAriaLabel = () => {
    switch (theme) {
      case THEMES.DARK:
        return 'Dark mode active. Click to switch to light mode';
      case THEMES.LIGHT:
        return 'Light mode active. Click to switch to system preference';
      case THEMES.SYSTEM:
        return `System preference active (${resolvedTheme} mode). Click to switch to dark mode`;
      default:
        return 'Toggle theme';
    }
  };

  // Get title for hover tooltip
  const getTitle = () => {
    switch (theme) {
      case THEMES.DARK:
        return 'Dark Mode';
      case THEMES.LIGHT:
        return 'Light Mode';
      case THEMES.SYSTEM:
        return 'System Default';
      default:
        return 'Theme';
    }
  };

  return (
    <button
      className="theme-toggle"
      onClick={cycleTheme}
      aria-label={getAriaLabel()}
      title={getTitle()}
      type="button"
      role="switch"
      aria-checked={theme === THEMES.DARK}
    >
      <div className="theme-toggle-inner">
        {/* Sun Icon - Light Mode */}
        <div 
          className={`theme-icon sun-icon ${theme === THEMES.LIGHT ? 'active' : ''}`}
          aria-hidden="true"
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </div>

        {/* Moon Icon - Dark Mode */}
        <div 
          className={`theme-icon moon-icon ${theme === THEMES.DARK ? 'active' : ''}`}
          aria-hidden="true"
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </div>

        {/* Monitor Icon - System Default */}
        <div 
          className={`theme-icon system-icon ${theme === THEMES.SYSTEM ? 'active' : ''}`}
          aria-hidden="true"
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
      </div>

      {/* Theme indicator dots */}
      <div className="theme-indicators" aria-hidden="true">
        <span className={`indicator ${theme === THEMES.DARK ? 'active' : ''}`} />
        <span className={`indicator ${theme === THEMES.LIGHT ? 'active' : ''}`} />
        <span className={`indicator ${theme === THEMES.SYSTEM ? 'active' : ''}`} />
      </div>
    </button>
  );
};

export default ThemeToggle;
