export type { AppThemeColors, PineGreenPalette } from "./types";
export { PINE_GREEN_PALETTE } from "./pineGreen";
export { defaultThemeColors } from "./default/colors";
export { darkThemeColors } from "./dark/colors";
export { applyPineGreenPaletteToRoot, pineGreenKeyToCssVar } from "./cssVars";

import type { ThemeId } from "@/shared/config/constants";
import { defaultThemeColors } from "./default/colors";
import { darkThemeColors } from "./dark/colors";
import type { PineGreenPalette } from "./types";

export function getThemeColors(theme: ThemeId): PineGreenPalette {
  return theme === "light" ? defaultThemeColors : darkThemeColors;
}
