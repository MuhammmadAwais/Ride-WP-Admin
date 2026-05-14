/**
 * @fileoverview Theme management hook.
 * Persists the active theme ('light' | 'dark') to localStorage and
 * syncs it with the `dark` class on the `<html>` element so Tailwind
 * dark: utilities work correctly.
 */
import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '@/Constants';

type Theme = 'light' | 'dark';

/** Shape returned by `useTheme`. */
interface UseThemeReturn {
  /** The currently active theme. */
  theme: Theme;
  /** Whether dark mode is active. */
  isDark: boolean;
  /** Toggles between light and dark, persists the choice. */
  toggleTheme: () => void;
  /** Explicitly set the theme. */
  setTheme: (theme: Theme) => void;
}

/**
 * Reads the persisted theme from localStorage.
 * Falls back to the OS preference when no persisted value exists.
 *
 * @returns 'dark' or 'light'
 */
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  const stored = localStorage.getItem(STORAGE_KEYS.THEME) as Theme | null;
  if (stored === 'dark' || stored === 'light') return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Applies the `dark` class to `<html>` and persists the theme choice.
 *
 * @param theme - The theme to apply.
 */
function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

/**
 * Hook for managing light/dark theme.
 *
 * @returns `{ theme, isDark, toggleTheme, setTheme }`
 *
 * @example
 * const { isDark, toggleTheme } = useTheme();
 */
export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Apply on mount and on every change
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, isDark: theme === 'dark', toggleTheme, setTheme };
}
