/**
 * @fileoverview Core application layout.
 * Composes Sidebar + Navbar + main content area (<Outlet>).
 * Applied to all protected routes.
 */
import React, { useState } from 'react';
import { Outlet, useMatches } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Sidebar from './Sidebar';
import Navbar  from './Navbar';
import { APP_NAME } from '@/Constants';

/**
 * The authenticated app shell.
 * Renders the sidebar (collapsible desktop / slide-over mobile) and the
 * top navbar, then projects the active child route into `<Outlet>`.
 */
const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const matches = useMatches();

  /** Derive page title from the deepest matched route's handle, falling back to app name. */
  const pageTitle = (() => {
    const last = [...matches].reverse().find((m) => {
      const handle = m.handle as Record<string, unknown> | undefined;
      return typeof handle?.title === 'string';
    });
    const handle = last?.handle as Record<string, unknown> | undefined;
    return typeof handle?.title === 'string' ? handle.title : 'Dashboard';
  })();

  return (
    <>
      <Helmet>
        <title>{pageTitle} — {APP_NAME} Admin</title>
      </Helmet>

      <div className="flex h-svh overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main column */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Navbar */}
          <Navbar
            onMenuClick={() => setSidebarOpen(true)}
            pageTitle={pageTitle}
          />

          {/* Page content */}
          <main
            id="main-content"
            className="flex-1 overflow-y-auto p-4 sm:p-6"
            style={{ backgroundColor: 'var(--bg)' }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default AppLayout;
