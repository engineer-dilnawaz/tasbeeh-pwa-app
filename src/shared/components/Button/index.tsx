import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./Button.module.css";
import { Squircle } from "@/shared/components/Squircle";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "glass";
  shape?: "pill" | "squircle";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  shape = "pill",
  leftIcon,
  rightIcon,
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseClass = styles.btn;
  const variantClass = styles[`btn--${variant}`];
  const shapeClass = styles[`btn--${shape}`];
  const widthClass = fullWidth ? styles["btn--full-width"] : "";
  const disabledClass = isDisabled || isLoading ? styles["btn--disabled"] : "";
  const iconOnlyClass = !children && (leftIcon || rightIcon) ? styles["btn--icon-only"] : "";

  const rootClass = [
    baseClass,
    variantClass,
    shapeClass,
    widthClass,
    disabledClass,
    iconOnlyClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const ButtonContent = isLoading ? (
    <Loader2 className={styles.spinner} size={18} />
  ) : (
    <>
      {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
      {children && <span className={styles.text}>{children}</span>}
      {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
    </>
  );

  const motionProps = {
    disabled: isDisabled || isLoading,
    initial: { scale: 1 },
    whileHover: { scale: isDisabled || isLoading ? 1 : 1.02 },
    whileTap: { scale: isDisabled || isLoading ? 1 : 0.96 },
    transition: { type: "spring", stiffness: 400, damping: 25 },
  } as const;

  if (shape === "squircle") {
    return (
      <Squircle
        as={motion.button}
        radius={22}
        className={rootClass}
        {...motionProps}
        {...props}
      >
        {ButtonContent}
      </Squircle>
    );
  }

  return (
    <motion.button
      className={rootClass}
      {...motionProps}
      {...props}
    >
      {ButtonContent}
    </motion.button>
  );
}
