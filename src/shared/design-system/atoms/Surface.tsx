import React from "react";
import { Squircle } from "../ui/Squircle";
import { cn } from "@/shared/utils/cn";

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  cornerRadius?: number;
  cornerSmoothing?: number;
  asChild?: boolean;
}

/**
 * Surface — The foundational atom of the Divine Atomic System.
 *
 * Features:
 * 1. Squircle shaping with customizable corners.
 * 2. Integrated 'Solid Base' (bg-ds-bg-page) to block background particles.
 * 3. Semantic 'bg-ds-bg-surface' background.
 * 4. Support for 'asChild' to render as different elements (buttons, links).
 */
export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  (
    {
      children,
      className = "",
      cornerRadius = 22,
      cornerSmoothing = 0.6,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    return (
      <Squircle
        ref={ref}
        asChild={asChild}
        cornerRadius={cornerRadius}
        cornerSmoothing={cornerSmoothing}
        className={cn(
          "bg-ds-bg-surface",
          className
        )}
        {...props}
      >
        {children}
      </Squircle>
    );
  },
);

Surface.displayName = "Surface";
