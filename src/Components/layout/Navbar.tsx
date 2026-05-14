/**
 * @fileoverview Premium sticky top Navbar.
 *
 * Features:
 *  - Glassmorphic backdrop-blur-md sticky header.
 *  - Theme toggle (Sun / Moon) with smooth spin animation.
 *  - Notification bell with animated pulse badge.
 *  - Profile dropdown with hover-scale avatar and name display.
 *  - Profile dropdown panel with GSAP-driven open/close.
 *  - 100% TypeScript interfaces for all props.
 */
import React, { useRef, useState, useCallback, useEffect, memo } from 'react';
import {
  Menu, Bell, Sun, Moon, ChevronDown,
  User, Settings, LogOut, HelpCircle,
} from 'lucide-react';
import gsap                  from 'gsap';
import { useNavigate }       from 'react-router-dom';
import { useAppSelector }    from '@/hooks/useAppSelector';
import { useAppDispatch }    from '@/hooks/useAppDispatch';
import { useTheme }          from '@/hooks/useTheme';
import { logout }            from '@/features/auth/slices/authSlice';
import { cn }                from '@/lib/utils';
import { ROUTES }            from '@/Constants';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavbarProps {
  /** Callback to open the mobile sidebar. */
  onMenuClick: () => void;
  /** Title of the currently active page. */
  pageTitle?:  string;
}

interface DropdownItemProps {
  icon:     React.ReactElement;
  label:    string;
  onClick:  () => void;
  danger?:  boolean;
}

// ─── Dropdown Item ────────────────────────────────────────────────────────────

const DropdownItem: React.FC<DropdownItemProps> = memo(({ icon, label, onClick, danger }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-roboto font-medium',
      'transition-colors duration-150 rounded-xl text-left',
      danger
        ? 'hover:bg-red-50 text-red-500'
        : 'hover:bg-black/05 dark:hover:bg-white/06'
    )}
    style={danger ? { color: '#EF4444' } : { color: 'var(--text-primary)' }}
  >
    <span className="shrink-0 opacity-70" aria-hidden="true">{icon}</span>
    {label}
  </button>
));
DropdownItem.displayName = 'DropdownItem';

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, pageTitle = 'Dashboard' }) => {
  const { isDark, toggleTheme } = useTheme();
  const user                    = useAppSelector((s) => s.auth.user);
  const dispatch                = useAppDispatch();
  const navigate                = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifBounce, setNotifBounce]   = useState(false);

  const dropdownRef   = useRef<HTMLDivElement>(null);
  const dropdownPanel = useRef<HTMLDivElement>(null);

  // ── Close dropdown on outside click ───────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    if (dropdownOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  // ── GSAP: Dropdown open / close ───────────────────────────────────────────
  const openDropdown = useCallback(() => {
    setDropdownOpen(true);
    requestAnimationFrame(() => {
      if (!dropdownPanel.current) return;
      gsap.fromTo(
        dropdownPanel.current,
        { opacity: 0, y: -8, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: 'expo.out' }
      );
    });
  }, []);

  const closeDropdown = useCallback(() => {
    if (!dropdownPanel.current) { setDropdownOpen(false); return; }
    gsap.to(dropdownPanel.current, {
      opacity: 0, y: -8, scale: 0.96, duration: 0.16, ease: 'power2.in',
      onComplete: () => setDropdownOpen(false),
    });
  }, []);

  const toggleDropdown = useCallback(() => {
    dropdownOpen ? closeDropdown() : openDropdown();
  }, [dropdownOpen, openDropdown, closeDropdown]);

  // ── Notification bell bounce ───────────────────────────────────────────────
  const handleBellClick = useCallback(() => {
    setNotifBounce(true);
    setTimeout(() => setNotifBounce(false), 600);
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = useCallback(() => {
    closeDropdown();
    dispatch(logout());
    navigate(ROUTES.LOGIN, { replace: true });
  }, [dispatch, navigate, closeDropdown]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 shrink-0 glass-nav"
    >
      {/* ── Left: menu + page title ── */}
      <div className="flex items-center gap-3">
        <button
          id="navbar-menu-btn"
          onClick={onMenuClick}
          className={cn(
            'lg:hidden flex items-center justify-center w-9 h-9 rounded-xl',
            'transition-colors hover:bg-black/06',
          )}
          aria-label="Open navigation menu"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        <div>
          <h2
            className="font-poppins font-semibold text-base leading-none"
            style={{ color: 'var(--text-primary)' }}
          >
            {pageTitle}
          </h2>
          <p
            className="font-roboto text-xs mt-0.5 hidden sm:block"
            style={{ color: 'var(--text-secondary)' }}
          >
            Ride with Pals — Admin
          </p>
        </div>
      </div>

      {/* ── Right: actions ── */}
      <div className="flex items-center gap-1.5">

        {/* Theme toggle */}
        <button
          id="navbar-theme-btn"
          onClick={toggleTheme}
          className={cn(
            'flex items-center justify-center w-9 h-9 rounded-xl',
            'transition-all duration-200 hover:bg-black/06',
          )}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{ color: 'var(--text-secondary)' }}
        >
          {isDark
            ? <Sun  size={18} className="animate-spin-slow" aria-hidden="true" style={{ animationDuration: '8s' }} />
            : <Moon size={18} aria-hidden="true" />
          }
        </button>

        {/* Notification bell */}
        <button
          id="navbar-notif-btn"
          onClick={handleBellClick}
          className={cn(
            'relative flex items-center justify-center w-9 h-9 rounded-xl',
            'transition-colors hover:bg-black/06',
          )}
          aria-label="Notifications"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Bell
            size={18}
            className={notifBounce ? 'animate-notif-bounce' : ''}
            aria-hidden="true"
          />
          {/* Unread pulse dot */}
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse-ring"
            style={{ backgroundColor: '#EB712B' }}
            aria-label="Unread notifications"
          />
        </button>

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--border)' }} aria-hidden="true" />

        {/* Profile dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            id="navbar-profile-btn"
            onClick={toggleDropdown}
            className={cn(
              'flex items-center gap-2 pl-1 pr-2.5 py-1.5 rounded-xl',
              'transition-all duration-200 hover:bg-black/06',
              'group',
            )}
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
            aria-label="User profile menu"
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #EB712B 0%, #C85E22 100%)' }}
            >
              <User size={15} className="text-white" aria-hidden="true" />
            </div>

            {/* Name */}
            <div className="hidden sm:block text-left">
              <p
                className="text-sm font-roboto font-semibold leading-none max-w-[110px] truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {user?.name ?? 'Admin'}
              </p>
              <p
                className="text-xs font-roboto mt-0.5 leading-none capitalize"
                style={{ color: 'var(--text-secondary)' }}
              >
                {user?.role ?? 'administrator'}
              </p>
            </div>

            <ChevronDown
              size={13}
              className={cn(
                'transition-transform duration-200 shrink-0 hidden sm:block',
                dropdownOpen && 'rotate-180'
              )}
              style={{ color: 'var(--text-secondary)' }}
              aria-hidden="true"
            />
          </button>

          {/* Dropdown panel */}
          {dropdownOpen && (
            <div
              ref={dropdownPanel}
              role="menu"
              aria-label="Profile menu"
              className="absolute right-0 top-full mt-2 w-52 p-1.5"
              style={{
                backgroundColor: 'var(--surface)',
                border:          '1px solid var(--border)',
                borderRadius:    16,
                boxShadow:       '0 16px 48px rgba(0,0,0,0.14), 0 4px 14px rgba(0,0,0,0.08)',
                zIndex:          100,
              }}
            >
              {/* User info header */}
              <div
                className="px-3.5 py-2.5 mb-1"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <p className="text-sm font-roboto font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  {user?.name ?? 'Admin'}
                </p>
                <p className="text-xs font-roboto mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
                  {user?.email ?? 'admin@admin.com'}
                </p>
              </div>

              <DropdownItem
                icon={<User size={16} />}
                label="My Profile"
                onClick={() => { closeDropdown(); }}
              />
              <DropdownItem
                icon={<Settings size={16} />}
                label="Settings"
                onClick={() => { closeDropdown(); }}
              />
              <DropdownItem
                icon={<HelpCircle size={16} />}
                label="Help Center"
                onClick={() => { closeDropdown(); }}
              />

              <div className="my-1" style={{ height: 1, backgroundColor: 'var(--border)' }} aria-hidden="true" />

              <DropdownItem
                icon={<LogOut size={16} />}
                label="Sign Out"
                onClick={handleLogout}
                danger
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
