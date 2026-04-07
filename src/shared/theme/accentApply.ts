import type { AccentPaletteId } from "@/shared/config/accentPalette";
import type { ThemeId } from "@/shared/config/constants";

/** Browser / PWA `theme-color` meta (Tailwind-aligned slate + tint per accent). */
export const ACCENT_THEME_CHROME: Record<
  AccentPaletteId,
  Record<ThemeId, string>
> = {
  green: {
    light: "#f8fafc",
    dark: "#020617",
  },
  purple: {
    light: "#faf5ff",
    dark: "#0c0518",
  },
};

/** Sets `accent-purple` / `accent-green` on `<html>` for Tailwind `accent-*:` utilities. */
export function applyAccentToDocument(accent: AccentPaletteId): void {
  const root = document.documentElement;
  root.classList.toggle("accent-purple", accent === "purple");
  root.classList.toggle("accent-green", accent === "green");
}
