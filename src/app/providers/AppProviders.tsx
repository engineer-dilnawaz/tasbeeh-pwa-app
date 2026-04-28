import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { PropsWithChildren } from "react";
import { useMemo } from "react";

import { createAppTheme } from "@/shared/theme";

import { ThemeModeProvider } from "./ThemeModeProvider";
import { useThemeModeContext } from "./useThemeModeContext";

function MuiThemeBridge({ children }: PropsWithChildren) {
  const { mode } = useThemeModeContext();
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeModeProvider>
      <MuiThemeBridge>
        <CssBaseline />
        {children}
      </MuiThemeBridge>
    </ThemeModeProvider>
  );
}

