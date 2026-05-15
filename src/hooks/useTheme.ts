/**
 * @fileoverview Elite Theme Hook — Zero-Flicker, localStorage persisted.
 * - Applies `.dark` class to `document.documentElement` (Tailwind v4 compatible)
 * - Reads OS preference as fallback on first visit
 * - Exposes `toggleTheme` for GSAP-driven Navbar icon flip
 */
import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '@/Constants';

type Theme = 'light' | 'dark';

export interface UseThemeReturn {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

/**
 * Reads the persisted theme synchronously from localStorage.
 * Falls back to OS color-scheme preference.
 */
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';

  const stored = localStorage.getItem(STORAGE_KEYS.THEME) as Theme | null;
  if (stored === 'dark' || stored === 'light') return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * Immediately applies the `.dark` class to `<html>` and persists the choice.
 * Must be called synchronously before paint to prevent FOUC.
 */
function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

/**
 * Elite theme management hook.
 * Handles persistence, DOM class toggling, and OS preference detection.
 *
 * @example
 * const { isDark, toggleTheme } = useTheme();
 */
export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Apply class immediately on mount and on every theme change.
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
