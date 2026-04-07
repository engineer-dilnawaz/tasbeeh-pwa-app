import { useSyncExternalStore } from "react";

/**
 * Semantic colors for squircle / lab primitives (inline styles).
 * Default live palette follows daisyUI `data-theme` via CSS variables on `<html>`.
 */
export type UiPalette = {
  accent: string;
  accentSubtle: string;
  danger: string;
  dangerSubtle: string;
  success: string;
  bg: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnAccent: string;
};

/** Inline-style palette wired to daisyUI theme tokens (updates with `data-theme`). */
export const THEME_PALETTE_CSS: UiPalette = {
  accent: "var(--color-primary)",
  accentSubtle: "color-mix(in oklab, var(--color-primary) 18%, transparent)",
  danger: "var(--color-error)",
  dangerSubtle: "color-mix(in oklab, var(--color-error) 16%, transparent)",
  success: "var(--color-success)",
  bg: "var(--color-base-200)",
  surface: "var(--color-base-100)",
  surfaceRaised: "var(--color-base-200)",
  border: "var(--color-base-300)",
  borderStrong:
    "color-mix(in oklab, var(--color-base-300) 75%, var(--color-base-content) 25%)",
  textPrimary: "var(--color-base-content)",
  textSecondary:
    "color-mix(in oklab, var(--color-base-content) 72%, transparent)",
  textMuted: "color-mix(in oklab, var(--color-base-content) 52%, transparent)",
  textOnAccent: "var(--color-primary-content)",
};

const GREEN_LIGHT: UiPalette = {
  accent: "#15803d",
  accentSubtle: "rgba(21, 128, 61, 0.14)",
  danger: "#dc2626",
  dangerSubtle: "rgba(220, 38, 38, 0.12)",
  success: "#16a34a",
  bg: "#f8fafc",
  surface: "#ffffff",
  surfaceRaised: "#f1f5f9",
  border: "rgba(15, 23, 42, 0.12)",
  borderStrong: "rgba(15, 23, 42, 0.18)",
  textPrimary: "#0f172a",
  textSecondary: "rgba(15, 23, 42, 0.62)",
  textMuted: "rgba(71, 85, 105, 0.9)",
  textOnAccent: "#ffffff",
};

const GREEN_DARK: UiPalette = {
  accent: "#4ade80",
  accentSubtle: "rgba(74, 222, 128, 0.18)",
  danger: "#f87171",
  dangerSubtle: "rgba(248, 113, 113, 0.16)",
  success: "#4ade80",
  bg: "#020617",
  surface: "#0f172a",
  surfaceRaised: "#1e293b",
  border: "rgba(148, 163, 184, 0.18)",
  borderStrong: "rgba(226, 232, 240, 0.22)",
  textPrimary: "#f8fafc",
  textSecondary: "rgba(226, 232, 240, 0.65)",
  textMuted: "rgba(148, 163, 184, 0.88)",
  textOnAccent: "#052e16",
};

const PURPLE_LIGHT: UiPalette = {
  ...GREEN_LIGHT,
  accent: "#9333ea",
  accentSubtle: "rgba(147, 51, 234, 0.12)",
  success: "#16a34a",
};

const PURPLE_DARK: UiPalette = {
  ...GREEN_DARK,
  accent: "#c084fc",
  accentSubtle: "rgba(192, 132, 252, 0.18)",
  success: "#4ade80",
  textOnAccent: "#1e0a3d",
};

/** @deprecated Prefer `THEME_PALETTE_CSS` / `useUiPalette` for daisy-backed screens. */
export function resolveUiPaletteFromClass(className: string): UiPalette {
  const dark = /\bdark\b/.test(className);
  const purple = /\baccent-purple\b/.test(className);
  if (dark && purple) return PURPLE_DARK;
  if (dark) return GREEN_DARK;
  if (purple) return PURPLE_LIGHT;
  return GREEN_LIGHT;
}

function subscribeTheme(cb: () => void) {
  const el = document.documentElement;
  const mo = new MutationObserver(cb);
  mo.observe(el, {
    attributes: true,
    attributeFilter: ["class", "data-theme"],
  });
  return () => mo.disconnect();
}

function getThemeSnapshot() {
  return `${document.documentElement.getAttribute("data-theme") ?? ""}:${document.documentElement.className}`;
}

/** daisyUI-aligned palette; re-renders when `data-theme` or `html` classes change. */
export function useUiPalette(): UiPalette {
  useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    () => "",
  );
  return THEME_PALETTE_CSS;
}

export function useResolvedPalette(palette?: UiPalette): UiPalette {
  const live = useUiPalette();
  return palette ?? live;
}

/** `html.dark` — for elevation / gradients separate from palette token heuristics. */
export function useIsDarkMode(): boolean {
  return useSyncExternalStore(
    subscribeTheme,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
}

/** Non-React default for rare callers (e.g. tests). */
export const defaultUiPalette = THEME_PALETTE_CSS;
