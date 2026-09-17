import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/features/auth/slices/authSlice';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '@/Constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps children with an auth check.
 * Checks both Redux store and LocalStorage for token presence.
 * Listens for session expiry events to cleanly redirect to `/login`.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, token } = useAppSelector((s) => s.auth);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(logout());
      toast.error('Your session has expired. Please sign in again.');
      navigate('/login', { state: { from: location }, replace: true });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [dispatch, navigate, location]);

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
