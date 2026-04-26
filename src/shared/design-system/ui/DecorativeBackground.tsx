import React from "react";
import { motion } from "framer-motion";

interface DecorativeBackgroundProps {
  className?: string;
  showDots?: boolean;
  showCircles?: boolean;
  showGlows?: boolean;
}

/**
 * DecorativeBackground
 * 
 * A premium background component that provides consistent brand aesthetics:
 * - Subtle geometric circles (Squircle-adjacent)
 * - Fine dot grid pattern
 * - Soft primary color glows
 * 
 * Use this as the first child of a relative container (like a Screen or Page).
 */
export const DecorativeBackground = React.memo<DecorativeBackgroundProps>(({
  className = "",
  showDots = true,
  showCircles = true,
  showGlows = true,
}) => {
  // Memoize particle data to prevent re-randomization on every re-render
  const particles = React.useMemo(() => {
    if (!showDots) return [];
    return [...Array(60)].map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 2,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animateX: [0, Math.random() * 120 - 60, Math.random() * 120 - 60, 0],
      animateY: [0, Math.random() * 120 - 60, Math.random() * 120 - 60, 0],
      duration: Math.random() * 20 + 15,
    }));
  }, [showDots]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {/* Background Decorative Circles */}
      {showCircles && (
        <>
          <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] border border-base-content/5 rounded-full -translate-y-1/2" />
          <div className="absolute top-[-220px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] border border-base-content/5 rounded-full -translate-y-1/2" />
        </>
      )}

      {/* Subtle Glows */}
      {showGlows && (
        <>
          <div className="absolute top-1/2 -right-24 w-64 h-64 bg-primary opacity-[0.06] rounded-full blur-3xl" />
          <div className="absolute bottom-[-100px] -left-24 w-80 h-80 bg-primary opacity-[0.04] rounded-full blur-3xl" />
        </>
      )}

      {/* Animated Particles (Dots) */}
      {showDots && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-base-content/40"
              style={{
                width: p.size,
                height: p.size,
                left: p.left,
                top: p.top,
              }}
              animate={{
                x: p.animateX,
                y: p.animateY,
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
});

DecorativeBackground.displayName = "DecorativeBackground";
