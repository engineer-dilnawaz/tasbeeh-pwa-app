/**
 * Base palette (raw colors — never used directly in UI)
 */
export const palette = {
  primary: {
    50: "#f2f7f5",
    100: "#d6ebe3",
    200: "#add7c7",
    300: "#84c3ab",
    400: "#5baf8f",
    500: "#2e7d32", // main
    600: "#256628",
    700: "#1b4f1e",
    800: "#123814",
    900: "#09210a",
  },

  neutral: {
    0: "#ffffff",
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2933",
    900: "#111827",
  },

  accent: {
    500: "#c49b63", // warm spiritual tone
  },

  error: {
    500: "#dc2626",
  },

  success: {
    500: "#16a34a",
  },
};

/**
 * Semantic Colors (Map to DAS CSS Tokens)
 */
export const lightColors = {
  background: "#F6EDDD",
  surface: palette.neutral[0],

  textPrimary: palette.neutral[900],
  textSecondary: palette.neutral[600],

  primary: palette.primary[500],
  primaryText: "#ffffff",

  border: palette.neutral[200],

  error: palette.error[500],
  success: palette.success[500],
};
