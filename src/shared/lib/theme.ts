import { THEME_COLOR_META, type ThemeId } from "@/shared/config/constants";
import { applyPineGreenPaletteToRoot, getThemeColors } from "@/shared/theme";

export function normalizeTheme(theme: string | undefined): ThemeId {
  if (theme === "light" || theme === "dark") return theme;
  return "dark";
}

function applyThemeColorVariables(theme: ThemeId) {
  applyPineGreenPaletteToRoot(getThemeColors(theme));
}

export function applyThemeToDocument(theme: string): ThemeId {
  const id = normalizeTheme(theme);
  document.body.dataset.theme = id;
  applyThemeColorVariables(id);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLOR_META[id]);
  return id;
}

export function persistTheme(themeId: ThemeId) {
  try {
    const raw = localStorage.getItem("tasbeehSettings");
    const prev = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    localStorage.setItem("tasbeehSettings", JSON.stringify({ ...prev, theme: themeId }));
  } catch {
    /* ignore */
  }
}

export function readStoredTheme(): ThemeId {
  try {
    const raw = localStorage.getItem("tasbeehSettings");
    if (!raw) return normalizeTheme(undefined);
    const s = JSON.parse(raw) as { theme?: string };
    return normalizeTheme(s.theme);
  } catch {
    return normalizeTheme(undefined);
  }
}
