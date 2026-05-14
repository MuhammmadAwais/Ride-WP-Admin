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

/**
 * Application router instance.
 * Add new protected routes under the `/dashboard` children array.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
    ],
  },
]);
