import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

export type DaisyDividerProps = HTMLAttributes<HTMLDivElement> & {
  horizontal?: boolean;
  children?: ReactNode;
  color?:
    | "default"
    | "neutral"
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "info"
    | "error";
  placement?: "start" | "center" | "end";
};

const colorClass = {
  default: "",
  neutral: "divider-neutral",
  primary: "divider-primary",
  secondary: "divider-secondary",
  accent: "divider-accent",
  success: "divider-success",
  warning: "divider-warning",
  info: "divider-info",
  error: "divider-error",
} as const;

/** daisyUI [divider](https://daisyui.com/components/divider/) */
export function DaisyDivider({
  horizontal,
  color = "default",
  placement = "center",
  className,
  children,
  ...rest
}: DaisyDividerProps) {
  return (
    <div
      role="separator"
      className={clsx(
        "divider",
        horizontal && "divider-horizontal",
        color !== "default" && colorClass[color],
        placement === "start" && "divider-start",
        placement === "end" && "divider-end",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
