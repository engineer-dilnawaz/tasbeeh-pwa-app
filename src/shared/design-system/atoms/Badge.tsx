import React from "react";
import { Surface } from "./Surface";
import { Text } from "./Text";
import { cn } from "@/shared/utils/cn";

type BadgeVariant = "primary" | "secondary" | "success" | "error" | "warning";
type BadgeSize = "sm" | "md";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-ds-primary/10 text-ds-primary",
  secondary: "bg-ds-text-main/5 text-ds-text-main",
  success: "bg-green-500/10 text-green-600",
  error: "bg-red-500/10 text-red-600",
  warning: "bg-amber-500/10 text-amber-600",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-[12px]",
};

/**
 * Badge — A compact information tag.
 */
export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = "secondary", size = "md", className, children, ...props }, ref) => {
    return (
      <Surface
        ref={ref}
        cornerRadius={6}
        className={cn(
          "inline-flex items-center justify-center font-bold tracking-wider uppercase",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        <Text variant="caption" color="inherit" weight="black" className="block text-inherit">
          {children}
        </Text>
      </Surface>
    );
  }
);

Badge.displayName = "Badge";
