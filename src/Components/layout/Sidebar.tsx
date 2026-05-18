/**
 * @fileoverview Elite Sidebar — "Floating Pill" Architecture
 *
 * All layout spacing (padding, gap, margin) is driven by explicit CSS classes
 * defined in index.css to guarantee correct rendering in Tailwind v4.
 */
import React, { useState, useRef, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShieldCheck, CreditCard,
   BarChart3, Headphones, Bell,
  FileText, ScrollText, Info, LogOut, X, User, Settings,
  ChevronUp,
} from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { createPortal } from 'react-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { logout } from '@/features/auth/slices/authSlice';
import { cn } from '@/lib/utils';
import { APP_NAME, ROUTES } from '@/Constants';
import ProfileSettingsModal from '@/features/profile/components/ProfileSettingsModal';
import { useTheme } from '@/hooks/useTheme';

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  route: string;
  icon: React.ReactElement;
}

interface NavDivider {
  type: 'divider';
}

type NavEntry = NavItem | NavDivider;

// ── Nav Config ────────────────────────────────────────────────────────────────

const ICON_SIZE = 20;

const NAV_ITEMS: NavEntry[] = [
  { label: 'Dashboard',          route: ROUTES.DASHBOARD,          icon: <LayoutDashboard size={ICON_SIZE} /> },
  { label: 'Users',              route: ROUTES.USERS,              icon: <Users size={ICON_SIZE} /> },
  { label: 'Clubs',              route: ROUTES.CLUBS,              icon: <ShieldCheck size={ICON_SIZE} /> },
  { label: 'Payments',           route: ROUTES.PAYMENTS,           icon: <CreditCard size={ICON_SIZE} /> },
  { label: 'Analytics',          route: ROUTES.ANALYTICS,          icon: <BarChart3 size={ICON_SIZE} /> },
  { type: 'divider' },
  { label: 'App Support',        route: ROUTES.APP_SUPPORT,        icon: <Headphones size={ICON_SIZE} /> },
  { label: 'Push Notifications', route: ROUTES.PUSH_NOTIFICATIONS, icon: <Bell size={ICON_SIZE} /> },
  { label: 'Privacy Policy',     route: ROUTES.PRIVACY_POLICY,     icon: <FileText size={ICON_SIZE} /> },
  { label: 'Terms & Conditions', route: ROUTES.TERMS,              icon: <ScrollText size={ICON_SIZE} /> },
  { label: 'About',              route: ROUTES.ABOUT,              icon: <Info size={ICON_SIZE} /> },
];

// ── Props ─────────────────────────────────────────────────────────────────────

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Logout Confirmation Modal ─────────────────────────────────────────────────

interface LogoutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ onConfirm, onCancel }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
    gsap.fromTo(cardRef.current,
      { scale: 0.88, opacity: 0, y: 24 },
      { scale: 1,    opacity: 1, y: 0,  duration: 0.45, ease: 'back.out(1.7)' },
    );
  });

  const handleCancel = useCallback(() => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
    gsap.to(cardRef.current, { scale: 0.92, opacity: 0, y: 12, duration: 0.2, onComplete: onCancel });
  }, [onCancel]);

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div className="fixed inset-0 z-200 flex items-center justify-center" style={{ padding: '16px' }}>
      <div ref={overlayRef} className="absolute inset-0 bg-black/60 backdrop-blur-2xl" onClick={handleCancel} />
      <div
        ref={cardRef}
        className="relative z-10 w-full text-center"
        style={{
          maxWidth: '400px',
          borderRadius: '24px',
          background: 'var(--color-secondary-bg)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
          padding: '36px 32px',
        }}
      >
        <div style={{
          margin: '0 auto 20px',
          width: '64px', height: '64px',
          borderRadius: '16px',
          background: 'rgba(239,68,68,0.10)',
          border: '1px solid rgba(239,68,68,0.20)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <LogOut size={28} color="#f87171" />
        </div>
        <h3 style={{ fontFamily: 'var(--font-poppins)', fontWeight: 700, fontSize: '20px', color: 'var(--color-main-text)', marginBottom: '8px' }}>
          Sign Out?
        </h3>
        <p style={{ fontFamily: 'var(--font-roboto)', fontSize: '14px', color: 'var(--color-secondary-text)', lineHeight: 1.6, marginBottom: '28px' }}>
          You'll be returned to the login screen. Unsaved changes will be lost.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleCancel}
            style={{
              flex: 1, padding: '12px', borderRadius: '14px',
              fontFamily: 'var(--font-poppins)', fontWeight: 600, fontSize: '14px',
              color: 'var(--color-main-text)',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              cursor: 'pointer', transition: 'background 0.2s',
            }}
          >Cancel</button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '12px', borderRadius: '14px',
              fontFamily: 'var(--font-poppins)', fontWeight: 700, fontSize: '14px',
              color: '#fff',
              background: '#ef4444',
              cursor: 'pointer', transition: 'background 0.2s',
              border: 'none',
            }}
          >Sign Out</button>
        </div>
      </div>
    </div>,
    modalRoot,
  );
};

// ── Main Sidebar ──────────────────────────────────────────────────────────────

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user      = useAppSelector((s) => s.auth.user);
  const { isDark } = useTheme();

  const [profileMenuOpen,  setProfileMenuOpen]  = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [logoutModalOpen,  setLogoutModalOpen]  = useState(false);

  const navContainerRef = useRef<HTMLElement>(null);
  const pillRef         = useRef<HTMLDivElement>(null);

  // ── GSAP Floating Pill ──────────────────────────────────────────────────────
  useGSAP(
    () => {
      if (!navContainerRef.current || !pillRef.current) return;

      const allLinks = navContainerRef.current.querySelectorAll<HTMLAnchorElement>('[data-nav-link]');
      const activeLink = Array.from(allLinks).find(
        (el) => el.getAttribute('href') === location.pathname,
      );

      if (activeLink) {
        const cRect = navContainerRef.current.getBoundingClientRect();
        const lRect = activeLink.getBoundingClientRect();
        const top   = lRect.top - cRect.top + navContainerRef.current.scrollTop;

        gsap.to(pillRef.current, {
          y: top, height: lRect.height,
          opacity: 1, duration: 0.55, ease: 'expo.out',
        });
      } else {
        gsap.to(pillRef.current, { opacity: 0, duration: 0.2 });
      }
    },
    { dependencies: [location.pathname], scope: navContainerRef },
  );

  const handleLogoutConfirm = useCallback(() => {
    dispatch(logout());
    navigate(ROUTES.LOGIN, { replace: true });
  }, [dispatch, navigate]);

  const handleOpenSettings = useCallback(() => {
    setProfileMenuOpen(false);
    setSettingsModalOpen(true);
  }, []);

  const handleOpenLogout = useCallback(() => {
    setProfileMenuOpen(false);
    setLogoutModalOpen(true);
  }, []);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden"
          onClick={onClose}
          aria-hidden="true"
          style={{ animation: 'fade-in 0.2s ease-out' }}
        />
      )}

      {/* ── Sidebar Panel ── */}
      <aside
        id="sidebar"
        style={{
          width: '288px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderRight: '1px solid var(--color-border)',
          background: 'var(--color-glass-bg)',
          transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
          // Mobile drawer
          ...(typeof window !== 'undefined' && window.innerWidth < 1024
            ? { position: 'fixed', top: 0, left: 0, zIndex: 50,
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }
            : {}),
        }}
        className={cn(
          'fixed top-0 left-0 z-50 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo Header */}
        <div className="sidebar-logo-header">
          <img
            src={isDark ? "/logos/dark-theme-logo.png" : "/logos/light-theme-logo.png"}
            alt={APP_NAME}
            style={{ height: '36px', objectFit: 'contain', cursor: 'pointer' }}
            draggable={false}
            onClick={() => navigate('/')}
          />
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="flex lg:hidden items-center justify-center"
            style={{
              width: '36px', height: '36px',
              borderRadius: '10px',
              color: 'var(--color-secondary-text)',
              background: 'transparent',
              border: 'none', cursor: 'pointer',
              transition: 'color 0.2s',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          ref={navContainerRef}
          className="custom-scrollbar"
          style={{ position: 'relative', flex: 1, overflowY: 'auto', padding: '20px 16px' }}
        >
          {/* Floating Pill */}
          <div
            ref={pillRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '16px',
              right: '16px',
              top: 0,
              borderRadius: '16px',
              background: '#EB712B',
              pointerEvents: 'none',
              opacity: 0,
              willChange: 'transform, height, opacity',
            }}
          />

          {NAV_ITEMS.map((entry, idx) => {
            if ('type' in entry && entry.type === 'divider') {
              return <div key={`div-${idx}`} className="nav-divider" />;
            }

            const item     = entry as NavItem;
            const isActive = location.pathname === item.route;

            return (
              <NavLink
                key={item.route}
                to={item.route}
                data-nav-link
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  color: isActive ? '#ffffff' : 'var(--color-secondary-text)',
                  textDecoration: 'none',
                  background: 'transparent',
                }}
                className={cn(!isActive && 'hover:text-(--color-main-text)!')}
              >
                <span
                  style={{
                    flexShrink: 0,
                    transition: 'transform 0.3s',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    display: 'flex',
                  }}
                >
                  {item.icon}
                </span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Profile Footer */}
        <div className="profile-footer">
          {/* Profile Quick Menu */}
          {profileMenuOpen && (
            <div className="profile-menu">
              <button onClick={handleOpenSettings} style={{ color: 'rgba(255,255,255,0.8)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <Settings size={18} style={{ color: 'rgba(235,113,43,0.8)', flexShrink: 0 }} />
                <span>Profile Settings</span>
              </button>
              <div className="profile-menu-divider" />
              <button onClick={handleOpenLogout} style={{ color: '#f87171', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <LogOut size={18} style={{ color: '#f87171', flexShrink: 0 }} />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* Profile Tile */}
          <button
            onClick={() => setProfileMenuOpen((p) => !p)}
            aria-expanded={profileMenuOpen}
            aria-label="Open profile menu"
            className="profile-tile"
            style={{ border: '1px solid var(--color-border)', cursor: 'pointer', textAlign: 'left' }}
          >
            {/* Avatar */}
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              background: '#EB712B',
            }}>
              <User size={20} color="#fff" />
            </div>

            {/* Name + Role */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{
                fontFamily: 'var(--font-poppins)', fontWeight: 700, fontSize: '14px',
                color: 'var(--color-main-text)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                lineHeight: 1.3, marginBottom: '2px',
              }}>
                {user?.name ?? 'Administrator'}
              </p>
              <p style={{
                fontFamily: 'var(--font-poppins)', fontSize: '12px',
                color: 'var(--color-secondary-text)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                textTransform: 'capitalize', letterSpacing: '0.02em',
              }}>
                {user?.role ?? 'Admin'}
              </p>
            </div>

            {/* Chevron */}
            <ChevronUp
              size={16}
              style={{
                color: 'var(--color-secondary-text)',
                flexShrink: 0,
                transition: 'transform 0.3s',
                transform: profileMenuOpen ? 'rotate(0deg)' : 'rotate(180deg)',
              }}
            />
          </button>
        </div>
      </aside>

      {/* Modals */}
      <ProfileSettingsModal isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
      {logoutModalOpen && (
        <LogoutModal onConfirm={handleLogoutConfirm} onCancel={() => setLogoutModalOpen(false)} />
      )}
    </>
  );
};

export default Sidebar;
