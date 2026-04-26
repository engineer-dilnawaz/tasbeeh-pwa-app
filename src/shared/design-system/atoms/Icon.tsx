import React from "react";
import { cn } from "@/shared/utils/cn";

type IconSize = "xs" | "sm" | "md" | "lg" | "xl";
type IconColor = "main" | "subtle" | "primary" | "error" | "white";

interface IconProps {
  icon: React.ElementType;
  size?: IconSize;
  color?: IconColor;
  className?: string;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
}

const sizeMap: Record<IconSize, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
};

const colorStyles: Record<IconColor, string> = {
  main: "text-ds-text-main",
  subtle: "text-ds-text-subtle",
  primary: "text-ds-primary",
  error: "text-red-500",
  white: "text-white",
};

export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = "md",
  color = "main",
  className = "",
  weight = "regular",
}) => {
  return (
    <IconComponent
      size={sizeMap[size]}
      weight={weight}
      className={cn(colorStyles[color], className)}
    />
  );
};
