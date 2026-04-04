import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEFAULT_TASBEEH } from "@/shared/config/constants";
import type { TasbeehItem } from "@/shared/types/models";

interface TasbeehStoreState {
  tasbeehList: TasbeehItem[];
  count: number;
  currentIndex: number;
  streak: number;
  totalRecitations: number;
  favoriteAsmaNames: number[];
  increment: () => void;
  setTasbeehList: (list: TasbeehItem[]) => void;
  resetProgress: () => void;
  toggleFavoriteAsma: (nameNumber: number) => void;
}

export const useTasbeehStore = create<TasbeehStoreState>()(
  persist(
    (set, get) => ({
      tasbeehList: DEFAULT_TASBEEH.map((t) => ({ ...t })),
      count: 0,
      currentIndex: 0,
      streak: 0,
      totalRecitations: 0,
      favoriteAsmaNames: [],

      increment: () => {
        const { count, currentIndex, tasbeehList, totalRecitations } = get();
        const target = tasbeehList[currentIndex]?.target ?? 100;
        const nextCount = count + 1;
        const nextTotal = totalRecitations + 1;

        if (nextCount >= target) {
          set({
            count: 0,
            currentIndex: (currentIndex + 1) % Math.max(tasbeehList.length, 1),
            totalRecitations: nextTotal,
            streak: get().streak,
          });
        } else {
          set({ count: nextCount, totalRecitations: nextTotal });
        }
      },

      setTasbeehList: (list) =>
        set({
          tasbeehList: list.length ? list : DEFAULT_TASBEEH.map((t) => ({ ...t })),
          count: 0,
          currentIndex: 0,
        }),

      resetProgress: () => set({ count: 0, currentIndex: 0 }),
      
      toggleFavoriteAsma: (num) => {
        const { favoriteAsmaNames } = get();
        if (favoriteAsmaNames.includes(num)) {
          set({ favoriteAsmaNames: favoriteAsmaNames.filter(n => n !== num) });
        } else {
          set({ favoriteAsmaNames: [...favoriteAsmaNames, num] });
        }
      },
    }),
    {
      name: "tasbeeh-react-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        tasbeehList: s.tasbeehList,
        count: s.count,
        currentIndex: s.currentIndex,
        streak: s.streak,
        totalRecitations: s.totalRecitations,
        favoriteAsmaNames: s.favoriteAsmaNames,
      }),
    },
  ),
);
