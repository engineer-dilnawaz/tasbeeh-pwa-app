import React from "react";
import { motion } from "framer-motion";

type IndicatorVariant = "pulse" | "dot" | "badge";
type IndicatorColor = "success" | "error" | "warning" | "primary" | "neutral";
type IndicatorSize = "sm" | "md" | "lg";

interface IndicatorProps {
  variant?: IndicatorVariant;
  color?: IndicatorColor;
  size?: IndicatorSize;
  count?: number;
  maxCount?: number;
  children?: React.ReactNode;
  className?: string;
}

const colorMap: Record<IndicatorColor, string> = {
  success: "bg-success",
  error: "bg-error",
  warning: "bg-warning",
  primary: "bg-primary",
  neutral: "bg-base-content/40",
};

const ringColorMap: Record<IndicatorColor, string> = {
  success: "bg-success/30",
  error: "bg-error/30",
  warning: "bg-warning/30",
  primary: "bg-primary/30",
  neutral: "bg-base-content/15",
};

const sizeMap: Record<IndicatorSize, number> = {
  sm: 6,
  md: 10,
  lg: 14,
};

/**
 * Premium Indicator Primitive.
 * Three variants: pulse (live/active), dot (status), badge (count overlay).
 */
export const Indicator: React.FC<IndicatorProps> = ({
  variant = "dot",
  color = "success",
  size = "md",
  count,
  maxCount = 99,
  children,
  className = "",
}) => {
  const dim = sizeMap[size];

  // ── Dot ──────────────────────────────────────────────────────────────────
  if (variant === "dot") {
    return (
      <div
        className={`rounded-full shrink-0 ${colorMap[color]} ${className}`}
        style={{ width: dim, height: dim }}
      />
    );
  }

  // ── Pulse ─────────────────────────────────────────────────────────────────
  if (variant === "pulse") {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${className}`} style={{ width: dim * 2.8, height: dim * 2.8 }}>
        {/* Outer ring pulse */}
        <motion.div
          className={`absolute rounded-full ${ringColorMap[color]}`}
          style={{ width: dim * 2.8, height: dim * 2.8 }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Middle ring */}
        <motion.div
          className={`absolute rounded-full ${ringColorMap[color]}`}
          style={{ width: dim * 1.8, height: dim * 1.8 }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        {/* Core dot */}
        <div
          className={`relative rounded-full z-10 ${colorMap[color]}`}
          style={{ width: dim, height: dim }}
        />
      </div>
    );
  }

  // ── Badge ─────────────────────────────────────────────────────────────────
  if (variant === "badge") {
    const displayCount = count !== undefined && count > maxCount ? `${maxCount}+` : count;
    const badgeDim = dim * 2;

    return (
      <div className={`relative w-fit h-fit ${className}`}>
        {children}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={`absolute -top-1 -right-1 flex items-center justify-center rounded-full text-white font-bold ring-2 ring-base-100 ${colorMap[color]}`}
          style={{
            minWidth: badgeDim,
            height: badgeDim,
            fontSize: badgeDim * 0.5,
            padding: count !== undefined ? `0 ${badgeDim * 0.3}px` : 0,
          }}
        >
          {displayCount}
        </motion.div>
      </div>
    );
  }

  return null;
};
