import React from "react";
import { motion } from "framer-motion";
import { Squircle } from "corner-smoothing";

interface FeaturePillProps {
  icon: string;
  label: string;
  color: string;
  delay?: number;
}

export const FeaturePill: React.FC<FeaturePillProps> = ({ icon, label, color, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
    >
      <Squircle
        cornerRadius={12}
        cornerSmoothing={0.6}
        className="flex items-center gap-1.5 px-4 py-2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
      >
        <span className="text-sm">{icon}</span>
        <span 
          className="text-[12px] font-bold tracking-tight"
          style={{ color }}
        >
          {label}
        </span>
      </Squircle>
    </motion.div>
  );
};
