import { useState, useEffect } from 'react';

export type ScrollDirection = 'up' | 'down' | null;

interface UseScrollDirectionOptions {
  threshold?: number;
  minScrollY?: number;
}

/**
 * Custom hook to detect scroll direction
 * @param threshold - Minimum pixels scrolled before direction changes (prevents jitter)
 * @param minScrollY - Minimum scroll position before triggering (prevents hiding at top)
 * @returns Current scroll direction ('up', 'down', or null)
 */
export function useScrollDirection({
  threshold = 10,
  minScrollY = 80,
}: UseScrollDirectionOptions = {}): ScrollDirection {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollDirection = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

      // Only update if scroll difference exceeds threshold
      if (Math.abs(currentScrollY - lastScrollY) >= threshold) {
        // Determine direction
        if (currentScrollY > lastScrollY && currentScrollY > minScrollY) {
          // Scrolling down and past minimum threshold
          setScrollDirection('down');
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up
          setScrollDirection('up');
        }
        setLastScrollY(currentScrollY <= 0 ? 0 : currentScrollY);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY, threshold, minScrollY]);

  return scrollDirection;
}
