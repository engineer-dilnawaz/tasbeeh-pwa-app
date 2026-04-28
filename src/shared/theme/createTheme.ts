import type { PaletteMode } from "@mui/material";
import { createTheme } from "@mui/material/styles";

import { THEME_TOKENS } from "./tokens";

export type ThemeMode = PaletteMode;

function getModeTokens(mode: ThemeMode) {
  return mode === "dark" ? THEME_TOKENS.color.dark : THEME_TOKENS.color.light;
}

export function createAppTheme(mode: ThemeMode) {
  const c = getModeTokens(mode);

  return createTheme({
    palette: {
      mode,
      primary: {
        main: THEME_TOKENS.color.brand.primary,
      },
      secondary: {
        main: THEME_TOKENS.color.brand.accent,
      },
      success: {
        main: THEME_TOKENS.color.semantic.success,
      },
      warning: {
        main: THEME_TOKENS.color.semantic.warning,
      },
      error: {
        main: THEME_TOKENS.color.semantic.error,
      },
      info: {
        main: THEME_TOKENS.color.semantic.info,
      },
      background: {
        default: c.background.default,
        paper: c.background.paper,
      },
      text: {
        primary: c.text.primary,
        secondary: c.text.secondary,
      },
      divider: c.divider,
      action: {
        hover: c.action.hover,
        selected: c.action.selected,
        disabledBackground: c.action.disabled,
      },
    },
    typography: {
      fontFamily: THEME_TOKENS.typography.fontFamily.body,
      h1: {
        fontFamily: THEME_TOKENS.typography.fontFamily.display,
        fontWeight: THEME_TOKENS.typography.weight.black,
        letterSpacing: THEME_TOKENS.tasbeeh.counter.letterSpacing,
      },
      h5: {
        fontWeight: THEME_TOKENS.typography.weight.bold,
      },
      button: {
        textTransform: "none",
        fontWeight: THEME_TOKENS.typography.weight.semibold,
      },
    },
    spacing: 4,
    shape: {
      borderRadius: THEME_TOKENS.shape.radius.md,
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: THEME_TOKENS.shape.radius.pill,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: THEME_TOKENS.tasbeeh.card.radius,
          },
        },
      },
    },
    custom: {
      tasbeeh: THEME_TOKENS.tasbeeh,
      surface: c.surface,
    },
  });
}

