export type {
  AppThemeColors,
  IThemeColors,
  PaletteScales,
  PineGreenPalette,
} from "./types";
export { pickPineGreenPalette } from "./types";
export { PINE_GREEN_PALETTE } from "./pineGreen";
export { defaultThemeColors } from "./default/colors";
export { darkThemeColors } from "./dark/colors";
export { applyPineGreenPaletteToRoot, pineGreenKeyToCssVar } from "./cssVars";

import type { ThemeId } from "@/shared/config/constants";
import { darkThemeColors } from "./dark/colors";
import { defaultThemeColors } from "./default/colors";
import type { IThemeColors } from "./types";

export function getThemeColors(theme: ThemeId): IThemeColors {
  return theme === "light" ? defaultThemeColors : darkThemeColors;
}
