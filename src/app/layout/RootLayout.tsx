import React from "react";
import { Outlet } from "react-router-dom";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useTheme } from "@/shared/design-system/hooks/useTheme";

/**
 * RootLayout
 * 
 * The top-level layout that handles cross-cutting concerns for ALL routes:
 * - Theme hydration from IndexedDB
 * - DOM theme synchronization
 * 
 * This ensures even public routes like SignIn/Onboarding are correctly themed on refresh.
 */
export default function RootLayout() {
  const { setTheme } = useTheme();
  const hydrateFromDb = useSettingsStore((state) => state.hydrateFromDb);
  const isHydrated = useSettingsStore((state) => state.isHydrated);
  const theme = useSettingsStore((state) => state.appearance.theme);

  // One-time hydration of settings from IndexedDB at the root level.
  React.useEffect(() => {
    if (!isHydrated) {
      void hydrateFromDb();
    }
  }, [hydrateFromDb, isHydrated]);

  // Keep DOM theme in sync with hydrated store globally.
  React.useEffect(() => {
    if (isHydrated) {
      setTheme(theme);
    }
  }, [setTheme, theme, isHydrated]);

  return <Outlet />;
}
