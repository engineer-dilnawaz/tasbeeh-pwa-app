import { Squircle as SquircleBase } from "@squircle-js/react";
import type { SquircleProps } from "./Squircle.types";

/**
 * Squircle Primitive
 * 
 * A pure visual container that enforces organic squircle geometry.
 * Responsibility: Geometry & Clipping.
 */
export const Squircle = ({
  children,
  cornerRadius = 12,
  cornerSmoothing = 0.9,
  style,
  as, // Ignored to comply with library native API
  ...props
}: SquircleProps) => {
  return (
    <SquircleBase
      cornerRadius={cornerRadius}
      cornerSmoothing={cornerSmoothing}
      style={{
        display: "block",
        position: "relative",
        borderRadius: 0,
        ...style,
      }}
      {...props}
    >
      {children}
    </SquircleBase>
  );
};
