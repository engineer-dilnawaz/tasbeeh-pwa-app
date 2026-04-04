/**
 * Pine Green brand ramp — same structure as the reference app palette.
 * Theme files (default / dark) hold values; keys stay stable for readable usage.
 */
export interface PineGreenPalette {
  pineGreen1000: string;
  pineGreen900: string;
  pineGreen800: string;
  pineGreen700: string;
  pineGreen600: string;
  pineGreen500: string;
  pineGreen400: string;
  pineGreen300: string;
  pineGreen200: string;
  pineGreen100: string;
  pineGreen50: string;
}

/** App theme colors are palette-based; extend with more ramps later (e.g. lime) if needed. */
export type AppThemeColors = PineGreenPalette;
