import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { indexedDbStorage } from "@/shared/utils/indexedDbStorage";
import {
  bootstrapTasbeehDb,
  completeRoundProgress,
  cycleTasbeehProgress,
  incrementProgress,
  decrementProgress,
  factoryReset,
  readTasbeehSnapshot,
  resetProgress,
  selectTasbeehProgress,
  setDefaultTasbeehProgress,
  upsertTasbeehItems,
  type TasbeehSnapshot,
} from "@/features/tasbeeh/services/tasbeehRepository";

import { queryClient } from "@/services/queryClient";
import { type TasbeehItem, type ActiveZikrSlot } from "../types";

interface TasbeehState {
  // Collection Discovery
  tasbeehLibrary: TasbeehItem[];
  
  // Parallel Active Slots (Max 4)
  activeSlots: ActiveZikrSlot[];
  primarySlotIndex: number;
  
  // Legacy/Computed Compatibility (to avoid breaking Ring/UI)
  currentTasbeehId: string | null;
  count: number;
  streakDays: number;
  lastCompletedOn: string | null;
  
  // Hydration & Persistence
  isHydrated: boolean;
  hydrateFromDb: () => Promise<void>;
  
  // Core Actions
  incrementCount: () => Promise<void>;
  decrementCount: () => Promise<void>;
  resetCount: () => Promise<void>;
  cycleTasbeeh: () => Promise<void>;
  completeRound: () => Promise<void>;
  
  // New Parallel Slot Actions
  addActiveSlot: (collection: { id: string; name: string; items: TasbeehItem[] }) => void;
  removeActiveSlot: (collectionId: string) => void;
  switchPrimarySlot: (index: number) => void;
  
  // Legacy Support
  setCurrentTasbeeh: (id: string) => Promise<void>;
  setDefaultTasbeeh: () => Promise<void>;
  resetEverything: () => Promise<void>;
}

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
    (set, get) => ({
      tasbeehLibrary: [],
      activeSlots: [
        {
          collectionId: "default",
          name: "Daily Adhkar",
          items: [],
          currentIndex: 0,
          currentCount: 0,
          isCompleted: false,
          totalTaps: 0,
        },
      ],
      primarySlotIndex: 0,
      currentTasbeehId: null,
      count: 0,
      streakDays: 0,
      lastCompletedOn: null,
      isHydrated: false,

      hydrateFromDb: async () => {
        await bootstrapTasbeehDb();
        
        // 1. Recover state from Storage (IndexedDB)
        const { activeSlots, primarySlotIndex } = get();
        
        // 2. Sync if slot exists and has items
        if (activeSlots && activeSlots[primarySlotIndex]) {
          const slot = activeSlots[primarySlotIndex];
          const currentItem = slot.items[slot.currentIndex];
          
          if (currentItem) {
            await upsertTasbeehItems(slot.items);
            await selectTasbeehProgress(currentItem.id);
          }
        }

        const snapshot = await readTasbeehSnapshot();
        applySnapshotToState(set, snapshot);
        set({ isHydrated: true });
      },

      addActiveSlot: (collection) => {
        const { activeSlots } = get();
        if (activeSlots.length >= 4) return;
        if (activeSlots.some((s) => s.collectionId === collection.id)) return;

        const newSlot: ActiveZikrSlot = {
          collectionId: collection.id,
          name: collection.name,
          items: collection.items,
          currentIndex: 0,
          currentCount: 0,
          isCompleted: false,
          totalTaps: 0,
        };

        set({ activeSlots: [...activeSlots, newSlot] });
        
        // Sync items to DB so incrementProgress can find them
        void upsertTasbeehItems(collection.items);
      },

      removeActiveSlot: (collectionId) => {
        const { activeSlots, primarySlotIndex } = get();
        const newSlots = activeSlots.filter((s) => s.collectionId !== collectionId);
        
        let newPrimaryIndex = primarySlotIndex;
        if (newSlots.length === 0) {
          newPrimaryIndex = 0;
        } else {
          newPrimaryIndex = Math.min(primarySlotIndex, newSlots.length - 1);
        }

        set({
          activeSlots: newSlots,
          primarySlotIndex: newPrimaryIndex,
          // Reset legacy count if no slots left
          ...(newSlots.length === 0 ? { count: 0, currentTasbeehId: null } : {})
        });
      },

      switchPrimarySlot: (index) => {
        const { activeSlots, count, primarySlotIndex } = get();
        if (index === primarySlotIndex) return;

        // 1. Sync current counting state into the old primary slot
        const updatedSlots = [...activeSlots];
        updatedSlots[primarySlotIndex] = {
          ...updatedSlots[primarySlotIndex],
          currentCount: count,
        };

        // 2. Set new primary and pull its cached count forward
        const nextSlot = updatedSlots[index];
        set({
          activeSlots: updatedSlots,
          primarySlotIndex: index,
          currentTasbeehId: nextSlot.items[nextSlot.currentIndex].id,
          count: nextSlot.currentCount,
        });

        // Ensure the items for the new primary slot are in DB
        void upsertTasbeehItems(nextSlot.items);
        void selectTasbeehProgress(nextSlot.items[nextSlot.currentIndex].id).then(async () => {
             // Sync the DB count to match our slot's currentCount
             // This is important because repository might have a different stale count
             await resetProgress(); // Clear 
             // We can't easily "set" the count in repository without a specific method
             // but incrementProgress will work from 0 up to 1000 now.
        });
      },

      incrementCount: async () => {
        const { activeSlots, primarySlotIndex, count } = get();
        const nextCount = count + 1;

        // Optimistic update
        const updatedSlots = [...activeSlots];
        updatedSlots[primarySlotIndex].currentCount = nextCount;
        set({ count: nextCount, activeSlots: updatedSlots });

        await incrementProgress();
        const snapshot = await readTasbeehSnapshot();
        applySnapshotToState(set, snapshot);
        
        // Re-sync slot count after DB truth is confirmed
        const finalCount = get().count;
        const confirmedSlots = [...get().activeSlots];
        confirmedSlots[primarySlotIndex].currentCount = finalCount;
        set({ activeSlots: confirmedSlots });
      },

      decrementCount: async () => {
        await decrementProgress();
        const snapshot = await readTasbeehSnapshot();
        applySnapshotToState(set, snapshot);

        const { activeSlots, primarySlotIndex, count } = get();
        const updatedSlots = [...activeSlots];
        updatedSlots[primarySlotIndex].currentCount = count;
        set({ activeSlots: updatedSlots });
      },

      setCurrentTasbeeh: async (id: string) => {
        await selectTasbeehProgress(id);
        const snapshot = await readTasbeehSnapshot();
        applySnapshotToState(set, snapshot);

        const { activeSlots, primarySlotIndex } = get();
        const updatedSlots = [...activeSlots];
        const itemIdx = updatedSlots[primarySlotIndex].items.findIndex(i => i.id === id);
        if (itemIdx >= 0) {
          updatedSlots[primarySlotIndex].currentIndex = itemIdx;
          set({ activeSlots: updatedSlots });
        }
      },

      resetCount: async () => {
        await resetProgress();
        const snapshot = await readTasbeehSnapshot();
        applySnapshotToState(set, snapshot);

        const { activeSlots, primarySlotIndex } = get();
        const updatedSlots = [...activeSlots];
        updatedSlots[primarySlotIndex].currentCount = 0;
        set({ activeSlots: updatedSlots });
      },

      cycleTasbeeh: async () => {
        await cycleTasbeehProgress();
        const snapshot = await readTasbeehSnapshot();
        applySnapshotToState(set, snapshot);

        const { activeSlots, primarySlotIndex } = get();
        const updatedSlots = [...activeSlots];
        const currentSlot = updatedSlots[primarySlotIndex];
        updatedSlots[primarySlotIndex].currentIndex = (currentSlot.currentIndex + 1) % currentSlot.items.length;
        updatedSlots[primarySlotIndex].currentCount = snapshot.count;
        set({ activeSlots: updatedSlots });
      },

      completeRound: async () => {
        await completeRoundProgress();
        const snapshot = await readTasbeehSnapshot();
        applySnapshotToState(set, snapshot);

        const { activeSlots, primarySlotIndex } = get();
        const updatedSlots = [...activeSlots];
        updatedSlots[primarySlotIndex].currentCount = 0;
        set({ activeSlots: updatedSlots });
      },

      setDefaultTasbeeh: async () => {
        await setDefaultTasbeehProgress();
        const snapshot = await readTasbeehSnapshot();
        applySnapshotToState(set, snapshot);
      },

      resetEverything: async () => {
        // 1. Clear Storage to prevent re-hydration of old state
        await indexedDbStorage.removeItem("tasbeeh-home-storage");
        
        // 2. Wipe IndexedDB (All 7 tables)
        await factoryReset();
        
        // 3. Force Clear React Query Cache to remove stale collections
        queryClient.clear();
        
        set({
          tasbeehLibrary: [],
          activeSlots: [],
          primarySlotIndex: 0,
          currentTasbeehId: null,
          count: 0,
          streakDays: 0,
          lastCompletedOn: null,
        });
      },
    }),
    {
      name: "tasbeeh-home-storage",
      storage: createJSONStorage(() => indexedDbStorage),
    },
  ),
);

