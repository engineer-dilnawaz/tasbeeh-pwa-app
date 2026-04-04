import React from "react";
import { Squircle as NativeSquircle } from "@squircle-js/react";

export type SquircleProps = {
  radius?: number;
  smoothing?: number;
  children?: React.ReactNode;
  as?: React.ElementType | any;
  className?: string;
  style?: React.CSSProperties | any;
  [key: string]: any;
};

export const Squircle = React.forwardRef<HTMLElement, SquircleProps>(({
  radius = 24,
  smoothing = 1, // 100% Figma corner smoothing
  as,
  children,
  ...props
}, ref) => {
  if (as) {
    const Component = as;
    return (
      <NativeSquircle cornerRadius={radius} cornerSmoothing={smoothing} asChild>
        <Component ref={ref} {...props}>
          {children}
        </Component>
      </NativeSquircle>
    );
  }

  return (
    <NativeSquircle cornerRadius={radius} cornerSmoothing={smoothing} asChild>
      <div ref={ref as any} {...props}>
        {children}
      </div>
    </NativeSquircle>
  );
});

Squircle.displayName = "Squircle";
