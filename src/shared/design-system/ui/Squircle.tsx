import React, { type CSSProperties } from "react";
import { Squircle as SquircleElement } from "@squircle-js/react";

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
export const Squircle: React.FC<SquircleProps> = ({
  children,
  cornerRadius = 22,
  cornerSmoothing = 0.8,
  className = "",
  style,
  asChild = false,
}) => {
  if (asChild) {
    return (
      <SquircleElement
        cornerRadius={cornerRadius}
        cornerSmoothing={cornerSmoothing}
        className={className}
        asChild
      >
        {children as React.ReactElement}
      </SquircleElement>
    );
  }

  return (
    <SquircleElement
      cornerRadius={cornerRadius}
      cornerSmoothing={cornerSmoothing}
      asChild={false}
    >
      <div className={className} style={style}>
        {children}
      </div>
    </SquircleElement>
  );
};
