import { create } from "zustand";
import type { Tasbeeh } from "./types";
import { persistTasbeeh, hydrateTasbeeh } from "@/services/sync/tasbeehSync";

/**
 * Tasbeeh Store (CRUD Layer)
 * 
 * Manages full lifecycle of tasbeeh items: create, read, update, delete.
 * All operations trigger background sync via the Sync Layer.
 */
interface TasbeehStore {
  userId: string | null;
  tasbeehList: Tasbeeh[];
  loading: boolean;
  
  setUser: (id: string | null) => void;
  hydrate: () => Promise<void>;
  increment: (id: string) => void;
  reset: (id: string) => void;
  
  // CRUD Actions
  addTasbeeh: (data: { title: string; target: number }) => void;
  updateTasbeeh: (id: string, data: { title: string; target: number }) => void;
  deleteTasbeeh: (id: string) => void;
}

const DEFAULT_TASBEEH: Tasbeeh[] = [
  { id: "1", title: "SubhanAllah", target: 33, count: 0 },
  { id: "2", title: "Alhamdulillah", target: 33, count: 0 },
  { id: "3", title: "Allahu Akbar", target: 34, count: 0 },
];

export const useTasbeehStore = create<TasbeehStore>((set, get) => ({
  userId: null,
  tasbeehList: [],
  loading: false,

  setUser: (id) => set({ userId: id }),

  hydrate: async () => {
    const { userId } = get();
    if (!userId) return;

    set({ loading: true });

    try {
      const data = await hydrateTasbeeh(userId);
      if (data && data.length > 0) {
        set({ tasbeehList: data });
      } else {
        set({ tasbeehList: DEFAULT_TASBEEH });
        persistTasbeeh(DEFAULT_TASBEEH, userId);
      }
    } finally {
      set({ loading: false });
    }
  },

  increment: (id) => {
    const { tasbeehList, userId } = get();
    const updated = tasbeehList.map((item) =>
      item.id === id ? { ...item, count: item.count + 1 } : item
    );

    set({ tasbeehList: updated });
    persistTasbeeh(updated, userId);
  },

  reset: (id) => {
    const { tasbeehList, userId } = get();
    const updated = tasbeehList.map((item) =>
      item.id === id ? { ...item, count: 0 } : item
    );

    set({ tasbeehList: updated });
    persistTasbeeh(updated, userId);
  },

  addTasbeeh: (data) => {
    const { tasbeehList, userId } = get();
    const newItem: Tasbeeh = {
      id: Date.now().toString(),
      ...data,
      count: 0,
    };

    const updated = [...tasbeehList, newItem];
    set({ tasbeehList: updated });
    persistTasbeeh(updated, userId);
  },

  updateTasbeeh: (id, data) => {
    const { tasbeehList, userId } = get();
    const updated = tasbeehList.map((item) =>
      item.id === id ? { ...item, ...data } : item
    );

    set({ tasbeehList: updated });
    persistTasbeeh(updated, userId);
  },

  deleteTasbeeh: (id) => {
    const { tasbeehList, userId } = get();
    const updated = tasbeehList.filter((item) => item.id !== id);

    set({ tasbeehList: updated });
    persistTasbeeh(updated, userId);
  },
}));
