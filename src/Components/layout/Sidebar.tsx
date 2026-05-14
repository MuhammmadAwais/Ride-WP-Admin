/**
 * @fileoverview Application sidebar navigation.
 * Responsive: collapsible on desktop, slide-over on mobile.
 * Uses Lucide icons mapped from NAV_ITEMS constants.
 */
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShieldCheck, CreditCard,
  ClipboardList, BarChart3, Headphones, Bell,
  FileText, ScrollText, Info, ChevronLeft,
  ChevronRight, LogOut,
} from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/features/auth/slices/authSlice';
import { cn } from '@/lib/utils';
import { APP_NAME, ROUTES } from '@/Constants';

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ReactElement> = {
  LayoutDashboard: <LayoutDashboard size={18} />,
  Users:           <Users size={18} />,
  ShieldCheck:     <ShieldCheck size={18} />,
  CreditCard:      <CreditCard size={18} />,
  ClipboardList:   <ClipboardList size={18} />,
  BarChart3:       <BarChart3 size={18} />,
  Headphones:      <Headphones size={18} />,
  Bell:            <Bell size={18} />,
  FileText:        <FileText size={18} />,
  ScrollText:      <ScrollText size={18} />,
  Info:            <Info size={18} />,
};

/** Navigation item shape */
interface NavItem {
  label: string;
  route: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',         route: ROUTES.DASHBOARD,         icon: 'LayoutDashboard' },
  { label: 'Users',             route: ROUTES.USERS,             icon: 'Users' },
  { label: 'Clubs',             route: ROUTES.CLUBS,             icon: 'ShieldCheck' },
  { label: 'Payments',          route: ROUTES.PAYMENTS,          icon: 'CreditCard' },
  { label: 'Requests',          route: ROUTES.REQUESTS,          icon: 'ClipboardList' },
  { label: 'Analytics',         route: ROUTES.ANALYTICS,         icon: 'BarChart3' },
  { label: 'App Support',       route: ROUTES.APP_SUPPORT,       icon: 'Headphones' },
  { label: 'Push Notifications',route: ROUTES.PUSH_NOTIFICATIONS,icon: 'Bell' },
  { label: 'Privacy Policy',    route: ROUTES.PRIVACY_POLICY,    icon: 'FileText' },
  { label: 'Terms & Conditions',route: ROUTES.TERMS,             icon: 'ScrollText' },
  { label: 'About',             route: ROUTES.ABOUT,             icon: 'Info' },
];

/** Groups separator for visual hierarchy */
const PRIMARY_NAV = NAV_ITEMS.slice(0, 6);
const SECONDARY_NAV = NAV_ITEMS.slice(6);

interface SidebarProps {
  /** Whether the sidebar is visible (mobile slide-over). */
  isOpen: boolean;
  /** Callback to close the sidebar (mobile). */
  onClose: () => void;
}

/**
 * Responsive application sidebar.
 * Collapses to icon-only mode on desktop; slides over on mobile.
 *
 * @param props.isOpen  - Mobile open state.
 * @param props.onClose - Mobile close handler.
 */
const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  /**
   * Logs the user out and redirects to the login page.
   */
  const handleLogout = (): void => {
    dispatch(logout());
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const sidebarWidth = collapsed ? 'w-[70px]' : 'w-64';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full flex flex-col',
          'transition-all duration-300 ease-smooth',
          'lg:relative lg:translate-x-0 lg:z-auto lg:h-screen',
          sidebarWidth,
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{ backgroundColor: 'var(--container)', borderRight: '1px solid var(--border)' }}
        aria-label="Main navigation"
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-4 py-5 shrink-0"
             style={{ borderBottom: '1px solid var(--border)' }}>
          {!collapsed && (
            <img
              src="/logos/full-logo.png"
              alt={APP_NAME}
              className="h-8 object-contain"
              draggable={false}
            />
          )}
          {collapsed && (
            <img
              src="/logos/short-logo.png"
              alt={APP_NAME}
              className="h-8 w-8 object-contain mx-auto"
              draggable={false}
            />
          )}
          {/* Collapse toggle — desktop only */}
          <button
            id="sidebar-collapse-btn"
            onClick={() => setCollapsed((p) => !p)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-soft transition-colors hover:bg-accent-muted ml-auto"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{ color: 'var(--text-secondary)' }}
          >
            {collapsed
              ? <ChevronRight size={14} aria-hidden="true" />
              : <ChevronLeft  size={14} aria-hidden="true" />
            }
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5" aria-label="Sidebar navigation">

          {/* Primary group */}
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] uppercase tracking-widest font-semibold font-roboto"
               style={{ color: 'var(--text-secondary)' }}>
              Main
            </p>
          )}
          {PRIMARY_NAV.map((item) => (
            <SidebarNavLink key={item.route} item={item} collapsed={collapsed} onClick={onClose} />
          ))}

          {/* Secondary group */}
          <div className="pt-4">
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] uppercase tracking-widest font-semibold font-roboto"
                 style={{ color: 'var(--text-secondary)' }}>
                Settings
              </p>
            )}
            {SECONDARY_NAV.map((item) => (
              <SidebarNavLink key={item.route} item={item} collapsed={collapsed} onClick={onClose} />
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="px-2 py-4 shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-soft',
              'text-sm font-roboto font-medium text-error',
              'transition-colors duration-150 hover:bg-error/10',
              collapsed && 'justify-center'
            )}
          >
            <LogOut size={18} aria-hidden="true" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

// ─── NavLink sub-component ────────────────────────────────────────────────────

interface SidebarNavLinkProps {
  item: NavItem;
  collapsed: boolean;
  onClick: () => void;
}

/**
 * Individual sidebar navigation link with active state styling.
 */
const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({ item, collapsed, onClick }) => (
  <NavLink
    to={item.route}
    end={item.route === ROUTES.DASHBOARD}
    onClick={onClick}
    title={collapsed ? item.label : undefined}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-soft text-sm font-roboto font-medium',
        'transition-all duration-150',
        collapsed && 'justify-center',
        isActive
          ? 'bg-accent text-white shadow-accent/30 shadow-sm'
          : 'hover:bg-accent-muted'
      )
    }
    style={({ isActive }) => ({
      color: isActive ? '#FFFFFF' : 'var(--text-primary)',
    })}
  >
    <span aria-hidden="true">{ICON_MAP[item.icon]}</span>
    {!collapsed && <span>{item.label}</span>}
  </NavLink>
);

export default Sidebar;
