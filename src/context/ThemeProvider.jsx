import React, { useContext, useEffect, useState } from 'react';

const ThemeContext = React.createContext();

// Theme presets with extended color palettes
const THEME_CONFIG = {
  light: {
    name: 'light',
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F59E0B',
      danger: '#EF4444',
      bg: 'rgba(255, 255, 255, 0.95)',
      cardBg: 'rgba(240, 244, 255, 0.9)',
      textPrimary: '#1F2937',
      textSecondary: '#6B7280',
      border: 'rgba(200, 200, 255, 0.2)',
      gradient: 'linear-gradient(135deg, #3B82F6, #1E40AF)',
    }
  },
  dark: {
    name: 'dark',
    colors: {
      primary: '#7C3AED',
      secondary: '#10B981',
      accent: '#F59E0B',
      danger: '#EF4444',
      bg: 'rgba(15, 23, 42, 0.95)',
      cardBg: 'rgba(30, 41, 59, 0.8)',
      textPrimary: '#F1F5F9',
      textSecondary: '#CBD5E1',
      border: 'rgba(100, 116, 139, 0.2)',
      gradient: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
    }
  },
  custom: {
    name: 'custom',
    colors: {
      primary: '#06B6D4',
      secondary: '#EC4899',
      accent: '#84CC16',
      danger: '#F17316',
      bg: 'rgba(20, 35, 50, 0.95)',
      cardBg: 'rgba(40, 60, 80, 0.8)',
      textPrimary: '#F0F9FF',
      textSecondary: '#BAE6FD',
      border: 'rgba(100, 150, 200, 0.2)',
      gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)',
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('sports-theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('sports-theme', currentTheme);
    applyTheme(currentTheme);
  }, [currentTheme]);

  const applyTheme = (themeName) => {
    const config = THEME_CONFIG[themeName];
    const root = document.documentElement;
    
    Object.entries(config.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    root.setAttribute('data-theme', themeName);
  };

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const switchTheme = (themeName) => {
    if (THEME_CONFIG[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const value = {
    currentTheme,
    toggleTheme,
    switchTheme,
    themes: Object.keys(THEME_CONFIG),
    colors: THEME_CONFIG[currentTheme].colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
