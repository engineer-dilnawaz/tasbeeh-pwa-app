import {
  APP_FONT_GOOGLE_SPECS,
  DEFAULT_APP_FONT_ID,
  FONT_MAP,
  type AppFontId,
} from "@/shared/config/appFonts";

export const APP_FONT_STORAGE_KEY = "app_font";

const LINK_ATTR = "data-app-font-link";

function isAppFontId(value: string): value is AppFontId {
  return Object.prototype.hasOwnProperty.call(FONT_MAP, value);
}

export function normalizeAppFontId(value: string | null): AppFontId {
  if (value && isAppFontId(value)) return value;
  return DEFAULT_APP_FONT_ID;
}

export function readStoredAppFontId(): AppFontId {
  try {
    return normalizeAppFontId(localStorage.getItem(APP_FONT_STORAGE_KEY));
  } catch {
    return DEFAULT_APP_FONT_ID;
  }
}

export function persistAppFontId(id: AppFontId) {
  try {
    localStorage.setItem(APP_FONT_STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
}

/**
 * Injects a Google Fonts stylesheet for this family if not already present.
 */
export function ensureGoogleFontLoaded(id: AppFontId) {
  if (document.querySelector(`link[${LINK_ATTR}="${id}"]`)) return;

  const spec = APP_FONT_GOOGLE_SPECS[id];
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${spec}&display=swap`;
  link.setAttribute(LINK_ATTR, id);
  document.head.appendChild(link);
}

/** Sets `--font-primary` for global typography (see `global.css`). */
export function applyAppFontToDocument(id: AppFontId) {
  document.documentElement.style.setProperty("--font-primary", FONT_MAP[id]);
}

export function initAppFont() {
  const id = readStoredAppFontId();
  ensureGoogleFontLoaded(id);
  applyAppFontToDocument(id);
}
