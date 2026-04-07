/** User-selectable brand / accent family (light–dark still toggled separately). */
export const VALID_ACCENT_PALETTES = ["purple", "green"] as const;

export type AccentPaletteId = (typeof VALID_ACCENT_PALETTES)[number];

export const DEFAULT_ACCENT_PALETTE: AccentPaletteId = "purple";

export function normalizeAccentPalette(value: string | undefined): AccentPaletteId {
  if (value === "green" || value === "purple") return value;
  return DEFAULT_ACCENT_PALETTE;
}
