/**
 * @fileoverview Core app shell — Sidebar + Navbar + content area.
 * Applies GSAP page-entry animation on route change (y: 20, opacity: 0 → 0, 1).
 */
import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation }  from 'react-router-dom';
import { Helmet }               from 'react-helmet-async';
import gsap                     from 'gsap';
import Sidebar                  from './Sidebar';
import Navbar                   from './Navbar';
import { APP_NAME }             from '@/Constants';

/** Derives a human-readable page title from the current pathname. */
function deriveTitle(pathname: string): string {
  const segment = pathname.split('/').filter(Boolean).at(-1) ?? 'dashboard';
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
}

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location   = useLocation();
  const contentRef = useRef<HTMLElement>(null);

  const pageTitle = deriveTitle(location.pathname);

  // GSAP page-entry animation on route change
  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'expo.out', clearProps: 'all' }
    );
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>{pageTitle} — {APP_NAME} Admin</title>
      </Helmet>

      <div
        className="flex h-svh overflow-hidden"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main column */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Navbar */}
          <Navbar
            onMenuClick={() => setSidebarOpen(true)}
            pageTitle={pageTitle}
          />

          {/* Page content */}
          <main
            ref={contentRef}
            id="main-content"
            className="flex-1 overflow-y-auto"
            style={{
              padding:         '1.5rem',
              backgroundColor: 'var(--bg)',
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default AppLayout;
