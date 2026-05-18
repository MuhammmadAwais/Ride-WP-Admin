import { useState, useEffect } from 'react';

/**
 * Animated count-up hook for numbers rolling from 0 to target on initial mount.
 * @param target The target number to count up to.
 * @param duration The animation time in milliseconds.
 */
export function useCountUp(target: number, duration: number = 800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    if (end === 0) return;

    const totalSteps = 40;
    const increment = Math.ceil(end / totalSteps);
    const stepTime = duration / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}
