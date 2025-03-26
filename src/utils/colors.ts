// Base colors
export const palette = {
  red: '#FF3B30',
  green: '#34C759',
  blue: '#007AFF',
  orange: '#FF9500',
  yellow: '#FFCC00',
  purple: '#AF52DE',
  gray: {
    100: '#F2F2F7',
    200: '#E5E5EA',
    300: '#D1D1D6',
    400: '#C7C7CC',
    500: '#AEAEB2',
    600: '#8E8E93',
    700: '#636366',
    800: '#48484A',
    900: '#3A3A3C',
  },
  black: '#000000',
  white: '#FFFFFF',
} as const;

// Semantic colors
export const colors = {
  primary: palette.blue,
  secondary: palette.purple,
  success: palette.green,
  warning: palette.orange,
  error: palette.red,
  highlight: palette.yellow,

  // Text colors
  text: {
    primary: palette.black,
    secondary: palette.gray[600],
    disabled: palette.gray[400],
    inverse: palette.white,
  },

  // Background colors
  background: {
    primary: palette.white,
    secondary: palette.gray[100],
    tertiary: palette.gray[200],
  },

  // Border colors
  border: {
    light: palette.gray[200],
    medium: palette.gray[300],
    dark: palette.gray[400],
  },

  // Button colors
  button: {
    primary: {
      background: palette.blue,
      text: palette.white,
    },
    secondary: {
      background: palette.purple,
      text: palette.white,
    },
    outline: {
      background: 'transparent',
      text: palette.blue,
      border: palette.blue,
    },
    disabled: {
      background: palette.gray[300],
      text: palette.gray[600],
    },
  },

  // Input colors
  input: {
    background: palette.white,
    border: palette.gray[300],
    placeholder: palette.gray[500],
    error: palette.red,
  },
} as const; 