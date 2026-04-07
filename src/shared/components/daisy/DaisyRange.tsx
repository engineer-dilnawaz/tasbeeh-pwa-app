import clsx from "clsx";
import { forwardRef, type InputHTMLAttributes } from "react";

export type DaisyRangeVariant =
  | "default"
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "info"
  | "error";

export type DaisyRangeProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> & {
  rangeSize?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: DaisyRangeVariant;
};

const sizeClass = {
  xs: "range-xs",
  sm: "range-sm",
  md: "range-md",
  lg: "range-lg",
  xl: "range-xl",
} as const;

const variantClass: Record<Exclude<DaisyRangeVariant, "default">, string> = {
  neutral: "range-neutral",
  primary: "range-primary",
  secondary: "range-secondary",
  accent: "range-accent",
  success: "range-success",
  warning: "range-warning",
  info: "range-info",
  error: "range-error",
};

/** daisyUI [range](https://daisyui.com/components/range/) */
export const DaisyRange = forwardRef<HTMLInputElement, DaisyRangeProps>(
  function DaisyRange(
    { className, rangeSize = "md", variant = "primary", ...rest },
    ref,
  ) {
    return (
      <input
        ref={ref}
        type="range"
        className={clsx(
          "range w-full",
          sizeClass[rangeSize],
          variant !== "default" && variantClass[variant],
          className,
        )}
        {...rest}
      />
    );
  },
);
