import { useEffect, useRef, useState } from "react";

/**
 * Simple hook to manage DaisyUI theme (Light/Dark).
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const root = window.document.documentElement;
    const attr = root.getAttribute("data-theme");
    if (attr === "dark" || root.classList.contains("dark")) return "dark";
    if (attr === "light") return "light";
    // Fall back to system preference if theme isn't set yet.
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const hasInitializedTheme = useRef(false);

  useEffect(() => {
    const root = window.document.documentElement;

    // First mount: don't "reset" theme to default — just sync to state.
    // This avoids multiple hook instances fighting each other.
    const isFirst = !hasInitializedTheme.current;
    hasInitializedTheme.current = true;

    if (!isFirst) {
      root.classList.add("theme-transitioning");
      // Force style recalculation so transition class is active before theme changes.
      void root.offsetHeight;
    }
    root.setAttribute("data-theme", theme);
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (isFirst) return;

    const transitionTimeout = window.setTimeout(() => {
      root.classList.remove("theme-transitioning");
    }, 280);

    return () => {
      window.clearTimeout(transitionTimeout);
      root.classList.remove("theme-transitioning");
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme, setTheme };
};
