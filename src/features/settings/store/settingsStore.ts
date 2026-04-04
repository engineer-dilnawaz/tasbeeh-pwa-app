import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SettingsState {
  use24HourFormat: boolean;
  toggleTimeFormat: () => void;
  set24HourFormat: (value: boolean) => void;
}

/**
 * Global Settings Store
 * Adheres to domain-driven design, managing user preferences and UI configuration.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      use24HourFormat: false,
      toggleTimeFormat: () => set((state) => ({ use24HourFormat: !state.use24HourFormat })),
      set24HourFormat: (value) => set({ use24HourFormat: value }),
    }),
    {
      name: "tasbeeh-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
