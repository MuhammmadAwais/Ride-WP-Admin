/**
 * @fileoverview Security hook that hardens the browser environment.
 *
 * Protections applied ONLY in production (`import.meta.env.PROD`):
 * - Disables right-click context menu.
 * - Intercepts common DevTools keyboard shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U).
 *
 * All listeners are cleaned up on unmount.
 */
import { useEffect } from 'react';

/**
 * Attaches browser-hardening event listeners.
 * Safe to call on every page — guards are gated behind the production flag
 * so development workflow is unaffected.
 *
 * @example
 * // In a layout component or App root:
 * useSecureSession();
 */
export function useSecureSession(): void {
  useEffect(() => {
    // Only activate in production builds
    if (!import.meta.env.PROD) return;

    /** Prevent right-click context menu */
    const handleContextMenu = (e: MouseEvent): void => {
      e.preventDefault();
    };

    /** Block common DevTools keyboard shortcuts */
    const handleKeyDown = (e: KeyboardEvent): void => {
      const isF12 = e.key === 'F12';
      const isCtrlShiftI = e.ctrlKey && e.shiftKey && e.key === 'I';
      const isCtrlShiftJ = e.ctrlKey && e.shiftKey && e.key === 'J';
      const isCtrlShiftC = e.ctrlKey && e.shiftKey && e.key === 'C';
      const isCtrlU     = e.ctrlKey && e.key === 'u';

      if (isF12 || isCtrlShiftI || isCtrlShiftJ || isCtrlShiftC || isCtrlU) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
