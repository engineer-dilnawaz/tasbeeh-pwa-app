import { defaultThemeColors } from "./default/colors";
import { pickPineGreenPalette } from "./types";
import type { PineGreenPalette } from "./types";

/** Pine ramp derived from light theme palette `scales` (reference for static export). */
export const PINE_GREEN_PALETTE: PineGreenPalette = pickPineGreenPalette(defaultThemeColors.scales);
