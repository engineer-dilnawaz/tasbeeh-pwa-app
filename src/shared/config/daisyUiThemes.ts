/**
 * daisyUI built-in theme names — must match enabled themes in global.css (`themes: all`).
 * @see https://daisyui.com/docs/themes/
 */
export const DAISY_UI_THEME_NAMES = [
  "light",
  "dark",
  "acid",
  "abyss",
  "aqua",
  "autumn",
  "black",
  "bumblebee",
  "business",
  "caramellatte",
  "cmyk",
  "coffee",
  "corporate",
  "cupcake",
  "cyberpunk",
  "dim",
  "dracula",
  "emerald",
  "fantasy",
  "forest",
  "garden",
  "halloween",
  "lemonade",
  "lofi",
  "luxury",
  "night",
  "nord",
  "pastel",
  "retro",
  "silk",
  "sunset",
  "synthwave",
  "valentine",
  "winter",
  "wireframe",
] as const;

export type DaisyUiThemeName = (typeof DAISY_UI_THEME_NAMES)[number];

export const DAISY_UI_THEME_SET = new Set<string>(DAISY_UI_THEME_NAMES);

export function normalizeDaisyTheme(name: string | undefined): DaisyUiThemeName {
  const n = (name ?? "light").trim().toLowerCase();
  if (DAISY_UI_THEME_SET.has(n)) return n as DaisyUiThemeName;
  return "light";
}

/** Title case for UI labels */
export function formatDaisyThemeLabel(name: string): string {
  return name
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** Themes whose daisyUI definition uses `color-scheme: dark` (for legacy `ThemeId` / chrome). */
export const DAISY_THEMES_WITH_DARK_COLOR_SCHEME = new Set<DaisyUiThemeName>([
  "abyss",
  "aqua",
  "black",
  "business",
  "coffee",
  "dark",
  "dim",
  "dracula",
  "forest",
  "halloween",
  "luxury",
  "night",
  "sunset",
  "synthwave",
]);
