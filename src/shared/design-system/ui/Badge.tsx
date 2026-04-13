import React from "react";
import { motion } from "framer-motion";
import { Squircle } from "corner-smoothing";
import { TOKENS } from "../tokens";

type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "neutral";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  error: "bg-error/10 text-error",
  neutral: "bg-base-content/10 text-base-content",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

const sizeHeights: Record<BadgeSize, number> = {
  sm: 18,
  md: 24,
};

/**
 * Premium Badge Primitive.
 * Features Squircle geometry and soft semantic coloring.
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={TOKENS.motion.spring}
      className="w-fit overflow-hidden"
    >
      <Squircle
        cornerRadius={8}
        cornerSmoothing={0.8}
        height={sizeHeights[size]}
        className={`flex items-center justify-center font-bold tracking-wide uppercase ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      >
        {children}
      </Squircle>
    </motion.div>
  );
};
