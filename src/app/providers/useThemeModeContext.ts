import { useContext } from "react";

import { ThemeModeContext } from "./themeModeContext";

export function useThemeModeContext() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error("useThemeModeContext must be used within ThemeModeProvider");
  return ctx;
}

