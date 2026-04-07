import type { UiPalette } from "@/shared/components/ui/palette";
import type { PurpleTheme } from "./purple";

export function purpleToUiPalette(theme: PurpleTheme): UiPalette {
  return {
    accent: theme.accent,
    accentSubtle: theme.accentSubtle,
    danger: theme.danger,
    dangerSubtle: theme.dangerSubtle,
    success: theme.success,
    bg: theme.bg,
    surface: theme.surface,
    surfaceRaised: theme.surfaceRaised,
    border: theme.border,
    borderStrong: theme.borderStrong,
    textPrimary: theme.textPrimary,
    textSecondary: theme.textSecondary,
    textMuted: theme.textMuted,
    textOnAccent: theme.textOnAccent,
  };
}
