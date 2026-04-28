import type { PropsWithChildren } from "react";
import { useMemo } from "react";

import { useThemeMode } from "@/shared/hooks";

import { ThemeModeContext } from "./themeModeContext";

export function ThemeModeProvider({ children }: PropsWithChildren) {
  const { mode, preference, setMode, toggle } = useThemeMode();

  const value = useMemo(
    () => ({ mode, preference, setMode, toggle }),
    [mode, preference, setMode, toggle],
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

