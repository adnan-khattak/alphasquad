import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@reading_tracker_theme';

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
};

// Light theme colors
export const LIGHT_COLORS = {
  // Modern minimalist color palette
  primary: '#ffffff',
  secondary: '#f8fafc',
  accent: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray: '#6b7280',
  lightGray: '#e5e7eb',
  darkGray: '#374151',
  
  // Background colors
  background: '#ffffff',
  surface: '#f8fafc',
  card: '#ffffff',
  
  // Text colors
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  
  // Gradient colors
  gradientStart: '#ffffff',
  gradientEnd: '#f8fafc',
};

// Dark theme colors
export const DARK_COLORS = {
  // Modern dark color palette
  primary: '#000000',
  secondary: '#0f172a',
  accent: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray: '#64748b',
  lightGray: '#334155',
  darkGray: '#0f172a',
  
  // Background colors
  background: '#0f172a',
  surface: '#1e293b',
  card: '#334155',
  
  // Text colors
  textPrimary: '#f8fafc',
  textSecondary: '#cbd5e1',
  textMuted: '#64748b',
  
  // Gradient colors
  gradientStart: '#0f172a',
  gradientEnd: '#1e293b',
};

export const ThemeService = {
  // Get current theme
  async getCurrentTheme() {
    try {
      const theme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      return theme || THEMES.DARK; // Default to dark theme
    } catch (error) {
      console.error('Error getting current theme:', error);
      return THEMES.DARK;
    }
  },

  // Set theme
  async setTheme(theme) {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      return true;
    } catch (error) {
      console.error('Error setting theme:', error);
      return false;
    }
  },

  // Get colors for current theme
  async getColors() {
    const currentTheme = await this.getCurrentTheme();
    return currentTheme === THEMES.LIGHT ? LIGHT_COLORS : DARK_COLORS;
  },

  // Toggle theme
  async toggleTheme() {
    const currentTheme = await this.getCurrentTheme();
    const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    await this.setTheme(newTheme);
    return newTheme;
  },

  // Get theme-specific colors
  getThemeColors(theme) {
    return theme === THEMES.LIGHT ? LIGHT_COLORS : DARK_COLORS;
  }
};
