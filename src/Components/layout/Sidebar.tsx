/**
 * @fileoverview Premium application sidebar — 260px width.
 *
 * Design:
 *  - Dark mode: solid charcoal (#242424) surface, no blur.
 *  - Light mode: white surface with subtle shadow.
 *  - Active nav item: accent left-border + gradient tint + text glow.
 *  - Collapsible on desktop (icon-only at 72px).
 *  - Slide-over on mobile with backdrop overlay.
 *
 * Performance: memo on sub-components to prevent re-render on parent state.
 */
import React, { useState, memo } from 'react';
import { NavLink, useNavigate }  from 'react-router-dom';
import {
  LayoutDashboard, Users, ShieldCheck, CreditCard,
  ClipboardList, BarChart3, Headphones, Bell,
  FileText, ScrollText, Info, ChevronLeft, ChevronRight,
  LogOut, X,
} from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout }         from '@/features/auth/slices/authSlice';
import { cn }             from '@/lib/utils';
import { APP_NAME, ROUTES } from '@/Constants';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  route: string;
  icon:  React.ReactElement;
  end?:  boolean;
}

export interface SidebarProps {
  /** Whether the sidebar is open (mobile slide-over). */
  isOpen:  boolean;
  /** Callback to close the sidebar (mobile only). */
  onClose: () => void;
}

interface SidebarNavLinkProps {
  item:      NavItem;
  collapsed: boolean;
  onClick:   () => void;
}

// ─── Navigation definition ────────────────────────────────────────────────────

const ICON_SIZE = 18;

const PRIMARY_NAV: NavItem[] = [
  { label: 'Dashboard',   route: ROUTES.DASHBOARD,  icon: <LayoutDashboard size={ICON_SIZE} />, end: true },
  { label: 'Users',       route: ROUTES.USERS,       icon: <Users           size={ICON_SIZE} /> },
  { label: 'Clubs',       route: ROUTES.CLUBS,       icon: <ShieldCheck     size={ICON_SIZE} /> },
  { label: 'Payments',    route: ROUTES.PAYMENTS,    icon: <CreditCard      size={ICON_SIZE} /> },
  { label: 'Requests',    route: ROUTES.REQUESTS,    icon: <ClipboardList   size={ICON_SIZE} /> },
  { label: 'Analytics',   route: ROUTES.ANALYTICS,   icon: <BarChart3       size={ICON_SIZE} /> },
];

const SECONDARY_NAV: NavItem[] = [
  { label: 'App Support',        route: ROUTES.APP_SUPPORT,        icon: <Headphones size={ICON_SIZE} /> },
  { label: 'Notifications',      route: ROUTES.PUSH_NOTIFICATIONS, icon: <Bell       size={ICON_SIZE} /> },
  { label: 'Privacy Policy',     route: ROUTES.PRIVACY_POLICY,     icon: <FileText   size={ICON_SIZE} /> },
  { label: 'Terms & Conditions', route: ROUTES.TERMS,              icon: <ScrollText size={ICON_SIZE} /> },
  { label: 'About',              route: ROUTES.ABOUT,              icon: <Info       size={ICON_SIZE} /> },
];

// ─── Sub-component: NavLink ───────────────────────────────────────────────────

const SidebarNavLink: React.FC<SidebarNavLinkProps> = memo(({ item, collapsed, onClick }) => (
  <NavLink
    to={item.route}
    end={item.end}
    onClick={onClick}
    title={collapsed ? item.label : undefined}
    className={({ isActive }) => cn(
      'nav-item',
      collapsed && 'justify-center px-0',
      isActive && 'active'
    )}
  >
    <span className="shrink-0" aria-hidden="true">{item.icon}</span>
    {!collapsed && <span className="truncate">{item.label}</span>}
  </NavLink>
));
SidebarNavLink.displayName = 'SidebarNavLink';

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = (): void => {
    dispatch(logout());
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const EXPANDED_W  = '260px';
  const COLLAPSED_W = '72px';

  return (
    <>
      {/* ── Mobile backdrop overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{
          width:           collapsed ? COLLAPSED_W : EXPANDED_W,
          minWidth:        collapsed ? COLLAPSED_W : EXPANDED_W,
          backgroundColor: 'var(--sidebar-bg)',
          borderRight:     '1px solid var(--sidebar-border)',
          boxShadow:       '4px 0 24px rgba(0,0,0,0.06)',
          transition:      'width 0.28s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className={cn(
          'fixed top-0 left-0 z-50 h-full flex flex-col overflow-hidden',
          'lg:relative lg:translate-x-0 lg:z-auto lg:h-screen',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        aria-label="Main navigation"
      >
        {/* ── Logo / Header ── */}
        <div
          className="flex items-center h-16 px-4 shrink-0"
          style={{ borderBottom: '1px solid var(--sidebar-border)' }}
        >
          {collapsed ? (
            <img
              src="/logos/short-logo.png"
              alt={APP_NAME}
              className="w-8 h-8 object-contain mx-auto"
              draggable={false}
            />
          ) : (
            <img
              src="/logos/full-logo.png"
              alt={APP_NAME}
              className="h-7 object-contain flex-1"
              draggable={false}
            />
          )}

          {/* Mobile close button */}
          <button
            id="sidebar-close-btn"
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-black/05 ml-auto"
            onClick={onClose}
            aria-label="Close sidebar"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X size={18} aria-hidden="true" />
          </button>

          {/* Desktop collapse toggle */}
          <button
            id="sidebar-collapse-btn"
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg transition-colors hover:bg-accent-muted ml-2 shrink-0"
            onClick={() => setCollapsed((p) => !p)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{ color: 'var(--text-secondary)' }}
          >
            {collapsed
              ? <ChevronRight size={14} aria-hidden="true" />
              : <ChevronLeft  size={14} aria-hidden="true" />
            }
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav
          className="flex-1 overflow-y-auto py-3"
          style={{ padding: collapsed ? '12px 8px' : '12px 10px' }}
          aria-label="Sidebar navigation"
        >
          {/* Primary group */}
          {!collapsed && (
            <p
              className="px-3 mb-1.5 text-[10px] uppercase tracking-widest font-semibold font-roboto"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Main
            </p>
          )}
          <div className="space-y-0.5">
            {PRIMARY_NAV.map((item) => (
              <SidebarNavLink
                key={item.route}
                item={item}
                collapsed={collapsed}
                onClick={onClose}
              />
            ))}
          </div>

          {/* Secondary group */}
          <div className="mt-5">
            {!collapsed && (
              <p
                className="px-3 mb-1.5 text-[10px] uppercase tracking-widest font-semibold font-roboto"
                style={{ color: 'var(--text-tertiary)' }}
              >
                System
              </p>
            )}
            <div className="space-y-0.5">
              {SECONDARY_NAV.map((item) => (
                <SidebarNavLink
                  key={item.route}
                  item={item}
                  collapsed={collapsed}
                  onClick={onClose}
                />
              ))}
            </div>
          </div>
        </nav>

        {/* ── Logout ── */}
        <div
          className="shrink-0 p-2"
          style={{ borderTop: '1px solid var(--sidebar-border)' }}
        >
          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 font-roboto text-sm font-medium',
              'transition-all duration-150 rounded-xl',
              'hover:bg-red-50',
              collapsed && 'justify-center'
            )}
            style={{ color: '#EF4444' }}
          >
            <LogOut size={18} aria-hidden="true" className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
