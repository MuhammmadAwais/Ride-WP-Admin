/**
 * @fileoverview Premium Login Page entry point.
 * Orchestrates the mountain scene, GSAP-driven bubble physics,
 * and the pixel-perfect LoginForm card.
 */
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import LoginForm from './LoginForm';

// Register GSAP for React
gsap.registerPlugin(useGSAP);

// ─── Constants ────────────────────────────────────────────────────────────────

const BUBBLE_CONFIGS = [
  { left: '5%',   size: 140, delay: 0,   duration: 18, blur: 6, color: 'rgba(235,113,43,0.12)' },
  { left: '12%',  size: 50,  delay: 2,   duration: 12, blur: 2, color: 'rgba(255,255,255,0.08)' },
  { left: '22%',  size: 90,  delay: 5,   duration: 20, blur: 4, color: 'rgba(235,113,43,0.15)' },
  { left: '35%',  size: 40,  delay: 1,   duration: 10, blur: 1, color: 'rgba(255,255,255,0.06)' },
  { left: '48%',  size: 110, delay: 3.5, duration: 22, blur: 5, color: 'rgba(235,113,43,0.18)' },
  { left: '60%',  size: 70,  delay: 7,   duration: 14, blur: 2, color: 'rgba(255,255,255,0.07)' },
  { left: '75%',  size: 55,  delay: 4,   duration: 11, blur: 1, color: 'rgba(235,113,43,0.20)' },
  { left: '88%',  size: 100, delay: 0.5, duration: 24, blur: 7, color: 'rgba(255,255,255,0.04)' },
  { left: '95%',  size: 35,  delay: 6,   duration: 9,  blur: 0, color: 'rgba(235,113,43,0.25)' },
  { left: '2%',   size: 60,  delay: 8,   duration: 15, blur: 3, color: 'rgba(255,255,255,0.05)' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const LoginPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<(HTMLDivElement | null)[]>([]);

  /**
   * GSAP Orchestration
   * Handles the entry of the card and the perpetual bubble flow.
   */
  useGSAP(() => {
    if (!containerRef.current) return;

    // 1. Scene Entry
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.fromTo(backgroundRef.current, 
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5 }
    );

    tl.fromTo(cardRef.current,
      { y: 60, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2 },
      "-=1"
    );

    // 2. Bubble Physics
    bubblesRef.current.forEach((el, i) => {
      if (!el) return;
      const cfg = BUBBLE_CONFIGS[i];
      gsap.to(el, {
        y: -window.innerHeight - 300,
        opacity: 0.6,
        duration: cfg.duration,
        delay: cfg.delay,
        repeat: -1,
        ease: 'none',
        onRepeat: () => {
          gsap.set(el, { y: 0, opacity: 0 });
        }
      });
    });

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef}
      className="relative min-h-svh w-full flex items-center justify-center overflow-hidden bg-main-bg"
    >
      {/* ── Background Layer ── */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/backgrounds/bg.jpg")' }}
      >
        {/* Dark Scrim */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      {/* ── Bubble Physics Layer ── */}
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        {BUBBLE_CONFIGS.map((b, i) => (
          <div
            key={i}
            ref={(el) => { bubblesRef.current[i] = el; }}
            className="absolute bottom-[-150px] rounded-full opacity-0"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              backgroundColor: b.color,
              filter: b.blur > 0 ? `blur(${b.blur}px)` : 'none',
            }}
          />
        ))}
      </div>

      {/* ── Card Layer ── */}
      <main className="relative z-10 w-full flex justify-center px-4">
        <div ref={cardRef} className="login-card">
          <LoginForm />
        </div>
      </main>

      {/* Ambient Lighting */}
      <div 
        className="absolute top-0 left-0 w-full h-[30vh] pointer-events-none opacity-30"
        style={{ background: 'linear-gradient(to bottom, rgba(235,113,43,0.1), transparent)' }}
      />
    </div>
  );
};

export default LoginPage;
