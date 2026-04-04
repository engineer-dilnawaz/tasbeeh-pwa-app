/**
 * Tasbeeh semantic theme tokens (Material-style + palette scales).
 * `scales` holds full color ramps; `pickPineGreenPalette(scales)` feeds `--pine-green-*` CSS vars.
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

export interface ThemeButtonVariantSet {
  contained: { background: string; text: string };
  outlined: { border: string; text: string };
  text: { text: string };
  elevated: { background: string; text: string };
  tonal: { background: string; text: string };
  destructive: { background: string; text: string };
  disabled: { background: string; text: string };
}

export interface ElevationLevels {
  level0: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  level5: string;
}

export interface OpacityScale {
  op5: string;
  op10: string;
  op20: string;
  op30: string;
  op40: string;
  op50: string;
  op60: string;
  op70: string;
  op80: string;
  op90: string;
  op100: string;
}

export interface PaletteScales {
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
  limeGreen600: string;
  limeGreen500: string;
  limeGreen400: string;
  limeGreen300: string;
  limeGreen200: string;
  limeGreen100: string;
  limeGreen50: string;
  earlyDawn600: string;
  earlyDawn500: string;
  earlyDawn400: string;
  earlyDawn300: string;
  earlyDawn200: string;
  earlyDawn100: string;
  earlyDawn50: string;
  salmonOrange600: string;
  salmonOrange500: string;
  salmonOrange400: string;
  salmonOrange300: string;
  salmonOrange200: string;
  salmonOrange100: string;
  salmonOrange50: string;
  deepKhaki600: string;
  deepKhaki500: string;
  deepKhaki400: string;
  deepKhaki300: string;
  deepKhaki200: string;
  deepKhaki100: string;
  deepKhaki50: string;
  teal600: string;
  teal500: string;
  teal400: string;
  teal300: string;
  teal200: string;
  teal100: string;
  teal50: string;
  richGreen600: string;
  richGreen500: string;
  richGreen400: string;
  richGreen300: string;
  richGreen200: string;
  richGreen100: string;
  richGreen50: string;
  red600: string;
  red500: string;
  red400: string;
  red300: string;
  red200: string;
  red100: string;
  red50: string;
  categoryEnvironment: string;
  categoryUrgentAppeal: string;
  categoryHousing: string;
}

export interface IThemeColors {
  background: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  onPrimary: string;
  error: string;
  success: string;
  warning: string;
  outline: string;
  transparent: string;
  white: string;
  black: string;
  secondary: string;
  tertiary: string;
  surface: string;
  surfaceVariant: string;
  surfaceDisabled: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  primaryContainer: string;
  secondaryContainer: string;
  tertiaryContainer: string;
  errorContainer: string;
  onSecondary: string;
  onTertiary: string;
  onError: string;
  onErrorContainer: string;
  onPrimaryContainer: string;
  onSecondaryContainer: string;
  onTertiaryContainer: string;
  onBackground: string;
  onSurface: string;
  onSurfaceVariant: string;
  onSurfaceDisabled: string;
  outlineVariant: string;
  backdrop: string;
  searchPlaceholderColor: string;
  backgroundWhite: string;
  blackText: string;
  whiteText: string;
  primaryButtonColor: string;
  disableButtonColor: string;
  buttonLoaderColor: string;
  disabledButtonLoaderColor: string;
  button: ThemeButtonVariantSet;
  elevation: ElevationLevels;
  scales: PaletteScales;
  blackOpacity: OpacityScale;
  whiteOpacity: OpacityScale;
  input: {
    placeholderText: string;
    inputBgColor: string;
    inputBorderColor: string;
  };
  border: { primary: string; secondary: string };
  card: { background: string; border: string };
  tags: { environment: string; urgentAppeal: string; housing: string };
}

export type AppThemeColors = IThemeColors;

export function pickPineGreenPalette(scales: PaletteScales): PineGreenPalette {
  return {
    pineGreen1000: scales.pineGreen1000,
    pineGreen900: scales.pineGreen900,
    pineGreen800: scales.pineGreen800,
    pineGreen700: scales.pineGreen700,
    pineGreen600: scales.pineGreen600,
    pineGreen500: scales.pineGreen500,
    pineGreen400: scales.pineGreen400,
    pineGreen300: scales.pineGreen300,
    pineGreen200: scales.pineGreen200,
    pineGreen100: scales.pineGreen100,
    pineGreen50: scales.pineGreen50,
  };
}
