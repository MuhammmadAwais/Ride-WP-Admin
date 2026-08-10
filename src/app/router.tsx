/**
 * @fileoverview Application router using React Router v7 `createBrowserRouter`.
 *
 * Route structure:
 *  /             → redirects to /dashboard (or /login if unauthenticated)
 *  /login        → LoginPage (public)
 *  /dashboard/*  → protected routes wrapped in AppLayout
 */
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage   from '@/features/auth/components/LoginPage';
import AppLayout   from '@/Components/layout/AppLayout';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import ProtectedRoute from '@/Components/layout/ProtectedRoute';
import UsersPage from '@/features/users/pages/UsersPage';
import UserDetailPage from '@/features/users/pages/UserDetailPage';

import ClubsPage from '@/features/clubs/pages/ClubsPage';
import ClubDetailsPage from '../features/clubs/pages/ClubDetailsPage';

import PaymentsPage from '@/features/payments/pages/PaymentsPage';
import SupportPage from '@/features/support/pages/SupportPage';
import AnalyticsPage from '@/features/analytics/pages/AnalyticsPage';
import NotificationPage from '@/features/notifications/pages/NotificationPage';
import PrivacyPolicyPage from '@/features/cms/pages/PrivacyPolicyPage';
import TermsConditionsPage from '@/features/cms/pages/TermsConditionsPage';
import AboutPage from '@/features/cms/pages/AboutPage';

import RouteErrorBoundary from '@/Components/common/RouteErrorBoundary';

/**
 * Application router instance.
 * Add new protected routes under the `/dashboard` children array.
 */
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'users/:id', element: <UserDetailPage /> },
      { path: 'clubs', element: <ClubsPage /> },
      { path: 'clubs/:id', element: <ClubDetailsPage /> },
      { path: 'payments', element: <PaymentsPage /> },
      { path: 'support', element: <SupportPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'notifications', element: <NotificationPage /> },
      { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
      { path: 'terms', element: <TermsConditionsPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
