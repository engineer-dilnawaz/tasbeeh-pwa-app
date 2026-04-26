import { useEffect, useRef, useState } from "react";

export type AppTheme = "light" | "dark" | "pineGreen";

const THEME_STORAGE_KEY = "tasbeeh-app-theme";

/**
 * Robust hook to manage Divine Atomic System themes with persistence.
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<AppTheme>(() => {
    if (typeof window === "undefined") return "light";
    
    // 1. Check localStorage
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY) as AppTheme | null;
    if (saved && ["light", "dark", "pineGreen"].includes(saved)) return saved;

    // 2. Check document attribute (in case blocking script already set it)
    const root = window.document.documentElement;
    const attr = root.getAttribute("data-theme") as AppTheme | null;
    if (attr && ["light", "dark", "pineGreen"].includes(attr)) return attr;
    
    // 3. Fall back to system preference
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const hasInitializedTheme = useRef(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const isFirst = !hasInitializedTheme.current;
    hasInitializedTheme.current = true;

    if (!isFirst) {
      root.classList.add("theme-transitioning");
      void root.offsetHeight;
    }

    // Update UI and class
    root.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    
    // Manage .dark class for generic dark mode support in tailwind
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (isFirst) return;

    const transitionTimeout = window.setTimeout(() => {
      root.classList.remove("theme-transitioning");
    }, 300);

    return () => {
      window.clearTimeout(transitionTimeout);
      root.classList.remove("theme-transitioning");
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "pineGreen";
      return "light";
    });
  };

  return { theme, toggleTheme, setTheme };
};
