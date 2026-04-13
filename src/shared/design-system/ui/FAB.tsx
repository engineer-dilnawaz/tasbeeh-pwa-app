import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Squircle } from "./Squircle";

export interface FABProps extends Omit<HTMLMotionProps<"button">, "children"> {
  /** The icon to display */
  icon: React.ReactNode;
  /** Optional label for an "Extended FAB" */
  label?: string;
  /** Visual style variant */
  variant?: "primary" | "secondary" | "surface";
  /** Shape of the button */
  shape?: "circle" | "squircle";
  /** Size of the button */
  size?: "md" | "lg";
}

const SPRING = { type: "spring", damping: 25, stiffness: 400 } as const;

/**
 * FAB — Floating Action Button
 * 
 * A premium, interactive action button supporting glows, 
 * squircles, and expanding labels.
 */
export const FAB: React.FC<FABProps> = ({
  icon,
  label,
  variant = "primary",
  shape = "circle",
  size = "md",
  className = "",
  ...props
}) => {
  const isExtended = !!label;
  
  // Base classes based on variant
  const variantClasses = {
    primary: "bg-primary text-primary-content shadow-lg shadow-primary/30",
    secondary: "bg-secondary text-secondary-content shadow-lg shadow-secondary/30",
    surface: "bg-base-100/90 backdrop-blur-xl border border-base-content/10 text-base-content shadow-lg",
  };

  const sizeClasses = {
    md: isExtended ? "h-12 px-4 gap-2" : "w-12 h-12",
    lg: isExtended ? "h-14 px-6 gap-3" : "w-14 h-14",
  };

  const content = (
    <motion.button
      whileTap={{ scale: 0.94 }}
      transition={SPRING}
      className={`
        flex items-center justify-center
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${shape === "circle" ? "rounded-full" : ""}
        ${className}
      `}
      {...props}
    >
      <motion.span 
        layout
        className="flex items-center justify-center shrink-0"
      >
        {icon}
      </motion.span>
      {isExtended && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          className="overflow-hidden whitespace-nowrap font-semibold text-sm tracking-tight"
        >
          {label}
        </motion.span>
      )}
    </motion.button>
  );

  if (shape === "squircle" && !isExtended) {
    const radius = size === "lg" ? 22 : 18;
    return (
      <Squircle cornerRadius={radius} cornerSmoothing={1}>
        {content}
      </Squircle>
    );
  }

  return content;
};
