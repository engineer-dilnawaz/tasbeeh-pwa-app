import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { localYmd, yesterdayYmd } from "@/shared/utils/localCalendarDate";

export type IncrementResult =
  | { completed: false }
  | { completed: true; label: string };

function streakAfterCompletion(
  streak: number,
  lastStreakDate: string | null,
  today: string,
): { streak: number; lastStreakDate: string } {
  if (lastStreakDate === today) {
    return { streak, lastStreakDate: today };
  }
  const y = yesterdayYmd(today);
  if (lastStreakDate === y) {
    return { streak: streak + 1, lastStreakDate: today };
  }
  return { streak: 1, lastStreakDate: today };
}

interface TasbeehStoreState {
  count: number;
  currentIndex: number;
  activeTasbeehId: string | null;
  streak: number;
  lastStreakDate: string | null;
  totalRecitations: number;
  favoriteAsmaNames: number[];
  completedIndicesToday: number[];
  lastCalendarDate: string;
  dailyGoal: number;
  allowCompletionUndo: boolean;
  
  // Actions
  increment: (target: number, label: string, listLength: number) => IncrementResult;
  undoLastTap: (prevTarget: number, listLength: number) => boolean;
  setActiveTasbeeh: (id: string, index: number) => void;
  resetProgress: () => void;
  resetCurrentRound: () => void;
  toggleFavoriteAsma: (nameNumber: number) => void;
}

export const useTasbeehStore = create<TasbeehStoreState>()(
  persist(
    (set, get) => ({
      count: 0,
      currentIndex: 0,
      activeTasbeehId: null,
      streak: 0,
      lastStreakDate: null,
      totalRecitations: 0,
      favoriteAsmaNames: [],
      completedIndicesToday: [],
      lastCalendarDate: "",
      dailyGoal: 4,
      allowCompletionUndo: false,

      increment: (target, label, listLength) => {
        const s = get();
        const today = localYmd();
        let completedIndicesToday = s.completedIndicesToday ?? [];
        let lastCalendarDate = s.lastCalendarDate ?? "";

        if (lastCalendarDate !== today) {
          completedIndicesToday = [];
          lastCalendarDate = today;
        }

        const { count, currentIndex, totalRecitations } = s;
        const nextCount = count + 1;
        const nextTotal = totalRecitations + 1;

        if (nextCount >= target) {
          const finishedIndex = currentIndex;

          if (!completedIndicesToday.includes(finishedIndex)) {
            completedIndicesToday = [...completedIndicesToday, finishedIndex];
          }

          const sk = streakAfterCompletion(
            s.streak,
            s.lastStreakDate,
            today,
          );

          set({
            count: 0,
            currentIndex: (currentIndex + 1) % Math.max(listLength, 1),
            totalRecitations: nextTotal,
            completedIndicesToday,
            lastCalendarDate,
            streak: sk.streak,
            lastStreakDate: sk.lastStreakDate,
            allowCompletionUndo: true,
          });
          return { completed: true, label };
        }

        set({
          count: nextCount,
          totalRecitations: nextTotal,
          completedIndicesToday,
          lastCalendarDate,
          allowCompletionUndo: false,
        });
        return { completed: false };
      },

      undoLastTap: (prevTarget, listLength) => {
        const s = get();
        const { count, currentIndex, totalRecitations } = s;

        if (count > 0) {
          set({
            count: count - 1,
            totalRecitations: Math.max(0, totalRecitations - 1),
            allowCompletionUndo: false,
          });
          return true;
        }

        if (!s.allowCompletionUndo || totalRecitations === 0) {
          return false;
        }

        const len = Math.max(listLength, 1);
        const prevIndex = (currentIndex - 1 + len) % len;
        const completed = new Set(s.completedIndicesToday ?? []);
        completed.delete(prevIndex);

        set({
          currentIndex: prevIndex,
          count: Math.max(0, prevTarget - 1),
          totalRecitations: Math.max(0, totalRecitations - 1),
          completedIndicesToday: [...completed],
          allowCompletionUndo: false,
        });
        return true;
      },

      setActiveTasbeeh: (id, index) => set({ 
        activeTasbeehId: id, 
        currentIndex: index,
        count: 0,
        allowCompletionUndo: false 
      }),

      resetProgress: () => set({ count: 0, currentIndex: 0, allowCompletionUndo: false }),

      resetCurrentRound: () => set({ count: 0, allowCompletionUndo: false }),

      toggleFavoriteAsma: (num) => {
        const { favoriteAsmaNames } = get();
        if (favoriteAsmaNames.includes(num)) {
          set({
            favoriteAsmaNames: favoriteAsmaNames.filter((n) => n !== num),
          });
        } else {
          set({ favoriteAsmaNames: [...favoriteAsmaNames, num] });
        }
      },
    }),
    {
      name: "tasbeeh-session",
      version: 3,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        count: s.count,
        currentIndex: s.currentIndex,
        activeTasbeehId: s.activeTasbeehId,
        streak: s.streak,
        lastStreakDate: s.lastStreakDate,
        totalRecitations: s.totalRecitations,
        favoriteAsmaNames: s.favoriteAsmaNames,
        completedIndicesToday: s.completedIndicesToday,
        lastCalendarDate: s.lastCalendarDate,
        dailyGoal: s.dailyGoal,
      }),
    },
  ),
);
