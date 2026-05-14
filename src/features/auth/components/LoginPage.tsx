/**
 * @fileoverview Premium Login Page with Forgot Password inline transition.
 *
 * Layout  : Full-viewport two-block horizontal split.
 *           Left  — decorative dark panel with GSAP floating bubbles + brand logo.
 *           Right — elevated glassmorphic card containing Login | Forgot-Password.
 *
 * Motion  : GSAP useGSAP for bubble infinite float.
 *           Card & field entrance via CSS animations (zero-CLS).
 *           Login ↔ Forgot Password flips via GSAP fade/scale.
 *
 * Auth    : Redux loginUser thunk + Zod/react-hook-form validation.
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Eye, EyeOff, Mail, Lock, ArrowRight,
  Loader2, ChevronLeft, Send,
} from 'lucide-react';
import { useAppDispatch }  from '@/hooks/useAppDispatch';
import { useAppSelector }  from '@/hooks/useAppSelector';
import { loginUser, clearError } from '@/features/auth/slices/authSlice';
import { cn }              from '@/lib/utils';
import { LOGIN_COPY, ROUTES } from '@/Constants';
import type { LoginFormValues } from '@/features/auth/types/authTypes';

// Register GSAP plugin
gsap.registerPlugin(useGSAP);

// ─── Types ────────────────────────────────────────────────────────────────────

interface ForgotFormValues {
  email: string;
}

interface BubbleConfig {
  id: number;
  size: number;
  left: string;
  delay: number;
  duration: number;
  color: string;
  blur: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email:    z.string().min(1, 'Email is required.').email('Enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

const forgotSchema = z.object({
  email: z.string().min(1, 'Email is required.').email('Enter a valid email.'),
});

/** Deterministic bubble data — no CLS, GSAP animates from here */
const BUBBLES: BubbleConfig[] = [
  { id: 0,  size: 100, left: '4%',  delay: 0,    duration: 14, color: 'rgba(235,113,43,0.30)', blur: 0  },
  { id: 1,  size: 40,  left: '12%', delay: 1.8,  duration: 9,  color: 'rgba(235,113,43,0.50)', blur: 1  },
  { id: 2,  size: 60,  left: '24%', delay: 3.5,  duration: 12, color: 'rgba(255,255,255,0.05)',blur: 2  },
  { id: 3,  size: 22,  left: '38%', delay: 0.7,  duration: 7,  color: 'rgba(235,113,43,0.60)', blur: 0  },
  { id: 4,  size: 80,  left: '50%', delay: 2.2,  duration: 15, color: 'rgba(255,255,255,0.04)',blur: 3  },
  { id: 5,  size: 48,  left: '63%', delay: 4.1,  duration: 11, color: 'rgba(235,113,43,0.22)', blur: 1  },
  { id: 6,  size: 28,  left: '76%', delay: 0.9,  duration: 8,  color: 'rgba(235,113,43,0.55)', blur: 0  },
  { id: 7,  size: 120, left: '86%', delay: 5.0,  duration: 16, color: 'rgba(255,255,255,0.03)',blur: 4  },
  { id: 8,  size: 34,  left: '20%', delay: 6.2,  duration: 10, color: 'rgba(235,113,43,0.38)', blur: 0  },
  { id: 9,  size: 64,  left: '45%', delay: 1.4,  duration: 13, color: 'rgba(235,113,43,0.18)', blur: 2  },
  { id: 10, size: 18,  left: '70%', delay: 3.0,  duration: 6,  color: 'rgba(255,255,255,0.07)',blur: 0  },
  { id: 11, size: 90,  left: '8%',  delay: 7.0,  duration: 17, color: 'rgba(212,96,30,0.18)',  blur: 3  },
  { id: 12, size: 44,  left: '32%', delay: 0.4,  duration: 10, color: 'rgba(235,113,43,0.42)', blur: 1  },
  { id: 13, size: 24,  left: '58%', delay: 4.6,  duration: 8,  color: 'rgba(255,255,255,0.06)',blur: 0  },
  { id: 14, size: 56,  left: '92%', delay: 1.0,  duration: 11, color: 'rgba(235,113,43,0.28)', blur: 2  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const LoginPage: React.FC = () => {
  const dispatch    = useAppDispatch();
  const navigate    = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector((s) => s.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [forgotSent, setForgotSent] = useState(false);

  // Refs
  const leftPanelRef  = useRef<HTMLDivElement>(null);
  const cardRef        = useRef<HTMLDivElement>(null);
  const loginPanelRef  = useRef<HTMLDivElement>(null);
  const forgotPanelRef = useRef<HTMLDivElement>(null);
  const bubblesRef     = useRef<(HTMLDivElement | null)[]>([]);

  // ─── Redirect if already logged in ────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.DASHBOARD, { replace: true });
  }, [isAuthenticated, navigate]);

  // ─── Error toast ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (error) {
      toast.error(error, { duration: 4000 });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // ─── GSAP Bubble animation ────────────────────────────────────────────────
  useGSAP(() => {
    bubblesRef.current.forEach((el, i) => {
      if (!el) return;
      const cfg = BUBBLES[i];
      gsap.fromTo(
        el,
        { y: 0, opacity: 0, scale: 0.6 },
        {
          y: -(window.innerHeight + cfg.size + 80),
          opacity: 0.9,
          scale: 1,
          duration: cfg.duration,
          delay: cfg.delay,
          ease: 'none',
          repeat: -1,
          onRepeat() {
            gsap.set(el, { opacity: 0, scale: 0.6, y: 0 });
          },
        }
      );
    });
  }, { scope: leftPanelRef });

  // ─── Card entrance ────────────────────────────────────────────────────────
  useGSAP(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { y: 32, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'expo.out', delay: 0.15 }
    );
  }, []);

  // ─── Mode transition: Login → Forgot ─────────────────────────────────────
  const switchToForgot = useCallback(() => {
    const tl = gsap.timeline();
    tl.to(loginPanelRef.current, { opacity: 0, y: -16, duration: 0.28, ease: 'power2.in' })
      .call(() => setMode('forgot'))
      .fromTo(
        forgotPanelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.38, ease: 'expo.out' },
        '+=0.04'
      );
  }, []);

  const switchToLogin = useCallback(() => {
    const tl = gsap.timeline();
    tl.to(forgotPanelRef.current, { opacity: 0, y: -16, duration: 0.28, ease: 'power2.in' })
      .call(() => { setMode('login'); setForgotSent(false); })
      .fromTo(
        loginPanelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.38, ease: 'expo.out' },
        '+=0.04'
      );
  }, []);

  // ─── Forms ───────────────────────────────────────────────────────────────
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onLogin = async (data: LoginFormValues): Promise<void> => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      toast.success(LOGIN_COPY.SUCCESS_MESSAGE);
    }
  };

  const onForgot = async (_data: ForgotFormValues): Promise<void> => {
    // Simulate request
    await new Promise<void>((r) => setTimeout(r, 1000));
    setForgotSent(true);
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-svh flex overflow-hidden" style={{ backgroundColor: '#202020' }}>

      {/* ── LEFT PANEL — decorative ───────────────────────────────────────── */}
      <div
        ref={leftPanelRef}
        className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden flex-col items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #1a1a1a 0%, #212121 50%, #181818 100%)' }}
      >
        {/* Ambient radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 60%, rgba(235,113,43,0.14) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Floating bubbles */}
        {BUBBLES.map((b, i) => (
          <div
            key={b.id}
            ref={(el) => { bubblesRef.current[i] = el; }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width:      b.size,
              height:     b.size,
              left:       b.left,
              bottom:     `-${b.size}px`,
              background: b.color,
              filter:     b.blur > 0 ? `blur(${b.blur}px)` : undefined,
            }}
            aria-hidden="true"
          />
        ))}

        {/* Brand content */}
        <div className="relative z-10 flex flex-col items-center gap-10 px-14 text-center">
          {/* Logo */}
          <div className="animate-fade-up">
            <img
              src="/logos/full-logo.png"
              alt="Ride with Pals"
              className="w-52 object-contain drop-shadow-2xl"
              draggable={false}
            />
          </div>

          {/* Tagline */}
          <div className="animate-fade-up delay-150 space-y-2">
            <p className="font-poppins text-white/75 text-xl font-medium leading-snug max-w-xs">
              {LOGIN_COPY.LEFT_TAGLINE}
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2.5 animate-fade-up delay-300">
            {['Users', 'Clubs', 'Payments', 'Analytics'].map((label) => (
              <span
                key={label}
                className="glass px-4 py-1.5 text-white/65 text-sm font-roboto font-medium"
                style={{ borderRadius: 9999 }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom accent strip */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(235,113,43,0.6) 50%, transparent 100%)' }}
          aria-hidden="true"
        />
      </div>

      {/* ── RIGHT PANEL — form ────────────────────────────────────────────── */}
      <div
        className="flex-1 flex items-center justify-center p-5 sm:p-10"
        style={{ backgroundColor: '#F6F6F6' }}
      >
        {/* Elevated card */}
        <div
          ref={cardRef}
          className="w-full max-w-[420px]"
          style={{
            background:   '#FFFFFF',
            borderRadius: 24,
            boxShadow:    '0 32px 80px -16px rgba(0,0,0,0.16), 0 8px 24px rgba(0,0,0,0.08)',
            padding:      '2.5rem 2.25rem',
          }}
        >
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <img
              src="/logos/full-logo.png"
              alt="Ride with Pals"
              className="h-10 object-contain"
              draggable={false}
            />
          </div>

          {/* ── LOGIN MODE ── */}
          <div
            ref={loginPanelRef}
            style={{ display: mode === 'login' ? 'block' : 'none' }}
          >
            {/* Heading */}
            <div className="mb-7">
              <h1
                className="font-poppins font-bold text-3xl mb-1.5 tracking-tight"
                style={{ color: '#363636' }}
              >
                {LOGIN_COPY.HEADING}
              </h1>
              <p className="font-roboto text-sm" style={{ color: '#818181' }}>
                {LOGIN_COPY.SUBHEADING}
              </p>
            </div>

            <form onSubmit={handleLoginSubmit(onLogin)} noValidate className="space-y-4">
              {/* Email */}
              <FieldWrapper label={LOGIN_COPY.EMAIL_LABEL} htmlFor="login-email" error={loginErrors.email?.message}>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: '#B0B0B0' }}
                    aria-hidden="true"
                  />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder={LOGIN_COPY.EMAIL_PLACEHOLDER}
                    {...registerLogin('email')}
                    className={cn('field pl-10', loginErrors.email && 'error')}
                  />
                </div>
              </FieldWrapper>

              {/* Password */}
              <FieldWrapper label={LOGIN_COPY.PASSWORD_LABEL} htmlFor="login-password" error={loginErrors.password?.message}>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: '#B0B0B0' }}
                    aria-hidden="true"
                  />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder={LOGIN_COPY.PASSWORD_PLACEHOLDER}
                    {...registerLogin('password')}
                    className={cn('field pl-10 pr-12', loginErrors.password && 'error')}
                  />
                  <button
                    type="button"
                    id="toggle-pw-btn"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded transition-opacity hover:opacity-70"
                    style={{ color: '#B0B0B0' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
                  </button>
                </div>
              </FieldWrapper>

              {/* Forgot password link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={switchToForgot}
                  className="text-xs font-roboto font-medium transition-colors hover:underline"
                  style={{ color: '#EB712B' }}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="btn-accent w-full mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                    <span>{LOGIN_COPY.SUBMITTING_LABEL}</span>
                  </>
                ) : (
                  <>
                    <span>{LOGIN_COPY.SUBMIT_LABEL}</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ── FORGOT PASSWORD MODE ── */}
          <div
            ref={forgotPanelRef}
            style={{ display: mode === 'forgot' ? 'block' : 'none' }}
          >
            {/* Back button */}
            <button
              type="button"
              onClick={switchToLogin}
              className="flex items-center gap-1.5 text-sm font-roboto mb-7 transition-colors hover:opacity-70"
              style={{ color: '#818181' }}
            >
              <ChevronLeft size={16} aria-hidden="true" />
              Back to sign in
            </button>

            {!forgotSent ? (
              <>
                <div className="mb-7">
                  <h1 className="font-poppins font-bold text-2xl mb-1.5 tracking-tight" style={{ color: '#363636' }}>
                    Reset Password
                  </h1>
                  <p className="font-roboto text-sm" style={{ color: '#818181' }}>
                    Enter your email and we'll send you a reset link.
                  </p>
                </div>

                <form onSubmit={handleForgotSubmit(onForgot)} noValidate className="space-y-4">
                  <FieldWrapper label="Email Address" htmlFor="forgot-email" error={forgotErrors.email?.message}>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#B0B0B0' }} aria-hidden="true" />
                      <input
                        id="forgot-email"
                        type="email"
                        autoComplete="email"
                        placeholder="your@email.com"
                        {...registerForgot('email')}
                        className={cn('field pl-10', forgotErrors.email && 'error')}
                      />
                    </div>
                  </FieldWrapper>
                  <button type="submit" className="btn-accent w-full mt-2">
                    <Send size={15} aria-hidden="true" />
                    <span>Send Reset Link</span>
                  </button>
                </form>
              </>
            ) : (
              /* Success state */
              <div className="text-center py-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(34,197,94,0.12)' }}
                >
                  <Send size={22} style={{ color: '#22C55E' }} aria-hidden="true" />
                </div>
                <h2 className="font-poppins font-semibold text-xl mb-2" style={{ color: '#363636' }}>Check your inbox</h2>
                <p className="font-roboto text-sm" style={{ color: '#818181' }}>
                  We've sent a password reset link. It may take a minute.
                </p>
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="mt-6 text-sm font-roboto font-medium transition-colors hover:underline"
                  style={{ color: '#EB712B' }}
                >
                  Return to sign in
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs font-roboto" style={{ color: '#B0B0B0' }}>
            © {new Date().getFullYear()} Ride with Pals. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── FieldWrapper ─────────────────────────────────────────────────────────────

interface FieldWrapperProps {
  label:    string;
  htmlFor:  string;
  error?:   string;
  children: React.ReactNode;
}

const FieldWrapper: React.FC<FieldWrapperProps> = ({ label, htmlFor, error, children }) => (
  <div className="space-y-1.5">
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium font-roboto"
      style={{ color: '#363636' }}
    >
      {label}
    </label>
    {children}
    {error && (
      <p className="text-xs font-roboto" style={{ color: '#EF4444' }} role="alert">
        {error}
      </p>
    )}
  </div>
);

export default LoginPage;
