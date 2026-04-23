import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateSetState } from "../utils/counterEngine";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Check } from "lucide-react";

interface TasbeehRingProps {
  count: number;
  target: number;
  arabic?: string;
  transliteration?: string;
  onTap: () => void;
  onShowDetails?: () => void;
  isCompleted?: boolean;
}

export const TasbeehRing: React.FC<TasbeehRingProps> = ({
  count,
  target,
  arabic,
  onTap,
  onShowDetails,
  isCompleted = false,
}) => {
  // --- Derived Engine State ---
  const { 
    setProgress,
    beadsInCurrentSet, 
    completedBeadsInSet,
    totalSets,
    currentSetIndex
  } = calculateSetState(count, target);

  const beads = Array.from({ length: beadsInCurrentSet });
  const radius = 120;
  const center = 150;

  return (
    <div className="relative flex items-center justify-center w-[300px] h-[300px] mx-auto select-none">
      {/* 1. Ambient Dynamic Aura (Liquid Glow) */}
      <motion.div
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 rounded-full border-[10px] border-primary/5 blur-xl z-0"
      />

      {/* 2. Progress Orbital (Layered Liquid Fill) */}
      <svg
        viewBox="0 0 300 300"
        className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-20"
      >
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className={isCompleted ? "stroke-success/10" : "stroke-primary/10"}
          strokeWidth="2"
        />

        {/* Liquid Trail (Slower, soft) */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className={isCompleted ? "stroke-success/30" : "stroke-primary/30"}
          strokeWidth="4"
          strokeLinecap="round"
          initial={false}
          animate={{
            strokeDasharray: `${(2 * Math.PI * radius * setProgress) / 100} ${2 * Math.PI * radius}`,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: "blur(4px)" }}
        />

        {/* Primary Liquid Progress */}
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
            strokeDasharray: `${(2 * Math.PI * radius * setProgress) / 100} ${2 * Math.PI * radius}`,
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.34, 1.3, 0.64, 1] // Liquid spring
          }}
        />

        {/* Beads (Tactile feedback) */}
        {beads.map((_, i) => {
          const angle = (i * 360) / beads.length;
          const x = center + radius * Math.cos((angle * Math.PI) / 180);
          const y = center + radius * Math.sin((angle * Math.PI) / 180);
          const isActive = (i + 1) <= completedBeadsInSet;

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
                scale: isActive ? [1, 1.1, 1] : 1
              }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
      </svg>

      {/* 3. Haptic Feedback Ripples (Triggers on count change) */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={count}
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 1.5, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute w-[180px] h-[180px] rounded-full border-2 border-primary/20 pointer-events-none z-0"
        />
      </AnimatePresence>

      {/* 2. Main Interactive Core */}
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
                    Target Reached
                  </span>

                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 text-[11px] font-black text-base-content uppercase tracking-[0.15em]"
                  >
                    Tap to Continue
                  </motion.span>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center">
                  <motion.div
                    key="counting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center font-display font-black text-base-content leading-none tracking-tighter"
                    style={{
                      fontSize: 
                        count.toString().length <= 2 ? "84px" :
                        count.toString().length === 3 ? "72px" :
                        count.toString().length === 4 ? "52px" : 
                        count.toString().length === 5 ? "38px" : "32px"
                    }}
                  >
                    {count.toLocaleString()}
                  </motion.div>
                  
                  {/* Visual Set Indicator for multi-rotation */}
                  {totalSets > 1 && (
                    <motion.div 
                      role="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowDetails?.();
                      }}
                      className="flex gap-1 mt-2 h-4 items-center group/indicator cursor-pointer no-tap-highlight"
                    >
                       {totalSets <= 10 ? (
                         Array.from({ length: totalSets }).map((_, idx) => (
                           <div 
                             key={idx}
                             className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                               idx === currentSetIndex ? "bg-primary w-3" : "bg-base-content/20"
                             } group-hover/indicator:scale-110`}
                           />
                         ))
                       ) : (
                         <span className="text-[10px] font-black text-base-content/30 uppercase tracking-widest group-hover/indicator:text-primary transition-colors">
                           Circle {currentSetIndex + 1} / {totalSets}
                         </span>
                       )}
                    </motion.div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.button>
    </div>
  );
};
