/**
 * @fileoverview Protected route guard.
 * Redirects unauthenticated visitors to /login, preserving the intended destination.
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps children with an auth check.
 * If the user is not authenticated, redirects to `/login` and stores the
 * original `location` in router state so we can redirect back after login.
 *
 * @param props.children - The protected content to render.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
