// Base spacing unit (4px)
const BASE = 4;

// Spacing scale
export const spacing = {
  none: 0,
  xxs: BASE, // 4px
  xs: BASE * 2, // 8px
  sm: BASE * 3, // 12px
  md: BASE * 4, // 16px
  lg: BASE * 6, // 24px
  xl: BASE * 8, // 32px
  xxl: BASE * 12, // 48px
} as const;

// Layout constants
export const layout = {
  screenPadding: spacing.md,
  contentSpacing: spacing.lg,
  sectionSpacing: spacing.xl,
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
} as const;

// Common style shortcuts
export const insets = {
  screenPadding: {
    paddingHorizontal: layout.screenPadding,
  },
  contentSpacing: {
    marginBottom: layout.contentSpacing,
  },
  sectionSpacing: {
    marginBottom: layout.sectionSpacing,
  },
} as const; 