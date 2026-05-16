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
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import ProtectedRoute from '@/Components/layout/ProtectedRoute';
import UsersPage from '@/features/users/pages/UsersPage';
import UserDetailPage from '@/features/users/pages/UserDetailPage';

/**
 * Application router instance.
 * Add new protected routes under the `/dashboard` children array.
 */
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'users/:id', element: <UserDetailPage /> },
      { path: 'clubs', element: <div className="p-8 text-white">Clubs Page (Coming Soon)</div> },
      { path: 'payments', element: <div className="p-8 text-white">Payments Page (Coming Soon)</div> },
      { path: 'requests', element: <div className="p-8 text-white">Requests Page (Coming Soon)</div> },
      { path: 'analytics', element: <div className="p-8 text-white">Analytics Page (Coming Soon)</div> },
      { path: 'support', element: <div className="p-8 text-white">Support Page (Coming Soon)</div> },
      { path: 'notifications', element: <div className="p-8 text-white">Notifications Page (Coming Soon)</div> },
      { path: 'privacy-policy', element: <div className="p-8 text-white">Privacy Policy Page (Coming Soon)</div> },
      { path: 'terms', element: <div className="p-8 text-white">Terms Page (Coming Soon)</div> },
      { path: 'about', element: <div className="p-8 text-white">About Page (Coming Soon)</div> },
    ],
  },
]);
