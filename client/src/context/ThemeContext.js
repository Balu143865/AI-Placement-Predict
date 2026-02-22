import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Theme Context
 * Manages theme state (light, dark, system) with localStorage persistence
 */

const ThemeContext = createContext();

// Theme constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Get system preference
const getSystemTheme = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT;
  }
  return THEMES.DARK; // Default to dark if can't detect
};

// Get stored theme or default
const getStoredTheme = () => {
  try {
    const stored = localStorage.getItem('theme');
    if (stored && Object.values(THEMES).includes(stored)) {
      return stored;
    }
  } catch (e) {
    console.error('Error reading theme from localStorage:', e);
  }
  return THEMES.DARK; // Default to dark
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getStoredTheme);
  const [resolvedTheme, setResolvedTheme] = useState(
    theme === THEMES.SYSTEM ? getSystemTheme() : theme
  );

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Determine the actual theme to apply
    const effectiveTheme = theme === THEMES.SYSTEM ? getSystemTheme() : theme;
    setResolvedTheme(effectiveTheme);
    
    // Apply theme class to root element
    if (effectiveTheme === THEMES.DARK) {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
      root.setAttribute('data-theme', 'light');
    }
    
    // Store preference
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.error('Error saving theme to localStorage:', e);
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== THEMES.SYSTEM) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setResolvedTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
      document.documentElement.classList.toggle('dark-theme', e.matches);
      document.documentElement.classList.toggle('light-theme', !e.matches);
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Cycle through themes: dark -> light -> system -> dark
  const cycleTheme = () => {
    const themeOrder = [THEMES.DARK, THEMES.LIGHT, THEMES.SYSTEM];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  // Set specific theme
  const setSpecificTheme = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  const value = {
    theme,
    resolvedTheme,
    cycleTheme,
    setTheme: setSpecificTheme,
    isDark: resolvedTheme === THEMES.DARK,
    isLight: resolvedTheme === THEMES.LIGHT,
    isSystem: theme === THEMES.SYSTEM
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
