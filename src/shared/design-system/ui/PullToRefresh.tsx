import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { RefreshCw } from "lucide-react";

export interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  disabled?: boolean;
}

/**
 * PullToRefresh Primitive.
 * A tactile, gesture-driven refresh indicator specifically designed for PWAs.
 * Features ultra-smooth Framer Motion physics, resistance logic, and haptic-ready triggers.
 */
export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  disabled = false,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const pullDistance = useMotionValue(0);
  
  // Resistance factor: higher = harder to pull
  const PULL_THRESHOLD = 80;
  const MAX_PULL = 140;
  
  // Transform pull distance to visual scale/opacity for the indicator
  const indicatorY = useTransform(pullDistance, [0, PULL_THRESHOLD], [-40, 20]);
  const indicatorOpacity = useTransform(pullDistance, [0, PULL_THRESHOLD], [0, 1]);
  const indicatorScale = useTransform(pullDistance, [0, PULL_THRESHOLD], [0.8, 1]);
  const iconRotate = useTransform(pullDistance, [0, MAX_PULL], [0, 360]);

  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing || window.scrollY > 0) return;
    startY.current = e.touches[0].pageY;
    isPulling.current = true;
  }, [disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling.current) return;
    
    const currentY = e.touches[0].pageY;
    const diff = currentY - startY.current;
    
    if (diff > 0 && window.scrollY <= 0) {
      if (e.cancelable) e.preventDefault();
      
      // Apply resistance: diff / (1 + diff / MAX_PULL)
      const resistedDiff = Math.min(diff / 2.5, MAX_PULL);
      pullDistance.set(resistedDiff);
      setPullProgress(Math.min(resistedDiff / PULL_THRESHOLD, 1));
    } else {
      isPulling.current = false;
      pullDistance.set(0);
      setPullProgress(0);
    }
  }, [pullDistance, MAX_PULL, PULL_THRESHOLD]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current) return;
    isPulling.current = false;

    if (pullDistance.get() >= PULL_THRESHOLD) {
      setIsRefreshing(true);
      // Settle at refreshing position
      animate(pullDistance, PULL_THRESHOLD, { type: "spring", stiffness: 300, damping: 30 });
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        animate(pullDistance, 0, { type: "spring", stiffness: 300, damping: 30 });
        setPullProgress(0);
      }
    } else {
      animate(pullDistance, 0, { type: "spring", stiffness: 300, damping: 30 });
      setPullProgress(0);
    }
  }, [onRefresh, pullDistance, PULL_THRESHOLD]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("touchstart", handleTouchStart, { passive: false });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd);

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Pull Indicator Container */}
      <motion.div
        style={{ 
          y: indicatorY,
          opacity: indicatorOpacity,
          scale: indicatorScale,
        }}
        className="absolute left-1/2 -ml-6 z-50 flex items-center justify-center w-12 h-12"
      >
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-base-100 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-base-content/5 overflow-hidden">
          {/* Progress Ring Background */}
          {!isRefreshing && (
             <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                   cx="20" cy="20" r="14"
                   fill="none" stroke="currentColor"
                   strokeWidth="2.5"
                   className="text-primary/10"
                />
                <motion.circle
                   cx="20" cy="20" r="14"
                   fill="none" stroke="currentColor"
                   strokeWidth="2.5"
                   strokeDasharray="88"
                   strokeDashoffset={88 - (88 * pullProgress)}
                   className="text-primary"
                />
             </svg>
          )}

          {/* Icon */}
          <motion.div
            style={{ rotate: isRefreshing ? undefined : iconRotate }}
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
            className="text-primary z-10"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content Component */}
      <motion.div 
        style={{ y: pullDistance }}
        className="flex-1"
      >
        {children}
      </motion.div>
    </div>
  );
};
