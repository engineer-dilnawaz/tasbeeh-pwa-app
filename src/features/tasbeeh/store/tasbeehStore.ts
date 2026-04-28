import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/shared/constants";

import type { Collection, CollectionId, Tasbeeh, TasbeehId } from "@/features/tasbeeh/types";

type TasbeehCounts = Record<TasbeehId, number>;
type DailyTapCounts = Record<string, number>; // YYYY-MM-DD -> taps

type TasbeehState = {
  items: Tasbeeh[];
  collections: Collection[];
  selectedId: TasbeehId | null;
  selectedCollectionId: CollectionId | null;
  counts: TasbeehCounts;
  dailyTapCounts: DailyTapCounts;
  hasHydrated: boolean;

  // Hydration
  markHydrated: () => void;

  // Tasbeeh selection & counting
  select: (id: TasbeehId) => void;
  increment: (id: TasbeehId) => void;
  decrement: (id: TasbeehId) => void;
  reset: (id: TasbeehId) => void;
  overrideCount: (id: TasbeehId, count: number) => void;

  // Collection selection — smart resume: finds first unfinished tasbeeh
  selectCollection: (collectionId: CollectionId) => void;
  // Restart a collection: reset counts for its items and select first item
  restartCollection: (collectionId: CollectionId) => void;
  // Advance to the next tasbeeh in the active collection queue
  advanceInCollection: () => void;

  // Tasbeeh CRUD
  addTasbeehToCollection: (collectionId: CollectionId, tasbeeh: Omit<Tasbeeh, "id">) => void;
  updateTasbeeh: (id: TasbeehId, updates: Partial<Omit<Tasbeeh, "id">>) => void;
  removeTasbeehFromCollection: (collectionId: CollectionId, tasbeehId: TasbeehId) => void;

  // Collection CRUD
  addCollection: (title: string) => void;
  updateCollection: (id: CollectionId, updates: Partial<Omit<Collection, "id">>) => void;
  removeCollection: (id: CollectionId) => void;

  // Dev / settings
  resetAll: () => void;
};

const DEFAULT_ITEMS: Tasbeeh[] = [
  { id: "subhanallah", titleKey: "tasbeeh.items.subhanallah", targetCount: 33 },
  { id: "alhamdulillah", titleKey: "tasbeeh.items.alhamdulillah", targetCount: 33 },
  { id: "allahuAkbar", titleKey: "tasbeeh.items.allahuAkbar", targetCount: 34 },
];

const DEFAULT_COLLECTIONS: Collection[] = [
  {
    id: "after-prayer",
    title: "After Prayer",
    tasbeehIds: ["subhanallah", "alhamdulillah", "allahuAkbar"],
  },
];

/** Returns the first tasbeeh in the collection whose count < targetCount.
 *  Falls back to the first item if all are complete (wrap-around). */
function resolveSmartResume(
  collection: Collection,
  items: Tasbeeh[],
  counts: TasbeehCounts,
): TasbeehId | null {
  const firstUnfinished = collection.tasbeehIds.find((tid) => {
    const item = items.find((i) => i.id === tid);
    return item && (counts[tid] ?? 0) < item.targetCount;
  });
  return firstUnfinished ?? collection.tasbeehIds[0] ?? null;
}

export const useTasbeehStore = create<TasbeehState>()(
  persist(
    (set, get) => ({
      items: DEFAULT_ITEMS,
      collections: DEFAULT_COLLECTIONS,
      selectedId: DEFAULT_ITEMS[0]?.id ?? null,
      selectedCollectionId: DEFAULT_COLLECTIONS[0]?.id ?? null,
      counts: {},
      dailyTapCounts: {},
      hasHydrated: false,

      markHydrated: () => set({ hasHydrated: true }),

      select: (id) => set({ selectedId: id }),

      increment: (id) =>
        set((s) => {
          const now = new Date();
          const dateKey = now.toISOString().slice(0, 10); // YYYY-MM-DD
          return {
            counts: { ...s.counts, [id]: (s.counts[id] ?? 0) + 1 },
            dailyTapCounts: {
              ...s.dailyTapCounts,
              [dateKey]: (s.dailyTapCounts[dateKey] ?? 0) + 1,
            },
          };
        }),

      decrement: (id) =>
        set((s) => ({
          counts: { ...s.counts, [id]: Math.max(0, (s.counts[id] ?? 0) - 1) },
        })),

      reset: (id) =>
        set((s) => ({ counts: { ...s.counts, [id]: 0 } })),

      overrideCount: (id, newCount) =>
        set((s) => ({ counts: { ...s.counts, [id]: newCount } })),

      selectCollection: (collectionId) => {
        const { collections, items, counts } = get();
        const collection = collections.find((c) => c.id === collectionId);
        if (!collection) return;
        const targetId = resolveSmartResume(collection, items, counts);
        set({ selectedCollectionId: collectionId, selectedId: targetId });
      },

      restartCollection: (collectionId) => {
        const { collections } = get();
        const collection = collections.find((c) => c.id === collectionId);
        if (!collection) return;

        set((s) => {
          const nextCounts = { ...s.counts };
          for (const tid of collection.tasbeehIds) {
            nextCounts[tid] = 0;
          }
          return {
            selectedCollectionId: collectionId,
            selectedId: collection.tasbeehIds[0] ?? null,
            counts: nextCounts,
          };
        });
      },

      advanceInCollection: () => {
        const { selectedCollectionId, selectedId, collections, items, counts } = get();
        const collection = collections.find((c) => c.id === selectedCollectionId);
        if (!collection || !selectedId) return;

        const currentIndex = collection.tasbeehIds.indexOf(selectedId);
        const nextId = collection.tasbeehIds[currentIndex + 1] ?? null;

        // If there's a next item, advance to it
        if (nextId) {
          set({ selectedId: nextId });
        }
        // If null, we're at the last — caller can detect this via isCollectionComplete
      },

      addTasbeehToCollection: (collectionId, tasbeeh) =>
        set((s) => {
          const newTasbeeh = { ...tasbeeh, id: crypto.randomUUID() };
          const collections = s.collections.map((c) =>
            c.id === collectionId
              ? { ...c, tasbeehIds: [...c.tasbeehIds, newTasbeeh.id] }
              : c,
          );
          return {
            items: [...s.items, newTasbeeh],
            collections,
          };
        }),

      updateTasbeeh: (id, updates) =>
        set((s) => ({
          items: s.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item,
          ),
        })),

      removeTasbeehFromCollection: (collectionId, tasbeehId) =>
        set((s) => {
          // Remove from collection's list
          const collections = s.collections.map((c) =>
            c.id === collectionId
              ? { ...c, tasbeehIds: c.tasbeehIds.filter((id) => id !== tasbeehId) }
              : c,
          );
          // Remove tasbeeh item and its count
          const items = s.items.filter((i) => i.id !== tasbeehId);
          const counts = { ...s.counts };
          delete counts[tasbeehId];

          // If we were counting this tasbeeh, smart-resume to next
          const newSelectedId =
            s.selectedId === tasbeehId
              ? (collections.find((c) => c.id === collectionId)?.tasbeehIds[0] ?? null)
              : s.selectedId;

          return { collections, items, counts, selectedId: newSelectedId };
        }),

      addCollection: (title) =>
        set((s) => ({
          collections: [
            ...s.collections,
            { id: crypto.randomUUID(), title, tasbeehIds: [] },
          ],
        })),

      updateCollection: (id, updates) =>
        set((s) => ({
          collections: s.collections.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        })),

      removeCollection: (id) =>
        set((s) => {
          const collection = s.collections.find((c) => c.id === id);
          if (!collection) return s;

          // Remove all tasbeeh that belong exclusively to this collection
          const idsToRemove = new Set(collection.tasbeehIds);
          const items = s.items.filter((i) => !idsToRemove.has(i.id));
          const counts = { ...s.counts };
          idsToRemove.forEach((tid) => delete counts[tid]);

          const collections = s.collections.filter((c) => c.id !== id);
          const newSelectedCollectionId =
            s.selectedCollectionId === id
              ? (collections[0]?.id ?? null)
              : s.selectedCollectionId;

          return { collections, items, counts, selectedCollectionId: newSelectedCollectionId };
        }),

      resetAll: () =>
        set({
          items: DEFAULT_ITEMS,
          collections: DEFAULT_COLLECTIONS,
          selectedId: DEFAULT_ITEMS[0]?.id ?? null,
          selectedCollectionId: DEFAULT_COLLECTIONS[0]?.id ?? null,
          counts: {},
          dailyTapCounts: {},
        }),
    }),
    {
      name: STORAGE_KEYS.tasbeehStore,
      version: 2, // bumped — schema changed
      partialize: (s) => ({
        selectedId: s.selectedId,
        selectedCollectionId: s.selectedCollectionId,
        counts: s.counts,
        dailyTapCounts: s.dailyTapCounts,
        items: s.items,
        collections: s.collections,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
      merge: (persisted, current) => {
        const p = persisted as Partial<TasbeehState> | undefined;
        return {
          ...current,
          ...p,
          items:
            Array.isArray(p?.items) && p.items.length > 0
              ? p.items
              : current.items,
          collections:
            Array.isArray(p?.collections) && p.collections.length > 0
              ? p.collections
              : current.collections,
        };
      },
      migrate: (persisted, version) => {
        // v1 → v2: wrap existing flat items into the default collection
        if (version === 1) {
          const old = persisted as { items?: Tasbeeh[]; selectedId?: string; counts?: TasbeehCounts };
          return {
            ...old,
            collections: DEFAULT_COLLECTIONS,
            selectedCollectionId: DEFAULT_COLLECTIONS[0]?.id ?? null,
          };
        }
        return persisted;
      },
    },
  ),
);

// Selectors

export function getSelectedTasbeeh(state: TasbeehState) {
  if (!state.selectedId) return null;
  return state.items.find((x) => x.id === state.selectedId) ?? null;
}

/** Returns the next tasbeeh in the active collection queue after the current selectedId, or null if last. */
export function getNextInCollection(state: TasbeehState): Tasbeeh | null {
  const collection = state.collections.find((c) => c.id === state.selectedCollectionId);
  if (!collection || !state.selectedId) return null;
  const currentIndex = collection.tasbeehIds.indexOf(state.selectedId);
  const nextId = collection.tasbeehIds[currentIndex + 1];
  return nextId ? (state.items.find((i) => i.id === nextId) ?? null) : null;
}

/** True when every tasbeeh in the active collection has count >= targetCount. */
export function isCollectionComplete(state: TasbeehState): boolean {
  const collection = state.collections.find((c) => c.id === state.selectedCollectionId);
  if (!collection) return false;
  return collection.tasbeehIds.every((tid) => {
    const item = state.items.find((i) => i.id === tid);
    return item && (state.counts[tid] ?? 0) >= item.targetCount;
  });
}

export function getCollectionProgress(state: TasbeehState, collectionId: CollectionId) {
  const collection = state.collections.find((c) => c.id === collectionId);
  if (!collection) return { completed: 0, total: 0, isComplete: false };

  const total = collection.tasbeehIds.length;
  const completed = collection.tasbeehIds.filter((tid) => {
    const item = state.items.find((i) => i.id === tid);
    if (!item) return false;
    return (state.counts[tid] ?? 0) >= item.targetCount;
  }).length;

  return { completed, total, isComplete: total > 0 && completed === total };
}
