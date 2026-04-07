import clsx from "clsx";
import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { UiPalette } from "./palette";

export type UiButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "icon";
export type UiButtonSize = "sm" | "md" | "lg";

export type UiButtonProps = {
  label?: string;
  icon?: ReactNode;
  variant?: UiButtonVariant;
  size?: UiButtonSize;
  loading?: boolean;
  disabled?: boolean;
  /** @deprecated Theme colors come from daisyUI; ignored. */
  palette?: UiPalette;
  onClick?: () => void;
  fullWidth?: boolean;
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

const variantClass: Record<UiButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger: "btn-error",
  icon: "btn-square btn-ghost",
};

const sizeClass: Record<UiButtonSize, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

/** daisyUI [button](https://daisyui.com/components/button/) */
export function UiButton({
  label,
  icon,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  palette: _palette,
  onClick,
  fullWidth,
  className,
  type = "button",
}: UiButtonProps) {
  void _palette;
  return (
    <motion.button
      type={type}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      className={clsx(
        "btn",
        variantClass[variant],
        sizeClass[size],
        fullWidth && variant !== "icon" && "btn-block",
        (disabled || loading) && "btn-disabled",
        className,
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <span className="loading loading-spinner" />
      ) : (
        icon != null && <span className="inline-flex [&>svg]:size-[1.2em]">{icon}</span>
      )}
      {!loading && label}
    </motion.button>
  );
}
