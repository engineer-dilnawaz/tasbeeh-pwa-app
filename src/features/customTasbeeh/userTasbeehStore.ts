import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Tasbeeh } from "@/shared/types/tasbeehCatalog";

interface UserTasbeehState {
  items: Tasbeeh[];
  addItem: (item: Tasbeeh) => void;
  removeItem: (id: string) => void;
}

export const useUserTasbeehStore = create<UserTasbeehState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((s) => ({
          items: s.items.some((i) => i.id === item.id) ? s.items : [...s.items, item],
        })),
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
    }),
    {
      name: "tasbeeh-user-phrases",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    },
  ),
);
