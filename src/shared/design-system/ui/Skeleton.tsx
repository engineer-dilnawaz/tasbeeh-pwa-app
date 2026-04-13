import React from "react";

export type SkeletonVariant = "circular" | "rectangular" | "text" | "card";

export interface SkeletonProps {
  /** Optional override classes to style dimensions, margin, etc. */
  className?: string;
  /** Pre-defined shape configurations */
  variant?: SkeletonVariant;
  /** Explicit width (e.g. 40, "100%", "5rem") */
  width?: string | number;
  /** Explicit height */
  height?: string | number;
  /** Disable the shimmer animation to save CPU power */
  animated?: boolean;
}

/**
 * Skeleton Primitive.
 * Used to mask UI latency and provide a premium "shimmer" loading state while
 * Firebase or React Query resolves remote queries.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "text",
  width,
  height,
  animated = true,
}) => {
  // Utilizing DaisyUI's native `.skeleton` class for true sliding shimmer.
  // We forcefully override its default background-color with `!bg-base-content` opacities
  // to ensure massive visual contrast across both light, dark, and pineGreen themes.
  const baseClasses = animated 
    ? "skeleton w-full border-none !bg-base-content/10 dark:!bg-base-content/15" 
    : "bg-base-content/10";

  // Default dimensions mapped strictly to UI conventions
  let defaultWidth: string | number | undefined;
  let defaultHeight: string | number | undefined;
  let radiusClass = "";

  switch (variant) {
    case "text":
      defaultWidth = "100%";
      defaultHeight = "1.25rem";
      radiusClass = "rounded-lg";
      break;
    case "circular":
      defaultWidth = "3rem";
      defaultHeight = "3rem";
      radiusClass = "rounded-full";
      break;
    case "rectangular":
      defaultWidth = "100%";
      defaultHeight = "auto";
      radiusClass = "rounded-xl";
      break;
    case "card":
      defaultWidth = "100%";
      defaultHeight = "8rem";
      radiusClass = "rounded-[24px]"; // Squircle approximation
      break;
  }

  return (
    <div
      className={`${baseClasses} ${radiusClass} ${className}`}
      style={{
        width: width ?? defaultWidth,
        height: height ?? defaultHeight,
      }}
    />
  );
};
