import React, { type CSSProperties } from "react";
import { Squircle as SquircleElement } from "@squircle-js/react";
import { cn } from "@/shared/utils/cn";

interface SquircleProps {
  children: React.ReactNode;
  cornerRadius?: number;
  cornerSmoothing?: number;
  className?: string;
  style?: CSSProperties;
  asChild?: boolean;
}

/**
 * Premium Squircle (Smooth Corner) Wrapper.
 * Uses @squircle-js/react to achieve Figma-grade corner smoothing.
 * Supports 'asChild' pattern for semantic elements.
 */
export const Squircle = React.forwardRef<any, SquircleProps>(
  (
    {
      children,
      cornerRadius = 22,
      cornerSmoothing = 0.8,
      className = "",
      style,
      asChild = false,
    },
    ref
  ) => {
    if (asChild) {
      if (!React.isValidElement(children)) return <>{children}</>;
      const child = children as React.ReactElement<any>;

      return (
        <SquircleElement
          cornerRadius={cornerRadius}
          cornerSmoothing={cornerSmoothing}
          asChild
        >
          {React.cloneElement(child, {
            ref,
            className: cn(className, child.props.className),
          })}
        </SquircleElement>
      );
    }

    return (
      <SquircleElement
        cornerRadius={cornerRadius}
        cornerSmoothing={cornerSmoothing}
        asChild={false}
      >
        <div ref={ref} className={cn(className)} style={style}>
          {children}
        </div>
      </SquircleElement>
    );
  }
);

Squircle.displayName = "Squircle";
