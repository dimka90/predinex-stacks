'use client';

import { useState, useCallback } from 'react';

/**
 * useLocalStorage - Persists state to localStorage with SSR-safe handling.
 * Supports callback updater pattern like useState.
 * @param key The localStorage key
 * @param initial The initial value if no stored value exists
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch {
      return initial;
    }
  });

  const set = useCallback((v: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const nextValue = v instanceof Function ? v(prev) : v;
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, JSON.stringify(nextValue));
        }
      } catch { /* Storage full or unavailable */ }
      return nextValue;
    });
  }, [key]);

  const remove = useCallback(() => {
    setValue(initial);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch { /* Ignore */ }
  }, [key, initial]);

  return [value, set, remove] as const;
}
