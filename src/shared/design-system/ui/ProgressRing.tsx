import React from "react";
import { motion } from "framer-motion";

export interface ProgressRingProps {
  /** Progress from 0 to 100 */
  value: number;
  /** Diameter in pixels */
  size?: number;
  /** Thickness of the ring in pixels */
  strokeWidth?: number;
  /** Primary, Secondary, or Success colors */
  variant?: "primary" | "secondary" | "success";
  /** If true, adds a subtle outer glow */
  glow?: boolean;
  /** Content to display in the center (e.g., current count) */
  children?: React.ReactNode;
  className?: string;
}

const SPRING = { type: "spring", damping: 30, stiffness: 200 } as const;

/**
 * ProgressRing — a high-fidelity visualization for tasbeeh progress.
 */
export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 200,
  strokeWidth = 12,
  variant = "primary",
  glow = true,
  children,
  className = "",
}) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Normalize progress between 0 and 100
  const progress = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (progress / 100) * circumference;

  const colors = {
    primary: "var(--color-primary)",
    secondary: "var(--color-secondary)",
    success: "var(--color-success)",
  };

  const selectedColor = colors[variant];

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`} 
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Background Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="var(--color-base-content)"
          strokeWidth={strokeWidth}
          className="opacity-[0.05]"
        />

        {/* Progress Fill */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={selectedColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={SPRING}
          style={{
            filter: glow ? `drop-shadow(0 0 8px ${selectedColor}44)` : "none",
          }}
        />
      </svg>

      {/* Center content */}
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};
