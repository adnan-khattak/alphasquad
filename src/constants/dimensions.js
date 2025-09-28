import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const FONT_SIZES = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 19,
  xxl: 22,
  xxxl: 28,
  xxxxl: 34,
};

export const BORDER_RADIUS = {
  xs: 2,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 24,
  xxxl: 32,
  round: 50,
};

