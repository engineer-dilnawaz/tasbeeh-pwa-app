import { useEffect } from "react";

import { SettingsHub } from "@/features/settings/components/SettingsHub";

const SETTINGS_SCROLL_KEY = "settings-scroll-y";

export default function Settings() {
  useEffect(() => {
    const stored = window.sessionStorage.getItem(SETTINGS_SCROLL_KEY);
    if (stored) {
      const parsed = Number(stored);
      if (Number.isFinite(parsed)) {
        requestAnimationFrame(() => window.scrollTo(0, parsed));
      }
    }

    return () => {
      window.sessionStorage.setItem(SETTINGS_SCROLL_KEY, String(window.scrollY));
    };
  }, []);

  return (
    <div>
      <SettingsHub />
    </div>
  );
}

