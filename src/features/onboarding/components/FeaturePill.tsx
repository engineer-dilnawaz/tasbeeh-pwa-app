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
        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-base-200/80 border border-base-content/5"
      >
        <span className="text-sm">{icon}</span>
        <span 
          className="text-[11px] font-black uppercase tracking-widest"
          style={{ color: color.includes('#') ? 'var(--color-primary)' : color }}
        >
          {label}
        </span>
      </Squircle>
    </motion.div>
  );
};
