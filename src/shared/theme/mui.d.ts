import type { THEME_TOKENS } from "./tokens";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      surface: {
        level0: string;
        level1: string;
        level2: string;
      };
      tasbeeh: {
        counter: {
          fontFamily: keyof typeof THEME_TOKENS.typography.fontFamily;
          size: {
            sm: number;
            md: number;
            lg: number;
          };
          lineHeight: number;
          fontWeight: number;
          letterSpacing: string;
        };
        card: {
          radius: number;
          padding: number;
        };
      };
    };
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    custom?: Theme["custom"];
  }
}

