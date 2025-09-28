import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeService, THEMES, LIGHT_COLORS, DARK_COLORS } from '../utils/themeService';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(THEMES.DARK);
  const [colors, setColors] = useState(DARK_COLORS);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme on app start
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const currentTheme = await ThemeService.getCurrentTheme();
      const themeColors = ThemeService.getThemeColors(currentTheme);
      setTheme(currentTheme);
      setColors(themeColors);
    } catch (error) {
      console.error('Error loading theme:', error);
      // Fallback to dark theme
      setTheme(THEMES.DARK);
      setColors(DARK_COLORS);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = await ThemeService.toggleTheme();
      const newColors = ThemeService.getThemeColors(newTheme);
      setTheme(newTheme);
      setColors(newColors);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  const setThemeMode = async (newTheme) => {
    try {
      await ThemeService.setTheme(newTheme);
      const themeColors = ThemeService.getThemeColors(newTheme);
      setTheme(newTheme);
      setColors(themeColors);
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  };

  const value = {
    theme,
    colors,
    isDark: theme === THEMES.DARK,
    isLoading,
    toggleTheme,
    setTheme: setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
