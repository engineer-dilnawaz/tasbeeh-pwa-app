import React from "react";
import { Surface } from "./Surface";
import { Text } from "./Text";
import { cn } from "@/shared/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-ds-primary text-white hover:opacity-90",
  secondary: "bg-ds-bg-surface text-ds-text-main shadow-sm hover:bg-ds-bg-page",
  ghost: "bg-transparent text-ds-text-main hover:bg-ds-bg-surface",
  outline: "bg-ds-text-main/5 text-ds-text-main hover:bg-ds-text-main/10",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 px-4 py-2 text-sm",
  md: "h-12 px-6 py-3 text-base",
  lg: "h-14 px-8 py-4 text-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <Surface
        asChild
        cornerRadius={size === "sm" ? 14 : 18}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.98]",
          variantStyles[variant],
          sizeStyles[size],
          (disabled || isLoading) && "opacity-50 cursor-not-allowed grayscale pointer-events-none",
          !disabled && !isLoading && "cursor-pointer",
          className
        )}
      >
        <button ref={ref} disabled={disabled || isLoading} {...props}>
          <div className={cn("flex items-center justify-center gap-2", isLoading && "invisible")}>
            {leftIcon && <span className="flex items-center">{leftIcon}</span>}
            <Text 
              color={variant === "primary" ? "inverse" : "main"} 
              weight="bold"
              className="relative z-10"
            >
              {children}
            </Text>
            {rightIcon && <span className="flex items-center">{rightIcon}</span>}
          </div>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            </div>
          )}
        </button>
      </Surface>
    );
  }
);

Button.displayName = "Button";
