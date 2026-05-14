/**
 * @fileoverview Top navigation bar.
 * Contains: mobile menu toggle, page title, theme toggle, notifications, profile.
 */
import React from 'react';
import { Menu, Bell, Sun, Moon, User, ChevronDown } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface NavbarProps {
  /** Callback to open the mobile sidebar. */
  onMenuClick: () => void;
  /** Title of the current page — displayed in the center/left. */
  pageTitle?: string;
}

/**
 * Top application navbar.
 * Adapts between mobile (hamburger menu) and desktop (full controls) layouts.
 *
 * @param props.onMenuClick - Opens the mobile sidebar drawer.
 * @param props.pageTitle   - Optional page title displayed next to the menu icon.
 */
const Navbar: React.FC<NavbarProps> = ({ onMenuClick, pageTitle = 'Dashboard' }) => {
  const { isDark, toggleTheme } = useTheme();
  const user = useAppSelector((s) => s.auth.user);

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 shrink-0"
      style={{
        backgroundColor: 'var(--container)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Left — mobile menu + page title */}
      <div className="flex items-center gap-3">
        <button
          id="navbar-menu-btn"
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-soft transition-colors hover:bg-accent-muted"
          aria-label="Open navigation menu"
          style={{ color: 'var(--text-primary)' }}
        >
          <Menu size={20} aria-hidden="true" />
        </button>
        <h2
          className="font-poppins font-semibold text-lg hidden sm:block"
          style={{ color: 'var(--text-primary)' }}
        >
          {pageTitle}
        </h2>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2">

        {/* Theme toggle */}
        <button
          id="navbar-theme-toggle"
          onClick={toggleTheme}
          className={cn(
            'flex items-center justify-center w-9 h-9 rounded-soft',
            'transition-all duration-200 hover:bg-accent-muted',
          )}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{ color: 'var(--text-secondary)' }}
        >
          {isDark
            ? <Sun  size={18} aria-hidden="true" />
            : <Moon size={18} aria-hidden="true" />
          }
        </button>

        {/* Notifications */}
        <button
          id="navbar-notifications-btn"
          className="relative flex items-center justify-center w-9 h-9 rounded-soft transition-colors hover:bg-accent-muted"
          aria-label="Notifications"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Bell size={18} aria-hidden="true" />
          {/* Unread dot */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent animate-pulse-ring"
            aria-label="Unread notifications"
          />
        </button>

        {/* Profile */}
        <button
          id="navbar-profile-btn"
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-soft transition-colors hover:bg-accent-muted ml-1"
          aria-label="User profile menu"
          style={{ color: 'var(--text-primary)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #EB712B, #D4601E)' }}
          >
            <User size={15} className="text-white" aria-hidden="true" />
          </div>
          <span className="hidden sm:block text-sm font-roboto font-medium max-w-[120px] truncate">
            {user?.name ?? 'Admin'}
          </span>
          <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
