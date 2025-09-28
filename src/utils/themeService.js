import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@reading_tracker_theme';

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
};

// Light theme colors
export const LIGHT_COLORS = {
  // Minimalist color palette
  primary: '#ffffff',
  secondary: '#f5f5f5',
  accent: '#000000',
  success: '#00aa6c',
  warning: '#ff8800',
  error: '#ff4444',
  
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray: '#666666',
  lightGray: '#e5e5e5',
  darkGray: '#333333',
  
  // Background colors
  background: '#ffffff',
  surface: '#f5f5f5',
  card: '#ffffff',
  
  // Text colors
  textPrimary: '#000000',
  textSecondary: '#666666',
  textMuted: '#999999',
};

// Dark theme colors (existing)
export const DARK_COLORS = {
  // Minimalist color palette
  primary: '#000000',
  secondary: '#1a1a1a',
  accent: '#ffffff',
  success: '#00ff88',
  warning: '#ffaa00',
  error: '#ff3366',
  
  // Neutral colors - Clean grays
  white: '#ffffff',
  black: '#000000',
  gray: '#8e8e93',
  lightGray: '#f2f2f7',
  darkGray: '#1c1c1e',
  
  // Background colors - Minimal
  background: '#000000',
  surface: '#1c1c1e',
  card: '#2c2c2e',
  
  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#8e8e93',
  textMuted: '#636366',
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
