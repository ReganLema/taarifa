import { useState, useCallback, useEffect } from 'react';

/**
 * Hook for managing state in localStorage
 * @param key - The localStorage key
 * @param initialValue - Default value if nothing in localStorage
 * @returns [storedValue, setValue, removeValue]
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] => {
  // Get initial value from localStorage or use default
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Set value (supports functional updates)
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value;
      return newValue;
    });
  }, []);

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

/**
 * Hook for managing JSON objects in localStorage with validation
 */
export const useLocalStorageWithValidation = <T>(
  key: string,
  initialValue: T,
  validate: (value: unknown) => value is T
): [T, (value: T) => void, () => void, string | null] => {
  const [error, setError] = useState<string | null>(null);

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        if (validate(parsed)) {
          setError(null);
          return parsed;
        } else {
          setError(`Invalid data format for "${key}"`);
          return initialValue;
        }
      }
      return initialValue;
    } catch (err) {
      setError(`Failed to parse data for "${key}"`);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
      setError(null);
    } catch (err) {
      setError(`Failed to save data for "${key}"`);
    }
  }, [key, storedValue]);

  const setValue = useCallback((value: T) => {
    setStoredValue(value);
  }, []);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      setError(null);
    } catch (err) {
      setError(`Failed to remove data for "${key}"`);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue, error];
};

// Usage examples:
/*
// Basic usage
const [name, setName, removeName] = useLocalStorage<string>('user_name', '');
const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
const [settings, setSettings] = useLocalStorage('app_settings', {
  notifications: true,
  language: 'en',
});

// With validation
interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: number;
}

const isValidPreferences = (value: unknown): value is UserPreferences => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'theme' in value &&
    'fontSize' in value
  );
};

const [prefs, setPrefs, removePrefs, error] = useLocalStorageWithValidation<UserPreferences>(
  'user_prefs',
  { theme: 'light', fontSize: 16 },
  isValidPreferences
);
*/