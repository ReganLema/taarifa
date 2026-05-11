// App constants
export const APP_NAME = 'Taarifa Salary Guide';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Tanzania Salary Guide & Affordability Calculator';

// API
export const API_TIMEOUT = 30000;
export const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://127.0.0.1:8000/graphql/';

// Salary
export const DEFAULT_CURRENCY = 'TZS';
export const DEFAULT_LOCALE = 'en-TZ';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFS: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_SEARCHES: 'recent_searches',
  FAVORITE_SALARIES: 'favorite_salaries',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  SALARY: '/salary',
  AFFORDABILITY: '/affordability',
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
} as const;

// Breakpoints (in pixels)
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Education levels
export const EDUCATION_LEVELS = [
  'Certificate',
  'Diploma',
  'Bachelor',
  'Master',
  'PhD',
] as const;

// Experience levels
export const EXPERIENCE_LEVELS = [
  'Entry Level',
  'Mid Level',
  'Senior Level',
] as const;

// Themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Toast durations
export const TOAST_DURATION = 4000;

// Date formats
export const DATE_FORMATS = {
  SHORT: 'DD/MM/YY',
  MEDIUM: 'MMM DD, YYYY',
  LONG: 'MMMM DD, YYYY',
  FULL: 'dddd, MMMM DD, YYYY',
} as const;