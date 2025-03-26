export const APP_NAME = 'UFC 15 Min Challenge';

export const WEIGHT_CLASSES = [
  'Flyweight',
  'Bantamweight',
  'Featherweight',
  'Lightweight',
  'Welterweight',
  'Middleweight',
  'Light Heavyweight',
  'Heavyweight',
  "Women's Strawweight",
  "Women's Flyweight",
  "Women's Bantamweight",
  "Women's Featherweight",
] as const;

export const PREDICTION_METHODS = {
  KO_TKO: 'KO/TKO',
  SUBMISSION: 'Submission',
  DECISION: 'Decision',
  DQ: 'DQ',
} as const;

export const CACHE_KEYS = {
  UPCOMING_EVENTS: 'upcoming_events',
  LEADERBOARD: 'leaderboard',
  USER_STATS: 'user_stats',
  FIGHT_DETAILS: 'fight_details',
} as const;

export const CACHE_DURATION = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
} as const;

export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PASSWORD: 'Password must be at least 6 characters',
  INVALID_USERNAME: 'Username must be between 3 and 20 characters',
  REQUIRED_FIELD: 'This field is required',
  AUTH_FAILED: 'Invalid email or password',
  USER_NOT_FOUND: 'No account found with this email',
  EMAIL_IN_USE: 'Email is already registered',
  NETWORK_ERROR: 'Network error. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const;

export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  LIVE: 'live',
  COMPLETED: 'completed',
} as const;

export const POINTS = {
  CORRECT_PREDICTION: 10,
  BONUS_UNDERDOG: 5,
  BONUS_PERFECT_METHOD: 3,
  BONUS_PERFECT_ROUND: 2,
} as const;

export const CACHE_EXPIRY = {
  UPCOMING_EVENTS: 60 * 60, // 1 hour
  FIGHT_ODDS: 60 * 5, // 5 minutes
  FIGHTER_STATS: 60 * 60 * 24, // 24 hours
  USER_PREDICTIONS: 60 * 5, // 5 minutes
  LEADERBOARD: 60 * 5, // 5 minutes
} as const;

export const API_ENDPOINTS = {
  UPCOMING_EVENTS: '/api/events/upcoming',
  FIGHT_ODDS: '/api/fights/odds',
  FIGHTER_STATS: '/api/fighters/stats',
  USER_PREDICTIONS: '/api/users/predictions',
  LEADERBOARD: '/api/leaderboard',
} as const; 