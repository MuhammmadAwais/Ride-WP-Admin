/**
 * @fileoverview Login Page — the entry point of the Ride With Pals Admin Panel.
 *
 * Layout: Two-block design (left decorative panel | right form panel).
 * Animation: GSAP floating bubbles on the left panel.
 * Form: react-hook-form + Zod validation.
 * Auth: Dispatches `loginUser` thunk → redirects to /dashboard on success.
 */
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import gsap from 'gsap';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { loginUser, clearError } from '@/features/auth/slices/authSlice';
import { cn } from '@/lib/utils';
import { LOGIN_COPY, ROUTES } from '@/Constants';
import type { LoginFormValues } from '@/features/auth/types/authTypes';

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Please enter a valid email address.'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters.'),
});

// ─── Bubble Configuration ─────────────────────────────────────────────────────

interface BubbleConfig {
  id: number;
  size: number;
  left: string;
  bottom: string;
  color: string;
  duration: number;
  delay: number;
  blur: string;
}

/** Static bubble data — deterministic positions to avoid CLS. */
const BUBBLES: BubbleConfig[] = [
  { id: 0,  size: 90,  left: '5%',  bottom: '-90px',  color: 'rgba(235,113,43,0.35)', duration: 13, delay: 0,   blur: '0px' },
  { id: 1,  size: 35,  left: '15%', bottom: '-35px',  color: 'rgba(235,113,43,0.5)',  duration: 9,  delay: 1.5, blur: '1px' },
  { id: 2,  size: 55,  left: '28%', bottom: '-55px',  color: 'rgba(255,255,255,0.06)',duration: 11, delay: 3,   blur: '2px' },
  { id: 3,  size: 20,  left: '42%', bottom: '-20px',  color: 'rgba(235,113,43,0.6)',  duration: 7,  delay: 0.8, blur: '0px' },
  { id: 4,  size: 70,  left: '55%', bottom: '-70px',  color: 'rgba(255,255,255,0.04)',duration: 14, delay: 2.5, blur: '3px' },
  { id: 5,  size: 45,  left: '68%', bottom: '-45px',  color: 'rgba(235,113,43,0.25)', duration: 10, delay: 4,   blur: '1px' },
  { id: 6,  size: 25,  left: '80%', bottom: '-25px',  color: 'rgba(235,113,43,0.55)', duration: 8,  delay: 1,   blur: '0px' },
  { id: 7,  size: 110, left: '88%', bottom: '-110px', color: 'rgba(255,255,255,0.03)',duration: 15, delay: 5,   blur: '4px' },
  { id: 8,  size: 30,  left: '22%', bottom: '-30px',  color: 'rgba(235,113,43,0.4)',  duration: 9,  delay: 6,   blur: '0px' },
  { id: 9,  size: 60,  left: '48%', bottom: '-60px',  color: 'rgba(235,113,43,0.2)',  duration: 12, delay: 2,   blur: '2px' },
  { id: 10, size: 18,  left: '72%', bottom: '-18px',  color: 'rgba(255,255,255,0.08)',duration: 6,  delay: 3.5, blur: '0px' },
  { id: 11, size: 80,  left: '10%', bottom: '-80px',  color: 'rgba(212,96,30,0.2)',   duration: 16, delay: 7,   blur: '3px' },
  { id: 12, size: 40,  left: '35%', bottom: '-40px',  color: 'rgba(235,113,43,0.45)', duration: 10, delay: 0.5, blur: '1px' },
  { id: 13, size: 22,  left: '60%', bottom: '-22px',  color: 'rgba(255,255,255,0.07)',duration: 7,  delay: 4.5, blur: '0px' },
  { id: 14, size: 50,  left: '92%', bottom: '-50px',  color: 'rgba(235,113,43,0.3)',  duration: 11, delay: 1.2, blur: '2px' },
];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Login page component.
 * Handles form validation, authentication dispatch, and GSAP bubble animations.
 */
const LoginPage: React.FC = () => {
  const dispatch       = useAppDispatch();
  const navigate       = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector((s) => s.auth);

  const [showPassword, setShowPassword] = React.useState(false);
  const bubblesRef   = useRef<(HTMLDivElement | null)[]>([]);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const cardRef      = useRef<HTMLDivElement>(null);

  // ─── Redirect if already authenticated ─────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.DASHBOARD, { replace: true });
  }, [isAuthenticated, navigate]);

  // ─── Show error toast ───────────────────────────────────────────────────────
  useEffect(() => {
    if (error) {
      toast.error(error, { duration: 4000 });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // ─── GSAP Bubble Animation ──────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      bubblesRef.current.forEach((bubble, i) => {
        if (!bubble) return;
        const cfg = BUBBLES[i];

        gsap.fromTo(
          bubble,
          { y: 0, opacity: 0, scale: 0.5 },
          {
            y: -(window.innerHeight + cfg.size + 40),
            opacity: 1,
            scale: 1,
            duration: cfg.duration,
            delay: cfg.delay,
            repeat: -1,
            ease: 'none',
            onRepeat() {
              gsap.set(bubble, { opacity: 0, scale: 0.5 });
              gsap.to(bubble, { opacity: 1, scale: 1, duration: 1.5 });
            },
          }
        );
      });
    }, leftPanelRef);

    return () => ctx.revert();
  }, []);

  // ─── Card entrance animation ────────────────────────────────────────────────
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  // ─── Form ───────────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  /**
   * Handles form submission. Dispatches `loginUser` thunk.
   * On success, navigation is handled by the `isAuthenticated` effect.
   *
   * @param data - Validated form values.
   */
  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      toast.success(LOGIN_COPY.SUCCESS_MESSAGE);
    }
  };

  /**
   * Toggles password field visibility.
   */
  const handleTogglePassword = (): void => {
    setShowPassword((prev) => !prev);
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-svh flex bg-dark-bg overflow-hidden">

      {/* ── LEFT PANEL — decorative ─────────────────────────────────────── */}
      <div
        ref={leftPanelRef}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-dark-panel flex-col items-center justify-center"
      >
        {/* Floating Bubbles */}
        {BUBBLES.map((b, i) => (
          <div
            key={b.id}
            ref={(el) => { bubblesRef.current[i] = el; }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width:  b.size,
              height: b.size,
              left:   b.left,
              bottom: b.bottom,
              background: b.color,
              filter: b.blur !== '0px' ? `blur(${b.blur})` : undefined,
            }}
            aria-hidden="true"
          />
        ))}

        {/* Radial gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 60% 40%, rgba(235,113,43,0.12) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-12 text-center">
          {/* Logo */}
          <img
            src="/logos/full-logo.png"
            alt="Ride with Pals logo"
            className="w-56 object-contain drop-shadow-2xl animate-fade-up"
            draggable={false}
          />

          {/* Tagline */}
          <div className="animate-fade-up delay-200">
            <p className="font-poppins text-white/80 text-lg font-medium leading-relaxed max-w-xs">
              {LOGIN_COPY.LEFT_TAGLINE}
            </p>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 animate-fade-up delay-300">
            {['Users', 'Clubs', 'Analytics', 'Payments'].map((label) => (
              <span
                key={label}
                className="glass px-4 py-1.5 rounded-pill text-white/70 text-sm font-roboto font-medium"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom decorative strip */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, transparent, #EB712B, transparent)' }}
          aria-hidden="true"
        />
      </div>

      {/* ── RIGHT PANEL — form ──────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10"
           style={{ background: 'var(--bg)' }}>
        <div
          ref={cardRef}
          className={cn(
            'w-full max-w-md rounded-card p-8 sm:p-10 shadow-card',
            'transition-colors duration-300'
          )}
          style={{ backgroundColor: 'var(--container)' }}
        >
          {/* Mobile-only logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <img
              src="/logos/full-logo.png"
              alt="Ride with Pals"
              className="h-12 object-contain"
              draggable={false}
            />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1
              className="font-poppins font-bold text-3xl mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              {LOGIN_COPY.HEADING}
            </h1>
            <p className="font-roboto text-sm" style={{ color: 'var(--text-secondary)' }}>
              {LOGIN_COPY.SUBHEADING}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-sm font-medium font-roboto"
                style={{ color: 'var(--text-primary)' }}
              >
                {LOGIN_COPY.EMAIL_LABEL}
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-hidden="true"
                />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder={LOGIN_COPY.EMAIL_PLACEHOLDER}
                  {...register('email')}
                  className={cn(
                    'w-full pl-10 pr-4 py-3 rounded-soft text-sm font-roboto',
                    'border transition-all duration-200 outline-none',
                    'focus:border-accent focus:ring-2 focus:ring-accent/20',
                    errors.email ? 'border-error' : 'border-border'
                  )}
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    borderColor: errors.email ? '#EF4444' : 'var(--border)',
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-error font-roboto" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="block text-sm font-medium font-roboto"
                style={{ color: 'var(--text-primary)' }}
              >
                {LOGIN_COPY.PASSWORD_LABEL}
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-hidden="true"
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder={LOGIN_COPY.PASSWORD_PLACEHOLDER}
                  {...register('password')}
                  className={cn(
                    'w-full pl-10 pr-12 py-3 rounded-soft text-sm font-roboto',
                    'border transition-all duration-200 outline-none',
                    'focus:border-accent focus:ring-2 focus:ring-accent/20',
                    errors.password ? 'border-error' : 'border-border'
                  )}
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    borderColor: errors.password ? '#EF4444' : 'var(--border)',
                  }}
                />
                <button
                  type="button"
                  id="toggle-password-visibility"
                  onClick={handleTogglePassword}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded transition-opacity hover:opacity-70"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {showPassword
                    ? <EyeOff size={16} aria-hidden="true" />
                    : <Eye     size={16} aria-hidden="true" />
                  }
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-error font-roboto" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full py-3.5 rounded-soft font-poppins font-semibold text-sm text-white',
                'gradient-accent shadow-accent',
                'transition-all duration-200 ease-out',
                'hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg',
                'active:translate-y-0 active:opacity-100',
                'disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0',
                'flex items-center justify-center gap-2',
                'mt-2'
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  <span>{LOGIN_COPY.SUBMITTING_LABEL}</span>
                </>
              ) : (
                <>
                  <span>{LOGIN_COPY.SUBMIT_LABEL}</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p
            className="mt-8 text-center text-xs font-roboto"
            style={{ color: 'var(--text-secondary)' }}
          >
            © {new Date().getFullYear()} Ride with Pals. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
