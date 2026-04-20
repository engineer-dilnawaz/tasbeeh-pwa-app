import React from "react";
import { motion } from "framer-motion";
import { Flame, Calendar } from "lucide-react";
import { Squircle } from "@/shared/design-system/ui/Squircle";

interface HomeHeaderProps {
  streakDays: number;
  isHijri: boolean;
  onDateToggle: () => void;
  gregorianDate: string;
  hijriDate: string;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  streakDays,
  isHijri,
  onDateToggle,
  gregorianDate,
  hijriDate,
}) => {
  return (
    <div className="w-full flex items-center justify-between">
      {/* Animated Streak */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Squircle cornerRadius={12} cornerSmoothing={0.99} asChild>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-black border border-base-content/5 shadow-sm">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-orange-500"
            >
              <Flame size={16} fill="currentColor" />
            </motion.div>
            <span className="text-[12px] font-black text-base-content tracking-tight">
              {streakDays} {streakDays === 1 ? "DAY" : "DAYS"}
            </span>
          </div>
        </Squircle>
      </motion.div>

      {/* Interactive Date Switcher (3D Flip) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="cursor-pointer select-none"
        onClick={onDateToggle}
        style={{ perspective: 1000 }}
      >
        <motion.div
          animate={{ rotateY: isHijri ? 180 : 0 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-[185px] h-[34px]"
        >
          <div style={{ backfaceVisibility: "hidden" }} className="absolute inset-0 z-10">
            <Squircle cornerRadius={12} cornerSmoothing={0.99} asChild>
              <div className="flex items-center gap-2 px-3 py-1.5 h-full bg-white dark:bg-black border border-base-content/5 shadow-sm">
                <Calendar size={13} className="text-primary shrink-0" />
                <span className="text-[10px] font-black text-base-content/70 tracking-tight leading-none uppercase whitespace-nowrap">
                  {gregorianDate}
                </span>
              </div>
            </Squircle>
          </div>

          <div
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            className="absolute inset-0"
          >
            <Squircle cornerRadius={12} cornerSmoothing={0.99} asChild>
              <div className="flex items-center gap-2 px-3 py-1.5 h-full bg-primary text-primary-content border border-primary/20 shadow-sm">
                <Calendar size={13} className="shrink-0" />
                <span className="text-[10px] font-black tracking-tight leading-none uppercase whitespace-nowrap">
                  {hijriDate}
                </span>
              </div>
            </Squircle>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
