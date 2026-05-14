/**
 * @fileoverview High-fidelity Login Form component.
 * Implements react-hook-form + Zod validation with premium Tailwind v4 styling.
 * 
 * Features:
 * - Vertical layout matching image_874a98.jpg
 * - Strict TypeScript safety
 * - Accessibility-first form controls
 */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { loginUser } from '@/features/auth/slices/authSlice';
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
  const { isLoading } = useAppSelector((s) => s.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  /**
   * Handles form submission.
   * Dispatches the loginUser thunk and manages notifications.
   */
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await dispatch(loginUser(data));
      if (loginUser.fulfilled.match(result)) {
        toast.success('Successfully authenticated. Welcome back!');
      }
    } catch (err) {
      toast.error('Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Brand & Greeting */}
      <div className="flex flex-col items-center gap-6">
        <img
          src="/logos/full-logo.png"
          alt="Ride with Pals"
          className="w-48 object-contain"
          draggable={false}
        />
        <h1 className="font-poppins font-semibold text-xl text-white text-center leading-tight">
          Hi! Welcome back, <br className="md:hidden" /> you’ve been missed!
        </h1>
      </div>

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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
            className="btn-primary flex items-center justify-center gap-2"
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
              className="w-4 h-4 rounded border-white/20 bg-white/5 accent-accent"
            />
            <span>Remember Me</span>
          </label>
          <button
            type="button"
            className="text-white/50 hover:text-accent transition-colors underline underline-offset-4 decoration-white/10"
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
