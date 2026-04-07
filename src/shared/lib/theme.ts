import { THEME_COLOR_META, type ThemeId } from "@/shared/config/constants";
import {
  DAISY_THEMES_WITH_DARK_COLOR_SCHEME,
  normalizeDaisyTheme,
  type DaisyUiThemeName,
} from "@/shared/config/daisyUiThemes";

type TasbeehSettingsFile = {
  /** @deprecated legacy light/dark only — migrated to `daisyUiTheme` */
  theme?: string;
  daisyUiTheme?: string;
  accentPalette?: string;
};

function readTasbeehSettings(): TasbeehSettingsFile {
  try {
    const raw = localStorage.getItem("tasbeehSettings");
    if (!raw) return {};
    return JSON.parse(raw) as TasbeehSettingsFile;
  } catch {
    return {};
  }
}

function writeTasbeehSettings(partial: Partial<TasbeehSettingsFile>) {
  try {
    const prev = readTasbeehSettings();
    localStorage.setItem(
      "tasbeehSettings",
      JSON.stringify({ ...prev, ...partial }),
    );
  } catch {
    /* ignore */
  }
}

function syncHtmlDarkFromColorScheme(root: HTMLElement): ThemeId {
  const scheme = getComputedStyle(root).colorScheme.trim().toLowerCase();
  const isDark = scheme === "dark" || scheme.startsWith("dark");
  root.classList.toggle("dark", isDark);
  return isDark ? "dark" : "light";
}

/**
 * Applies daisyUI theme (`data-theme`), clears legacy accent classes, syncs `html.dark`
 * from `color-scheme`, and `theme-color` meta.
 * @see https://daisyui.com/docs/themes/
 */
export function applyThemeToDocument(daisyTheme: string): DaisyUiThemeName {
  const name = normalizeDaisyTheme(daisyTheme);
  const root = document.documentElement;
  root.setAttribute("data-theme", name);
  root.classList.remove("accent-purple", "accent-green");

  const applyChrome = () => {
    const id = syncHtmlDarkFromColorScheme(root);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_COLOR_META[id]);
  };
  applyChrome();
  requestAnimationFrame(applyChrome);

  return name;
}

export function persistDaisyTheme(themeName: string) {
  writeTasbeehSettings({
    daisyUiTheme: normalizeDaisyTheme(themeName),
  });
}

export function readStoredDaisyTheme(): DaisyUiThemeName {
  const s = readTasbeehSettings();
  if (s.daisyUiTheme) {
    return normalizeDaisyTheme(s.daisyUiTheme);
  }
  if (s.theme === "dark") return "dark";
  return "light";
}

/** Maps stored daisyUI theme to legacy `light` | `dark` (older helpers). */
export function readStoredTheme(): ThemeId {
  const d = readStoredDaisyTheme();
  return DAISY_THEMES_WITH_DARK_COLOR_SCHEME.has(d) ? "dark" : "light";
}
