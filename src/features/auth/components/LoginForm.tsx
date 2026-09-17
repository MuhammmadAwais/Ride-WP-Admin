/**
 * @fileoverview High-fidelity Login Form component with RTK Query integration.
 * Implements react-hook-form + Zod validation with live /admin/login endpoint call.
 */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setCredentials } from '@/features/auth/slices/authSlice';
import { useLoginAdminMutation } from '@/features/auth/api/authApi';
import { cn } from '@/lib/utils';
import type { LoginFormValues } from '@/features/auth/types/authTypes';

// ─── Schema Definition ───────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// ─── Component ────────────────────────────────────────────────────────────────

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginAdmin, { isLoading }] = useLoginAdminMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const savedEmail =
    typeof window !== 'undefined'
      ? localStorage.getItem('rwp_remember_email') || ''
      : '';

  const [rememberMe, setRememberMe] = useState(Boolean(savedEmail));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: savedEmail, password: '' },
  });

  /**
   * Handles form submission.
   * Invokes loginAdmin mutation and dispatches setCredentials on success.
   * Enforces Role-Based Access Control (RBAC) ensuring only admin accounts proceed.
   */
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setErrorMessage(null);
      const res = await loginAdmin(data).unwrap();

      // Enforce RBAC guard
      if (res.role && res.role.toLowerCase() !== 'admin') {
        throw new Error('Access denied. Administrator privileges required.');
      }

      if (rememberMe) {
        localStorage.setItem('rwp_remember_email', data.email);
      } else {
        localStorage.removeItem('rwp_remember_email');
      }

      dispatch(
        setCredentials({
          user: {
            id: res.id,
            email: res.email,
            name: res.name,
            role: res.role,
            token: res.token,
          },
          token: res.token,
        })
      );

      toast.success(`Welcome back, ${res.name || 'Admin'}!`);

      // Redirect to intended destination or dashboard
      const stateObj = location.state as { from?: { pathname?: string } } | null;
      const from = stateObj?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const errorObj = err as {
        message?: string;
        data?: { message?: string; error?: string } | string;
      };
      const msg =
        (typeof errorObj?.data === 'object'
          ? errorObj.data.message || errorObj.data.error
          : errorObj?.data) ||
        errorObj?.message ||
        'Authentication failed. Please check your credentials.';
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Brand & Greeting */}
      <div className="flex flex-col items-center gap-6">
        <img
          src="/logos/dark-theme-logo.png"
          alt="Ride with Pals"
          className="w-48 object-contain"
          draggable={false}
        />
        <h1 className="font-poppins font-semibold text-xl text-white text-center leading-tight">
          Hi! Welcome back, <br className="md:hidden" /> you’ve been missed!
        </h1>
      </div>

      {/* Backend Error Alert Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-fade-in">
          <AlertCircle size={18} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <div className="relative group">
            <input
              id="login-email"
              type="email"
              placeholder="Username / Email"
              {...register('email')}
              className={cn(
                'field',
                errors.email && 'field-error'
              )}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-error px-2 animate-fade-in">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <div className="relative group">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              {...register('password')}
              className={cn(
                'field pr-12',
                errors.password && 'field-error'
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="hover:cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-white/50 hover:text-accent transition-all duration-200 z-10"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-error px-2 animate-fade-in">{errors.password.message}</p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex items-center justify-center gap-2 hover:cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </div>

        {/* Helpers */}
        <div className="flex items-center justify-between text-sm pt-2">
          <label className="flex items-center gap-2 text-white/50 cursor-pointer hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 accent-accent cursor-pointer"
            />
            <span>Remember Me</span>
          </label>
          <button
            type="button"
            className="text-white/50 hover:text-accent transition-colors underline underline-offset-4 decoration-white/10 hover:cursor-pointer"
            onClick={() => toast.info('Please contact your system administrator to reset your password.')}
          >
            Forgot Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
