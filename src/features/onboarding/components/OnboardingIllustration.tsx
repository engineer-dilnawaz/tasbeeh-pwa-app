import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingIllustrationProps {
  centerChar?: string;
  className?: string;
}

export const OnboardingIllustration: React.FC<OnboardingIllustrationProps> = ({
  centerChar = "ذ",
  className = "",
}) => {
  const [activeDot, setActiveDot] = useState(0);
  const dots = Array.from({ length: 12 });
  const radius = 64; 

  // Clockwise animation of green dots
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % dots.length);
    }, 1500); // Slower, calmer pace
    return () => clearInterval(interval);
  }, [dots.length]);

  return (
    <div className={`relative flex items-center justify-center w-[220px] h-[220px] ${className}`}>
      {/* Outer Glow/Layer 1 */}
      <div className="absolute inset-0 bg-base-content opacity-[0.03] rounded-full" />
      
      {/* Inner Layer 2 */}
      <div className="absolute inset-[20px] bg-base-content opacity-[0.05] rounded-full shadow-sm" />

      {/* Center Character Circle */}
      <div className="absolute inset-[64px] bg-primary opacity-[0.12] rounded-full" />
      <div className="absolute inset-[72px] bg-primary opacity-[0.18] rounded-full" />
      
      <div className="absolute flex items-center justify-center">
        <motion.span 
          key={centerChar}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-primary text-[42px] font-bold leading-none select-none"
        >
          {centerChar}
        </motion.span>
      </div>

      {/* Dots Ring */}
      <div className="absolute inset-0">
        {dots.map((_, i) => {
          const angle = (i * 360) / dots.length - 90; // Start from top
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          
          const isGreen = i === activeDot;
          
          return (
            <React.Fragment key={i}>
              {/* ripple effect for green dot */}
              <AnimatePresence>
                {isGreen && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0.8 }}
                    animate={{ scale: 3, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute w-3 h-3 rounded-full bg-success"
                    style={{
                      left: `calc(50% + ${x}px - 6px)`,
                      top: `calc(50% + ${y}px - 6px)`,
                    }}
                  />
                )}
              </AnimatePresence>

              <motion.div
                initial={false}
                animate={{
                  scale: isGreen ? 1.4 : 1,
                  backgroundColor: isGreen ? "var(--color-success)" : "var(--color-primary)",
                  opacity: isGreen ? 1 : 0.15,
                }}
                transition={{ duration: 0.8 }}
                className="absolute w-3 h-3 rounded-full z-10"
                style={{
                  left: `calc(50% + ${x}px - 6px)`,
                  top: `calc(50% + ${y}px - 6px)`,
                }}
              />
            </React.Fragment>
          );
        })}
      </div>
      
    </div>
  );
};
