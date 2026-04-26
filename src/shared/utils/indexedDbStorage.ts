import { tasbeehDb } from "@/features/tasbeeh/services/tasbeehDb";
import { type StateStorage } from "zustand/middleware";

/**
 * A Zustand-compatible storage implementation that uses IndexedDB (via Dexie).
 * This replaces localStorage entirely, ensuring async, persistent, and large storage support.
 */
export const indexedDbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const row = await tasbeehDb.kvStore.get(name);
    return row ? JSON.stringify(row.value) : null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await tasbeehDb.kvStore.put({ key: name, value: JSON.parse(value) });
  },
  removeItem: async (name: string): Promise<void> => {
    await tasbeehDb.kvStore.delete(name);
  },
};
