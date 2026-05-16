import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * A custom hook powered by GSAP to animate numbers from 0 to a target value.
 * @param endValue The final number to reach.
 * @param duration The duration of the animation in seconds.
 * @param prefix Optional string to prepend to the number (e.g. "$").
 * @param suffix Optional string to append to the number (e.g. "K").
 * @returns An object containing a ref to attach to a DOM element, and the current value for fallback if needed.
 */
export function useCountUp<T extends HTMLElement = HTMLParagraphElement>(endValue: number, duration: number = 2, prefix: string = '', suffix: string = '') {
  const numberRef = useRef<T>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!numberRef.current || hasAnimated) return;

    // We store the target value in a proxy object that GSAP will animate
    const obj = { value: 0 };

    gsap.to(obj, {
      value: endValue,
      duration: duration,
      ease: 'power3.out',
      delay: 0.2, // slight delay for layout to settle
      onUpdate: () => {
        if (numberRef.current) {
          // Format with commas for thousands
          const formatted = Math.round(obj.value).toLocaleString();
          numberRef.current.textContent = `${prefix}${formatted}${suffix}`;
        }
      },
      onComplete: () => {
        setHasAnimated(true);
      }
    });
  }, [endValue, duration, prefix, suffix, hasAnimated]);

  return { numberRef };
}
