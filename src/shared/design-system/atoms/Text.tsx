import React from "react";
import { cn } from "@/shared/utils/cn";

type TextVariant = "heading" | "body" | "caption" | "display";
type TextColor = "main" | "subtle" | "primary" | "inverse";
type TextWeight = "normal" | "medium" | "semibold" | "bold" | "black";

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  color?: TextColor;
  weight?: TextWeight;
  as?: React.ElementType;
}

const variantStyles: Record<TextVariant, string> = {
  display: "block text-display", 
  heading: "block text-heading",
  body: "block text-base leading-relaxed",
  caption: "block text-xs tracking-wide",
};

const colorStyles: Record<TextColor, string> = {
  main: "text-ds-text-main",
  subtle: "text-ds-text-subtle",
  primary: "text-ds-primary",
  inverse: "text-white",
};

const weightStyles: Record<TextWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  black: "font-black",
};

export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      children,
      variant = "body",
      color = "main",
      weight,
      as: Component = "span",
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <Component 
        ref={ref} 
        className={cn(
          variantStyles[variant],
          colorStyles[color],
          weight && weightStyles[weight],
          className
        )} 
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = "Text";
