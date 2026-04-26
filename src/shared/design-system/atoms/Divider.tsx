import React from "react";
import { cn } from "@/shared/utils/cn";

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  thickness?: number;
}

/**
 * Divider — A semantic separator that adheres to the 'No Border' philosophy.
 * It uses a subtle background color and explicit height/width instead of border properties.
 */
export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = "horizontal", thickness = 1, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          "bg-ds-text-main/5 shrink-0",
          orientation === "horizontal" ? "w-full" : "h-full",
          className
        )}
        style={{
          [orientation === "horizontal" ? "height" : "width"]: `${thickness}px`,
          ...props.style,
        }}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";
