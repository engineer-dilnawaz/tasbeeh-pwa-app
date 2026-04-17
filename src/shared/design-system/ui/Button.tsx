import React from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { Squircle } from "@squircle-js/react";
import { TOKENS } from "../tokens";

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
  ...props
}) => {
  const isSocial = variant === "google" || variant === "apple";

  // Use DaisyUI 'loading' class if isLoading is true
  const baseClasses = isSocial
    ? `relative flex items-center justify-center gap-3 font-semibold transition-all w-full h-full border-none ${variantClasses[variant]}`
    : `btn relative animate-none font-semibold border-none w-full h-full ${variantClasses[variant]}`;

  const classes = [
    baseClasses,
    "disabled:cursor-not-allowed",
    isLoading ? "" : "disabled:opacity-50",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full sm:w-auto h-fit">
      <Squircle
        asChild
        cornerRadius={16}
        cornerSmoothing={0.8}
        height={sizeHeights[size]}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          transition={TOKENS.motion.spring}
          className={classes}
          disabled={isLoading || props.disabled}
          {...props}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-content/5 backdrop-blur-[1px]">
              <span className="loading loading-spinner h-5 w-5 text-current" />
            </div>
          )}

          <div
            className={`flex items-center justify-center gap-2 ${isLoading ? "opacity-0" : "opacity-100"}`}
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
