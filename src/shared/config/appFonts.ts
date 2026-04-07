/**
 * App UI font presets (accessibility / personalization).
 * Stacks are applied via `--font-primary` on `document.documentElement`.
 */
export const FONT_MAP = {
  inter: "'Inter', ui-sans-serif, system-ui, sans-serif",
  jakarta: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
  dmSans: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
  manrope: "'Manrope', ui-sans-serif, system-ui, sans-serif",
  rakkas: "'Rakkas', cursive",
  amiri: "'Amiri', serif",
} as const;

export type AppFontId = keyof typeof FONT_MAP;

/** `family=` query value for Google Fonts CSS2 API (weights used in UI). */
export const APP_FONT_GOOGLE_SPECS: Record<AppFontId, string> = {
  inter: "Inter:wght@400;500;600;700",
  jakarta: "Plus+Jakarta+Sans:wght@400;500;600;700",
  dmSans: "DM+Sans:wght@400;500;600;700",
  manrope: "Manrope:wght@400;500;600;700",
  rakkas: "Rakkas",
  amiri: "Amiri:wght@400;700",
};

export const APP_FONT_OPTIONS: readonly {
  id: AppFontId;
  label: string;
}[] = [
  { id: "inter", label: "Inter" },
  { id: "jakarta", label: "Plus Jakarta Sans" },
  { id: "dmSans", label: "DM Sans" },
  { id: "manrope", label: "Manrope" },
  { id: "rakkas", label: "Rakkas" },
  { id: "amiri", label: "Amiri" },
] as const;

export const DEFAULT_APP_FONT_ID: AppFontId = "inter";
