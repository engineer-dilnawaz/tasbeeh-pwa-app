import { useEffect, useRef } from "react";
import {
  useInView,
  type IntersectionOptions,
} from "react-intersection-observer";

interface UseAutoScrollOptions extends IntersectionOptions {
  active?: boolean;
  triggerOnce?: boolean;
}

/**
 * useAutoScroll
 *
 * A shared hook that detects if a component is in view and
 * automatically scrolls it to the center if it's 'active' but not visible.
 *
 * @param options - Intersection and active state options
 * @returns { ref, inView, entry } - The ref to attach and visibility information
 */
export const useAutoScroll = (options: UseAutoScrollOptions = {}) => {
  const { active = false, threshold = 0.6, triggerOnce = true, ...rest } = options;
  const hasScrolledRef = useRef(false);

  // Reset the scroll lock when the component becomes inactive
  useEffect(() => {
    if (!active) {
      hasScrolledRef.current = false;
    }
  }, [active]);

  const { ref, inView, entry } = useInView({
    threshold,
    ...rest,
  });

  useEffect(() => {
    // Only scroll if active, and we haven't scrolled yet (if triggerOnce is true)
    if (active && entry?.target && (!triggerOnce || !hasScrolledRef.current)) {
      const timer = setTimeout(() => {
        entry.target.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        hasScrolledRef.current = true;
      }, 150); // Delay to allow layout animations to start
      
      return () => clearTimeout(timer);
    }
  }, [active, entry, triggerOnce]);

  return { ref, inView, entry };
};
