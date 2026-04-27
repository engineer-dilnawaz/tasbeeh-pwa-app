import { useTheme } from "@/app/providers/ThemeProvider";
import { Squircle } from "@/design-system/primitives/Squircle";
import type { CardProps } from "./Card.types";

const paddingMap = {
  sm: "8px",
  md: "16px",
  lg: "24px",
};

export const Card = ({
  children,
  padding = "md",
  onClick,
  style,
}: CardProps) => {
  const { theme } = useTheme();

  return (
    <Squircle
      cornerRadius={20}
      cornerSmoothing={1}
      onClick={onClick}
      style={{
        background: theme.colors.surface,
        padding: paddingMap[padding],
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        display: "block",
        ...style,
      }}
    >
      {children}
    </Squircle>
  );
};
