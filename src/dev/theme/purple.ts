// ─── Purple Theme Tokens ────────────────────────────────────────────────────
// Single source of truth. Both modes derived from the same accent.

const accent = "#7c6cf0";
const accentHover = "#6a5be0";
const accentSubtle = "rgba(124,108,240,0.12)";
const accentSubtleHover = "rgba(124,108,240,0.2)";
const danger = "#ff453a";
const dangerSubtle = "rgba(255,69,58,0.12)";
const success = "#32d74b";

export const dark = {
  mode: "dark" as const,
  accent,
  accentHover,
  accentSubtle,
  accentSubtleHover,
  danger,
  dangerSubtle,
  success,
  bg: "#080808",
  bgPage: "#0d0d0d",
  surface: "#141414",
  surfaceRaised: "#1e1e1e",
  surfaceOverlay: "rgba(30,30,30,0.85)",
  border: "rgba(255,255,255,0.09)",
  borderStrong: "rgba(255,255,255,0.16)",
  textPrimary: "#f5f5f7",
  textSecondary: "#98989d",
  textMuted: "#48484a",
  textOnAccent: "#ffffff",
  arabic: "#a99ef5",
};

export const light = {
  mode: "light" as const,
  accent: "#5a4de0",
  accentHover: "#4a3ed0",
  accentSubtle: "rgba(90,77,224,0.10)",
  accentSubtleHover: "rgba(90,77,224,0.18)",
  danger,
  dangerSubtle,
  success,
  bg: "#f2f2f7",
  bgPage: "#ffffff",
  surface: "#ffffff",
  surfaceRaised: "#f2f2f7",
  surfaceOverlay: "rgba(242,242,247,0.85)",
  border: "rgba(0,0,0,0.08)",
  borderStrong: "rgba(0,0,0,0.16)",
  textPrimary: "#1d1d1f",
  textSecondary: "#6e6e73",
  textMuted: "#b0b0b8",
  textOnAccent: "#ffffff",
  arabic: "#5a4de0",
};

export interface PurpleTheme {
  mode: "dark" | "light";
  accent: string;
  accentHover: string;
  accentSubtle: string;
  accentSubtleHover: string;
  danger: string;
  dangerSubtle: string;
  success: string;
  bg: string;
  bgPage: string;
  surface: string;
  surfaceRaised: string;
  surfaceOverlay: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnAccent: string;
  arabic: string;
}
