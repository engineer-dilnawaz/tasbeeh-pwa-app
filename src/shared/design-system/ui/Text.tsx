import React from "react";

type TextVariant =
  | "display-arabic"
  | "display-urdu"
  | "heading"
  | "body"
  | "counter"
  | "caption";
type TextWeight = "normal" | "medium" | "semibold" | "bold" | "black";
type TextColor = "base" | "muted" | "subtle" | "primary" | "accent" | "error";
type TextLeading = "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";

export interface TextProps extends Omit<React.HTMLAttributes<HTMLElement>, "color" | "dir"> {
  children?: React.ReactNode;
  variant?: TextVariant;
  as?: React.ElementType;
  weight?: TextWeight;
  color?: TextColor;
  leading?: TextLeading;
  className?: string;
  dir?: "ltr" | "rtl";
}

const weightMap: Record<TextWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  black: "font-black",
};

const leadingMap: Record<TextLeading, string> = {
  none: "leading-none",
  tight: "leading-tight",
  snug: "leading-snug",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
};

const colorMap: Record<TextColor, string> = {
  base: "text-base-content",
  muted: "text-base-content/85",
  subtle: "text-base-content/60",
  primary: "text-primary",
  accent: "text-accent",
  error: "text-error",
};

const variantMap: Record<TextVariant, string> = {
  "display-arabic": "text-display-arabic",
  "display-urdu": "text-display-urdu",
  "heading": "text-heading text-lg md:text-xl",
  "body": "text-body text-sm md:text-base",
  "counter": "text-counter",
  "caption": "text-xs opacity-70 tracking-wider uppercase font-medium",
};

/**
 * Typography primitive.
 */
export const Text = React.forwardRef<HTMLElement, TextProps>(({
  children,
  variant = "body",
  as: Component = "p",
  weight,
  color = "base",
  leading,
  className = "",
  dir,
  ...rest
}, ref) => {
  // Auto-detection based on variant if not explicitly provided
  const resolvedDir =
    dir ||
    (variant === "display-arabic" || variant === "display-urdu"
      ? "rtl"
      : "ltr");

  const classes = [
    variantMap[variant],
    weight ? weightMap[weight] : "",
    leading ? leadingMap[leading] : "",
    colorMap[color],
    className,
  ].filter(Boolean).join(" ");

  return (
    <Component ref={ref} className={classes} dir={resolvedDir} {...rest}>
      {children}
    </Component>
  );
});

Text.displayName = "Text";
