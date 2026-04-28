export const THEME_TOKENS = {
  color: {
    brand: {
      primary: "#4F46E5",
      accent: "#22C55E",
    },
    light: {
      background: {
        // App background (level 0) should not match surfaces (paper).
        default: "#F6EDDD",
        paper: "#FFFFFF",
      },
      surface: {
        level0: "#F6EDDD",
        level1: "#FFFFFF",
        // Subtle raised sections without shadows/borders.
        level2: "#F3F3F3",
      },
      text: {
        primary: "#0F172A",
        secondary: "#334155",
      },
      divider: "#E2E8F0",
      action: {
        hover: "#F1F5F9",
        selected: "#E2E8F0",
        disabled: "#E2E8F0",
      },
    },
    dark: {
      background: {
        default: "#0B1220",
        paper: "#0F172A",
      },
      surface: {
        level0: "#0B1220",
        level1: "#0F172A",
        // Slight contrast step for nested surfaces.
        level2: "#111C33",
      },
      text: {
        primary: "#E2E8F0",
        secondary: "#94A3B8",
      },
      divider: "#24324A",
      action: {
        hover: "#111C33",
        selected: "#16213A",
        disabled: "#16213A",
      },
    },
    semantic: {
      success: "#16A34A",
      warning: "#D97706",
      error: "#DC2626",
      info: "#0284C7",
    },
  },
  typography: {
    fontFamily: {
      body: [
        "Roboto",
        "Inter",
        "system-ui",
        "-apple-system",
        "Segoe UI",
        "sans-serif",
      ].join(","),
      display: ["Outfit", "Roboto", "system-ui", "sans-serif"].join(","),
      arabic: ["Amiri", "serif"].join(","),
      urdu: ["Noto Nastaliq Urdu", "serif"].join(","),
      mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"].join(","),
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },
  },
  shape: {
    radius: {
      xs: 10,
      sm: 14,
      md: 18,
      lg: 24,
      xl: 28,
      pill: 999,
    },
  },
  tasbeeh: {
    counter: {
      fontFamily: "display" as const,
      size: {
        sm: 48,
        md: 72,
        lg: 92,
      },
      lineHeight: 1,
      fontWeight: 900,
      letterSpacing: "-0.04em",
    },
    card: {
      radius: 28,
      padding: 16,
    },
  },
} as const;

