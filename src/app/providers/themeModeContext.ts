import type { PaletteMode } from "@mui/material";
import { createContext } from "react";

import type { ThemeModePreference } from "@/shared/hooks/useThemeMode";

export type ThemeModeContextValue = {
  mode: PaletteMode;
  preference: ThemeModePreference;
  setMode: (next: ThemeModePreference) => void;
  toggle: () => void;
};

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

