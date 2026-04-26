import React from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { Squircle } from "@squircle-js/react";
import { TOKENS } from "../tokens";
import { Loading } from "./Loading";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "google"
  | "apple"
  | "error"
  | "warning";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<
  HTMLMotionProps<"button">,
  "ref" | "children"
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  height?: number;
  pill?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary text-primary-content",
  secondary: "btn-secondary text-secondary-content",
  ghost: "btn-ghost bg-base-content/5 hover:bg-base-content/10 border-none",
  outline:
    "btn-outline bg-base-content/5 hover:bg-base-content/10 border-2 border-primary/20",
  google:
    "bg-base-content/5 text-base-content border border-base-content/10 hover:bg-base-content/10",
  apple: "bg-base-content/10 text-base-content hover:bg-base-content/20",
  error: "bg-error/10 text-error hover:bg-error/20",
  warning: "bg-warning/10 text-warning hover:bg-warning/20",
};

const sizeHeights: Record<ButtonSize, number> = {
  sm: 36,
  md: 48,
  lg: 56,
};

/**
 * Premium Button Primitive.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  isLoading,
  className = "",
  height,
  pill,
  ...props
}) => {
  const isSocial = variant === "google" || variant === "apple";
  const needsSolidBase =
    variant === "ghost" ||
    variant === "outline" ||
    variant === "google" ||
    variant === "apple";

  // Use DaisyUI 'loading' class if isLoading is true
  const baseClasses = isSocial
    ? `relative flex items-center justify-center gap-3 font-semibold transition-all w-full h-full border-none ${variantClasses[variant]}`
    : `btn relative animate-none font-semibold border-none w-full h-full ${variantClasses[variant]}`;

  const buttonHeight = height || sizeHeights[size];
  const radius = pill ? 999 : 16;
  const smoothing = pill ? 0 : 0.99;

  // Separate layout classes from component classes if needed, 
  // but for now applying to wrapper is more robust for layout.
  const wrapperClasses = `relative z-10 ${className}`;

  return (
    <div 
      className={wrapperClasses} 
      style={{ height: buttonHeight }}
    >
      {needsSolidBase && (
        <div className="absolute inset-0 z-0">
          <Squircle
            cornerRadius={radius}
            cornerSmoothing={smoothing}
            height={buttonHeight}
            className="bg-base-100 opacity-100 w-full h-full"
          />
        </div>
      )}
      <Squircle
        asChild
        cornerRadius={radius}
        cornerSmoothing={smoothing}
        height={buttonHeight}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          transition={TOKENS.motion.spring}
          className={`${baseClasses} ${isLoading ? "" : "disabled:opacity-50"} disabled:cursor-not-allowed relative z-10 w-full h-full p-0 flex items-center justify-center overflow-hidden ${needsSolidBase ? "bg-base-100" : ""}`}
          disabled={isLoading || props.disabled}
          {...props}
        >
          {/* Subtle overlay to match variant aesthetic while remaining opaque - only for social/ghost/outline */}
          {needsSolidBase && (
            <div className="absolute inset-0 z-0 bg-base-content/5 pointer-events-none" />
          )}
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-content/5 backdrop-blur-[1px] z-20">
              <Loading size="md" className="text-current" />
            </div>
          )}

          <div
            className={`flex items-center justify-center gap-2 relative z-10 w-full h-full ${isLoading ? "opacity-0" : "opacity-100"}`}
          >
            {leftIcon && <span className="flex items-center">{leftIcon}</span>}
            {children}
            {rightIcon && (
              <span className="flex items-center">{rightIcon}</span>
            )}
          </div>
        </motion.button>
      </Squircle>
    </div>
  );
};
