import clsx from "clsx";
import {
  forwardRef,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";

export type DaisyToggleVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "success"
  | "warning"
  | "info"
  | "error";

export type DaisyToggleProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type" | "size"
> & {
  /** Ignored if `className` sets a `toggle-*` size. */
  toggleSize?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: DaisyToggleVariant;
  onChange?: (next: boolean, event: ChangeEvent<HTMLInputElement>) => void;
};

const sizeClass = {
  xs: "toggle-xs",
  sm: "toggle-sm",
  md: "toggle-md",
  lg: "toggle-lg",
  xl: "toggle-xl",
} as const;

const variantClass: Record<DaisyToggleVariant, string> = {
  primary: "toggle-primary",
  secondary: "toggle-secondary",
  accent: "toggle-accent",
  neutral: "toggle-neutral",
  success: "toggle-success",
  warning: "toggle-warning",
  info: "toggle-info",
  error: "toggle-error",
};

/** daisyUI [toggle](https://daisyui.com/components/toggle/#toggle-switch) */
export const DaisyToggle = forwardRef<HTMLInputElement, DaisyToggleProps>(
  function DaisyToggle(
    { className, toggleSize = "md", variant = "primary", onChange, ...rest },
    ref,
  ) {
    return (
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        className={clsx(
          "toggle shrink-0",
          variantClass[variant],
          sizeClass[toggleSize],
          className,
        )}
        onChange={(e) => onChange?.(e.target.checked, e)}
        {...rest}
      />
    );
  },
);
