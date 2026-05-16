/**
 * @fileoverview Elite AppLayout — Z-Index Hierarchy Root
 *
 * Z-Index Contract:
 *   z-0  → BackgroundBubbles (global fixed layer, glassmorphism substrate)
 *   z-10 → Main layout (sidebar + content column)
 *   z-30 → Navbar (within content column, above scrollable content)
 *   z-50 → Sidebar (on mobile, drawer mode)
 *   z-[200] → Portal Modals (into #modal-root, highest)
 *
 * Key Architectural Decisions:
 * - BackgroundBubbles is rendered at root level so backdrop-blur has blobs to blur.
 * - Sidebar is sticky (desktop) / drawer (mobile).
 * - Navbar is positioned at top of content column, content scrolls under it.
 * - Content entry animation via GSAP on every route change (useGSAP).
 */
import React, { useState, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import BackgroundBubbles from '@/Components/ui/BackgroundBubbles';
import { APP_NAME } from '@/Constants';

/** Derive a human-readable page title from the current pathname. */
function deriveTitle(pathname: string): string {
  const segment = pathname.split('/').filter(Boolean).at(-1) ?? 'dashboard';
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
}

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const contentRef = useRef<HTMLElement>(null);
  const pageTitle = deriveTitle(location.pathname);

  // ── Page Content Entry Animation ─────────────────────────────────────────
  useGSAP(
    () => {
      if (!contentRef.current) return;
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'all' },
      );
    },
    { dependencies: [location.pathname], scope: contentRef },
  );

  return (
    <>
      <Helmet>
        <title>{pageTitle} — {APP_NAME} Admin</title>
      </Helmet>

      {/* ── Base: Full-screen container with dark bg ── */}
      <div className="relative min-h-svh w-full bg-main-bg">

        {/* ── Layer 0: Zero-G Background (fixed, z-0) ── */}
        <BackgroundBubbles />

        {/* ── Layer 1: App Shell (z-10) ── */}
        <div className="relative z-10 flex w-full">

          {/* Sidebar — sticky on desktop, drawer on mobile */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* ── Main Column ── */}
          <div className="flex flex-col flex-1 min-w-0 relative">

            {/* Sticky Navbar (z-30) */}
            <div className="sticky top-0 left-0 right-0 z-30">
              <Navbar
                onMenuClick={() => setSidebarOpen(true)}
                pageTitle={pageTitle}
              />
            </div>

            {/* Scrollable Page Content */}
            <main
              ref={contentRef}
              id="main-content"
              className="flex-1"
            >
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppLayout;
