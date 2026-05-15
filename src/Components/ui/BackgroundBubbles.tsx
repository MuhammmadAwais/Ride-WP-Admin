/**
 * @fileoverview BackgroundBubbles — "Zero-G" Foundation Layer (z-0)
 *
 * 6 large, blurred, floating blobs animated with GSAP using `useGSAP`
 * for guaranteed cleanup on unmount. Colors: #EB712B and #464646 at 10% opacity.
 *
 * Placement: Rendered in AppLayout BEHIND all other content.
 * This is the glassmorphism foundation — without it, backdrop-blur has nothing to blur.
 */
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface BlobConfig {
  id: number;
  color: string;
  width: string;
  height: string;
  initialTop: string;
  initialLeft: string;
  targetTop: string;
  targetLeft: string;
  duration: number;
  delay: number;
}

const BLOBS: BlobConfig[] = [
  {
    id: 1,
    color: '#EB712B',
    width: '700px',
    height: '700px',
    initialTop: '-15%',
    initialLeft: '-10%',
    targetTop: '-5%',
    targetLeft: '5%',
    duration: 18,
    delay: 0,
  },
  {
    id: 2,
    color: '#464646',
    width: '600px',
    height: '600px',
    initialTop: '50%',
    initialLeft: '60%',
    targetTop: '60%',
    targetLeft: '70%',
    duration: 22,
    delay: 2,
  },
  {
    id: 3,
    color: '#EB712B',
    width: '500px',
    height: '500px',
    initialTop: '70%',
    initialLeft: '-5%',
    targetTop: '80%',
    targetLeft: '5%',
    duration: 20,
    delay: 4,
  },
  {
    id: 4,
    color: '#464646',
    width: '450px',
    height: '450px',
    initialTop: '10%',
    initialLeft: '75%',
    targetTop: '20%',
    targetLeft: '65%',
    duration: 25,
    delay: 1,
  },
  {
    id: 5,
    color: '#EB712B',
    width: '380px',
    height: '380px',
    initialTop: '40%',
    initialLeft: '30%',
    targetTop: '30%',
    targetLeft: '40%',
    duration: 16,
    delay: 3,
  },
  {
    id: 6,
    color: '#464646',
    width: '520px',
    height: '520px',
    initialTop: '-5%',
    initialLeft: '40%',
    targetTop: '10%',
    targetLeft: '50%',
    duration: 28,
    delay: 5,
  },
];

const BackgroundBubbles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const blobs = containerRef.current.querySelectorAll<HTMLDivElement>('.bg-blob');

      blobs.forEach((blob, i) => {
        const config = BLOBS[i];
        if (!config) return;

        // Infinite yoyo float animation — each blob has unique path & timing
        gsap.to(blob, {
          top: config.targetTop,
          left: config.targetLeft,
          duration: config.duration,
          delay: config.delay,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });

        // Gentle scale pulse for organic feel
        gsap.to(blob, {
          scale: 1.08,
          duration: config.duration * 0.6,
          delay: config.delay + 1,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {BLOBS.map((blob) => (
        <div
          key={blob.id}
          className="bg-blob absolute rounded-full"
          style={{
            width: blob.width,
            height: blob.height,
            top: blob.initialTop,
            left: blob.initialLeft,
            backgroundColor: blob.color,
            opacity: 0.10,
            filter: 'blur(120px)',
            willChange: 'transform, top, left',
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundBubbles;
