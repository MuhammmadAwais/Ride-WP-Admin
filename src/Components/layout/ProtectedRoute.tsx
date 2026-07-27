/**
 * @fileoverview Protected route guard.
 * Validates authentication token in Redux store or LocalStorage.
 * Redirects unauthenticated visitors to /login, preserving the intended destination.
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { STORAGE_KEYS } from '@/Constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps children with an auth check.
 * Checks both Redux store and LocalStorage for token presence.
 * If unauthenticated, redirects to `/login` and stores original location in state.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, token } = useAppSelector((s) => s.auth);
  const location = useLocation();

  const hasValidAuth = Boolean(
    isAuthenticated ||
      token ||
      (typeof window !== 'undefined' &&
        localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN))
  );

  if (!hasValidAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
