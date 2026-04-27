import { useTheme } from "@/app/providers/ThemeProvider";
import { Squircle } from "@/design-system/primitives/Squircle";
import type { ButtonProps } from "./Button.types";

const sizeStyles = {
  sm: {
    padding: "6px 12px",
    fontSize: "sm",
  },
  md: {
    padding: "10px 16px",
    fontSize: "md",
  },
  lg: {
    padding: "14px 20px",
    fontSize: "lg",
  },
} as const;

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  loading = false,
  style,
}: ButtonProps) => {
  const { theme } = useTheme();

  const sizeStyle = sizeStyles[size];

  const variantStyles = {
    primary: {
      background: theme.colors.primary,
      color: theme.colors.primaryText,
    },
    secondary: {
      background: theme.colors.surface,
      color: theme.colors.textPrimary,
    },
    ghost: {
      background: "transparent",
      color: theme.colors.textSecondary,
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <Squircle
      cornerRadius={12}
      cornerSmoothing={0.9}
      style={{
        display: "inline-flex",
        opacity: disabled ? 0.6 : 1,
        transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
        ...style,
      }}
    >
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className="ds-button"
        style={{
          fontFamily: theme.typography.fontFamily.primary,
          fontSize:
            theme.typography.fontSize[
              sizeStyle.fontSize as keyof typeof theme.typography.fontSize
            ],
          fontWeight: theme.typography.fontWeight.medium,
          padding: sizeStyle.padding,
          cursor: disabled ? "not-allowed" : "pointer",
          width: "100%",
          height: "100%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          border: "none",
          outline: "none",
          background: currentVariant.background,
          color: currentVariant.color,
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {loading ? "Loading..." : children}
      </button>
    </Squircle>
  );
};
