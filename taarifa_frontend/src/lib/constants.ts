
// src/lib/constants.ts

export const APP_CONFIG = {
  name: 'Taarifa Salary Guide',
  version: '1.0.0',
  description: 'Tanzania Salary Guide & Affordability Calculator',
  api: {
    graphql: import.meta.env.VITE_GRAPHQL_URL || 'http://127.0.0.1:8000/graphql/',
    rest: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/',
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
  dateFormat: 'DD/MM/YYYY',
  currency: {
    code: 'TZS',
    locale: 'en-TZ',
  },
};

export const ROUTES = {
  HOME: '/',
  SALARY: '/salary',
  AFFORDABILITY: '/affordability',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  NOT_FOUND: '*',
} as const;

export const EDUCATION_LEVELS = [
  'Certificate',
  'Diploma', 
  'Bachelor',
  'Master',
  'PhD',
] as const;

export const EXPERIENCE_LEVELS = [
  'Entry Level',
  'Mid Level',
  'Senior Level',
] as const;