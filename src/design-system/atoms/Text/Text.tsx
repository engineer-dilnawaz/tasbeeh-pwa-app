import { useTheme } from "@/app/providers/ThemeProvider";
import type { TextProps } from "./Text.types";

const variantStyles = {
  body: {
    fontSize: "md",
    lineHeight: "normal",
  },
  caption: {
    fontSize: "sm",
    lineHeight: "normal",
  },
  heading: {
    fontSize: "2xl",
    lineHeight: "heading",
  },
  subheading: {
    fontSize: "lg",
    lineHeight: "heading",
  },
} as const;

export const Text = ({
  children,
  variant = "body",
  weight = "regular",
  color = "primary",
  as: Component = "p",
  style,
}: TextProps) => {
  const { theme } = useTheme();

  const variantStyle = variantStyles[variant];

  const colorMap = {
    primary: theme.colors.textPrimary,
    secondary: theme.colors.textSecondary,
    inverse: theme.colors.primaryText,
  };

  return (
    <Component
      style={{
        fontFamily: theme.typography.fontFamily.primary,
        fontSize:
          theme.typography.fontSize[
            variantStyle.fontSize as keyof typeof theme.typography.fontSize
          ],
        fontWeight: theme.typography.fontWeight[weight],
        lineHeight:
          theme.typography.lineHeight[
            variantStyle.lineHeight as keyof typeof theme.typography.lineHeight
          ],
        color: colorMap[color],
        margin: 0,
        ...style,
      }}
    >
      {children}
    </Component>
  );
};
