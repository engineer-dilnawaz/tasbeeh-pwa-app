import type { PaletteMode } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

import { STORAGE_KEYS } from "@/shared/constants";
import { DEFAULT_THEME_MODE } from "@/shared/theme";

export type ThemeModePreference = PaletteMode | "system";

function isThemeModePreference(value: string): value is ThemeModePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function useThemeMode() {
  const [preference, setPreference] = useState<ThemeModePreference>(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.themeMode);
    return raw && isThemeModePreference(raw) ? raw : DEFAULT_THEME_MODE;
  });

  const [systemMode, setSystemMode] = useState<PaletteMode>(() => {
    if (typeof window === "undefined") return "light";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const onChange = () => setSystemMode(mq.matches ? "dark" : "light");

    // Modern browsers
    mq.addEventListener("change", onChange);
    return () => {
      // Older Safari may not fully support removeEventListener on MediaQueryList typings;
      // this is safe in modern browsers and ignored if unsupported.
      try {
        mq.removeEventListener("change", onChange);
      } catch {
        // Legacy fallback (deprecated)
        (mq as unknown as { removeListener?: (cb: () => void) => void }).removeListener?.(
          onChange,
        );
      }
    };
  }, []);

  const mode: PaletteMode = useMemo(
    () => (preference === "system" ? systemMode : preference),
    [preference, systemMode],
  );

  const setAndPersist = useCallback((next: ThemeModePreference) => {
    setPreference(next);
    localStorage.setItem(STORAGE_KEYS.themeMode, next);
  }, []);

  const toggle = useCallback(() => {
    setAndPersist(mode === "dark" ? "light" : "dark");
  }, [mode, setAndPersist]);

  return { mode, preference, setMode: setAndPersist, toggle };
}

