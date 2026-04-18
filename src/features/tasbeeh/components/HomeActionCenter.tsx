import React from "react";
import { RotateCcw, ChevronRight, Settings2 } from "lucide-react";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { motion } from "framer-motion";

interface HomeActionCenterProps {
  onReset: () => void;
  onCycle: () => void;
  onComplete: () => void;
  isCompleted: boolean;
}

export const HomeActionCenter: React.FC<HomeActionCenterProps> = ({
  onReset,
  onCycle,
  onComplete,
  isCompleted,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 w-full">
      {/* Secondary: Reset */}
      <Squircle cornerRadius={16} cornerSmoothing={0.99} asChild>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onReset}
          className="w-12 h-12 flex items-center justify-center bg-white border border-[#E8DFD0] text-[#8A8A8A] hover:text-[#2C2C2C] transition-colors"
          aria-label="Reset counter"
        >
          <RotateCcw size={20} />
        </motion.button>
      </Squircle>

      {/* Primary: Switch / Complete */}
      <Squircle cornerRadius={20} cornerSmoothing={0.99} asChild>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={isCompleted ? onComplete : onCycle}
          className={`h-14 px-8 flex items-center justify-center gap-3 font-semibold tracking-tight transition-all shadow-lg ${
            isCompleted 
              ? "bg-[#3DB88A] text-white shadow-[#3DB88A]/20 flex-1" 
              : "bg-[#5B6BF0] text-white shadow-[#5B6BF0]/20 flex-1"
          }`}
        >
          <span className="text-[16px]">
            {isCompleted ? "Complete Round" : "Next Tasbeeh"}
          </span>
          <ChevronRight size={18} />
        </motion.button>
      </Squircle>

      {/* Secondary: Cycle (Optional or Settings) */}
      <Squircle cornerRadius={16} cornerSmoothing={0.99} asChild>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onCycle}
          className="w-12 h-12 flex items-center justify-center bg-white border border-[#E8DFD0] text-[#8A8A8A] hover:text-[#2C2C2C] transition-colors"
          aria-label="Settings"
        >
          <Settings2 size={20} />
        </motion.button>
      </Squircle>
    </div>
  );
};
