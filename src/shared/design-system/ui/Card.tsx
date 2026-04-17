import React from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { TOKENS } from "../tokens";

type CardVariant = "elevated" | "outlined" | "ghost" | "filled" | "glass";
type CardPadding = "none" | "sm" | "md" | "lg";
type CardRadius = "sm" | "md" | "lg" | "xl";

interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  variant?: CardVariant;
  padding?: CardPadding;
  radius?: CardRadius;
  pressable?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const paddingStyle: Record<CardPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

// Corner radius that scales intentionally — these are card-appropriate, not button-tight
const radiusMap: Record<CardRadius, number> = {
  sm: 14,
  md: 20,
  lg: 26,
  xl: 32,
};

const variantStyle: Record<CardVariant, string> = {
  elevated: "bg-base-100 shadow-xl shadow-base-content/5",
  outlined: "bg-base-100 border border-base-content/10",
  ghost:    "bg-base-content/5",
  filled:   "bg-base-200",
  glass:    "bg-base-100/40 backdrop-blur-md border border-white/10 shadow-sm",
};

/**
 * Card — Squircle-inspired container.
 *
 * Uses border-radius + overflow-hidden (not clip-path) so that box-shadow
 * is preserved on elevated variants. clip-path would clip the shadow too.
 *
 * Pressable triggers a subtle Framer Motion scale tap — safe for both
 * interactive cards and static containers.
 */
export const Card: React.FC<CardProps> = ({
  variant = "elevated",
  padding = "md",
  radius = "md",
  pressable = false,
  children,
  className = "",
  onClick,
  ...rest
}) => {
  const cornerRadius = radiusMap[radius];
  const { style, ...restProps } = rest;

  return (
    <motion.div
      whileTap={pressable ? { scale: 0.985 } : undefined}
      transition={TOKENS.motion.spring}
      onClick={onClick}
      className={[
        "w-full",
        variantStyle[variant],
        paddingStyle[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        borderRadius: cornerRadius,
        overflow: "hidden",
        cursor: pressable ? "pointer" : undefined,
        ...(style ?? {}),
      }}
      {...restProps}
    >
      {children}
    </motion.div>
  );
};
