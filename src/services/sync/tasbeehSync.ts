import { saveTasbeeh, getTasbeeh } from "../storage/indexedDb";
import {
  saveTasbeehToCloud,
  getTasbeehFromCloud,
} from "../firebase/tasbeehRepo";

/**
 * Tasbeeh Sync Layer (Production Polish)
 * 
 * Orchestrates data flow between Cloud (Firestore) and Local (IndexedDB).
 * Strategy: 
 * 1. Instant local persistence (Optimistic UI)
 * 2. Debounced cloud sync (Reduce network spam)
 */

let syncTimeout: ReturnType<typeof setTimeout> | null = null;

export const hydrateTasbeeh = async (userId?: string) => {
  if (!userId) return null;

  // 1. Try cloud first to get the latest truth
  const cloudData = await getTasbeehFromCloud(userId);

  if (cloudData) {
    // Sync cloud truth back to local cache
    await saveTasbeeh(cloudData);
    return cloudData;
  }

  // 2. Fallback to local cache if offline or no cloud data
  return await getTasbeeh();
};

export const persistTasbeeh = async (
  data: any,
  userId?: string
) => {
  // Always update local cache immediately (Optimistic/Offline-first)
  await saveTasbeeh(data);

  // Sync to cloud if user is authenticated (Debounced)
  if (userId) {
    if (syncTimeout) clearTimeout(syncTimeout);

    syncTimeout = setTimeout(async () => {
      try {
        await saveTasbeehToCloud(userId, data);
      } catch (error) {
        // Silent error handling for background sync
        console.warn("Background sync delayed due to permissions or network.");
      }
    }, 800);
  }
};
