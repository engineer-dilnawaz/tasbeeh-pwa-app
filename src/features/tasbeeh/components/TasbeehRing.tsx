import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Check } from "lucide-react";

interface TasbeehRingProps {
  count: number;
  target: number;
  arabic?: string;
  transliteration?: string;
  onTap: () => void;
  isCompleted?: boolean;
}

export const TasbeehRing: React.FC<TasbeehRingProps> = ({
  count,
  target,
  arabic,
  onTap,
  isCompleted = false,
}) => {
  const totalVisualBeads = 33;
  const beads = Array.from({ length: totalVisualBeads });
  const radius = 120;
  const center = 150;

  const progress = Math.min((count / target) * 100, 100);

  return (
    <div className="relative flex items-center justify-center w-[300px] h-[300px] mx-auto select-none">
      {/* 1. Unified SVG Orbital */}
      <svg
        viewBox="0 0 300 300"
        className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-20"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className={isCompleted ? "stroke-success/10" : "stroke-primary/10"}
          strokeWidth="2"
        />

        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className={isCompleted ? "stroke-success" : "stroke-primary"}
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${2 * Math.PI * radius}` }}
          animate={{
            strokeDasharray: `${(2 * Math.PI * radius * progress) / 100} ${2 * Math.PI * radius}`,
          }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        />

        {beads.map((_, i) => {
          const angle = (i * 360) / beads.length;
          const x = center + radius * Math.cos((angle * Math.PI) / 180);
          const y = center + radius * Math.sin((angle * Math.PI) / 180);
          const threshold = (i / totalVisualBeads) * target;
          const isActive = count > threshold;

          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={isActive ? 6 : 4}
              initial={false}
              animate={{
                r: isActive ? 7 : 4,
                fill: isActive
                  ? isCompleted
                    ? "var(--color-success)"
                    : "var(--color-primary)"
                  : "var(--color-base-content)",
                opacity: isActive ? 1 : 0.15,
              }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
      </svg>

      {/* 2. Main Interactive Core - Focus on Odometer Counter */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onTap}
        className="relative w-[180px] h-[180px] flex flex-col items-center justify-center transition-all duration-500 overflow-hidden z-10 bg-transparent border-none outline-none ring-0 no-tap-highlight"
      >

          <div className="flex flex-col items-center justify-center z-10">
            <AnimatePresence mode="wait">
              {isCompleted ? (
                <motion.div
                  key="completed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="flex flex-col items-center text-center px-4"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-3"
                  >
                    <Check size={32} className="text-success" strokeWidth={4} />
                  </motion.div>

                  <span className="text-display-arabic text-[28px] text-base-content leading-tight mb-1">
                    {arabic}
                  </span>
                  <span className="text-success text-[11px] font-black uppercase tracking-[0.2em]">
                    Completed
                  </span>

                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 text-[11px] font-black text-base-content uppercase tracking-[0.15em]"
                  >
                    Tap to Go Next
                  </motion.span>
                </motion.div>
              ) : (
                <motion.div
                  key="counting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center font-display text-[84px] font-black text-base-content leading-none"
                >
                  <span className="countdown">
                    <span style={{ "--value": Math.floor(count / 10) } as React.CSSProperties} />
                  </span>
                  <span className="countdown">
                    <span style={{ "--value": count % 10 } as React.CSSProperties} />
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.button>
    </div>
  );
};
