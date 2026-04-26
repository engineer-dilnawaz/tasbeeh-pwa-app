import React from "react";
import { Squircle } from "../ui/Squircle";
import { cn } from "@/shared/utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  circle?: boolean;
  cornerRadius?: number;
}

/**
 * Skeleton — A pulsing placeholder for loading states.
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    { 
      width, 
      height, 
      rounded = true, 
      circle = false, 
      cornerRadius = 12, 
      className, 
      style, 
      ...props 
    }, 
    ref
  ) => {
    const baseClasses = cn("animate-pulse bg-ds-text-main/5", className);
    const finalStyle = {
      width: width ?? "100%",
      height: height ?? "1rem",
      ...style,
    };

    if (circle) {
      return (
        <div
          ref={ref}
          className={cn(baseClasses, "rounded-full")}
          style={finalStyle}
          {...props}
        />
      );
    }

    if (rounded) {
      return (
        <Squircle
          ref={ref}
          cornerRadius={cornerRadius}
          className={baseClasses}
          style={finalStyle}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={baseClasses}
        style={finalStyle}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";
