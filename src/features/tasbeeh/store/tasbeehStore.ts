import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  bootstrapTasbeehDb,
  completeRoundProgress,
  cycleTasbeehProgress,
  incrementProgress,
  decrementProgress,
  readTasbeehSnapshot,
  resetProgress,
  selectTasbeehProgress,
  setDefaultTasbeehProgress,
  type TasbeehSnapshot,
} from "@/features/tasbeeh/services/tasbeehRepository";

export interface TasbeehItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  target: number;
}

interface TasbeehState {
  tasbeehLibrary: TasbeehItem[];
  currentTasbeehId: string | null;
  count: number;
  streakDays: number;
  lastCompletedOn: string | null;
  isHydrated: boolean;
  hydrateFromDb: () => Promise<void>;
  incrementCount: () => Promise<void>;
  decrementCount: () => Promise<void>;
  setCurrentTasbeeh: (id: string) => Promise<void>;
  resetCount: () => Promise<void>;
  cycleTasbeeh: () => Promise<void>;
  completeRound: () => Promise<void>;
  setDefaultTasbeeh: () => Promise<void>;
}

const DEFAULT_TASBEEHS: TasbeehItem[] = [
  {
    id: "subhanallah",
    arabic: "سُبْحَانَ ٱللَّٰهِ",
    transliteration: "SubhanAllah",
    translation: "Glory be to Allah",
    target: 33,
  },
  {
    id: "alhamdulillah",
    arabic: "ٱلْحَمْدُ لِلَّٰهِ",
    transliteration: "Alhamdulillah",
    translation: "Praise be to Allah",
    target: 33,
  },
  {
    id: "allahuakbar",
    arabic: "ٱللَّٰهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    translation: "Allah is the Greatest",
    target: 34,
  },
];

const applySnapshotToState = (
  set: (next: Partial<TasbeehState>) => void,
  snapshot: TasbeehSnapshot,
) => {
  set({
    tasbeehLibrary: snapshot.tasbeehLibrary,
    currentTasbeehId: snapshot.currentTasbeehId,
    count: snapshot.count,
    streakDays: snapshot.streakDays,
    lastCompletedOn: snapshot.lastCompletedOn,
  });
};

export const useTasbeehStore = create<TasbeehState>()(
  persist(
    (set) => ({
      tasbeehLibrary: DEFAULT_TASBEEHS,
      currentTasbeehId: DEFAULT_TASBEEHS[0].id,
      count: 0,
      streakDays: 0,
      lastCompletedOn: null,
      isHydrated: false,

      hydrateFromDb: async () => {
        await bootstrapTasbeehDb();
        const snapshot = await readTasbeehSnapshot();
        applySnapshotToState(set, snapshot);
        set({ isHydrated: true });
      },

      incrementCount: async () => {
        await incrementProgress();
        const snapshot = await readTasbeehSnapshot();
        applySnapshotToState(set, snapshot);
      },

      decrementCount: async () => {
        await decrementProgress();
        const snapshot = await readTasbeehSnapshot();
        applySnapshotToState(set, snapshot);
      },

      setCurrentTasbeeh: async (id: string) => {
        await selectTasbeehProgress(id);
        const snapshot = await readTasbeehSnapshot();
        applySnapshotToState(set, snapshot);
      },

      resetCount: async () => {
        await resetProgress();
        const snapshot = await readTasbeehSnapshot();
        applySnapshotToState(set, snapshot);
      },

      cycleTasbeeh: async () => {
        await cycleTasbeehProgress();
        const snapshot = await readTasbeehSnapshot();
        applySnapshotToState(set, snapshot);
      },

      completeRound: async () => {
        await completeRoundProgress();
        const snapshot = await readTasbeehSnapshot();
        applySnapshotToState(set, snapshot);
      },

      setDefaultTasbeeh: async () => {
        await setDefaultTasbeehProgress();
        const snapshot = await readTasbeehSnapshot();
        applySnapshotToState(set, snapshot);
      },
    }),
    {
      name: "tasbeeh-home-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

