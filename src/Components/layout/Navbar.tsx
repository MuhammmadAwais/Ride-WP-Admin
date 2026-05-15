/**
 * @fileoverview Elite Navbar Component
 *
 * Specs:
 * - Height: Fixed 80px (h-20)
 * - Surface: pure backdrop-blur-xl, no solid background
 * - px-8 horizontal padding
 * - Theme toggle: GSAP flip animation on icon swap
 * - Notification bell: pinging orange dot
 * - useGSAP for animation lifecycle management
 */
import React, { useRef } from 'react';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export interface NavbarProps {
  onMenuClick: () => void;
  pageTitle?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, pageTitle = 'Dashboard' }) => {
  const { isDark, toggleTheme } = useTheme();

  const sunRef = useRef<SVGSVGElement>(null);
  const moonRef = useRef<SVGSVGElement>(null);

  // ── GSAP entrance flip when the icon swaps after toggle ─────────────────
  // Runs after React commits the new icon to the DOM.
  useGSAP(
    () => {
      const iconEl = isDark ? sunRef.current : moonRef.current;
      if (!iconEl) return;

      gsap.fromTo(
        iconEl,
        { scale: 0.3, rotate: isDark ? -120 : 120, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' },
      );
    },
    { dependencies: [isDark] },
  );

  return (
    <header
      id="navbar"
    >
      {/* ── Left: Mobile Menu + Page Title ── */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className={cn(
            'lg:hidden flex items-center justify-center w-11 h-11 rounded-xl',
            'transition-all duration-300 hover:opacity-80',
          )}
          style={{ color: 'var(--color-secondary-text)' }}
        >
          <Menu size={24} aria-hidden="true" />
        </button>

        <h1 className="font-poppins font-bold text-[22px] tracking-tight leading-tight" style={{ color: 'var(--color-main-text)' }}>
          {pageTitle}
        </h1>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle — toggleTheme called directly so no GSAP race condition */}
        <button
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="relative flex items-center justify-center w-11 h-11 rounded-2xl transition-colors duration-300 hover:opacity-80"
          style={{ color: 'var(--color-secondary-text)' }}
        >
          {isDark ? (
            <Sun
              ref={sunRef}
              size={22}
              aria-hidden="true"
              className="text-amber-300"
            />
          ) : (
            <Moon
              ref={moonRef}
              size={22}
              aria-hidden="true"
              className="text-indigo-300"
            />
          )}
        </button>

        {/* Notification Bell */}
        <button
          aria-label="View notifications"
          className="relative flex items-center justify-center w-11 h-11 rounded-2xl transition-colors duration-300 group hover:opacity-80"
          style={{ color: 'var(--color-secondary-text)' }}
        >
          <Bell size={22} className="group-hover:animate-notif-bounce" aria-hidden="true" />

          {/* Pinging dot */}
          <span className="absolute top-2.5 right-2.5 w-2 h-2" aria-label="New notifications">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
