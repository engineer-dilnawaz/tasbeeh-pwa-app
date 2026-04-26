import { TypingText } from "@/shared/components/TypingText";
import React from "react";
import { cn } from "../../utils/cn";

interface LoadingProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  fullScreen?: boolean;
  color?:
    | "primary"
    | "secondary"
    | "accent"
    | "neutral"
    | "info"
    | "success"
    | "warning"
    | "error";
}

/**
 * A beautiful, themed loading component using DaisyUI's infinity animation.
 */
export const Loading: React.FC<LoadingProps> = ({
  size = "md",
  className,
  fullScreen = false,
  color = "primary",
}) => {
  const sizeClasses = {
    xs: "loading-xs",
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
  };

  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    neutral: "text-neutral",
    info: "text-info",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
  };

  const loader = (
    <span
      className={cn(
        "loading loading-infinity",
        sizeClasses[size],
        colorClasses[color],
        className,
      )}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-base-100/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="flex flex-col items-center gap-1">
          <span className={cn("loading loading-infinity w-24 text-primary")} />
          <TypingText
            text="LOADING"
            className="text-primary text-[10px] font-medium tracking-[0.2em]"
            typingSpeed={150}
          />
        </div>
      </div>
    );
  }

  return loader;
};
