import { tasbeehLocal } from "../services/tasbeeh.local";
import { tasbeehRemote } from "../services/tasbeeh.remote";
import type { TasbeehSequenceDoc } from "@/shared/types/tasbeehCatalog";

/**
 * Coordination Logic for Tasbeeh Sequence Data
 * Local-First Strategy + Remote Sync
 */
export const tasbeehRepository = {
  /**
   * Fetches the full sequence list.
   * Priority: Local DB -> Remote (if online)
   */
  async getAll(): Promise<TasbeehSequenceDoc[]> {
    const localDocs = await tasbeehLocal.getAll();

    // Trigger background sync/fetch if online to keep local updated
    if (navigator.onLine) {
      this.fetchAndSyncRemote().catch(console.error);
    }

    if (localDocs.length > 0) {
      return localDocs;
    }

    // Very first load fallback
    return this.fetchAndSyncRemote();
  },

  /**
   * Internal helper to fetch sequences from Firestore and refresh local DB
   */
  async fetchAndSyncRemote(): Promise<TasbeehSequenceDoc[]> {
    try {
      const remoteDocs = await tasbeehRemote.getAll();
      if (remoteDocs.length > 0) {
        // We sync local to remote state for global/default collections
        await tasbeehLocal.bulkPut(remoteDocs);
      }
      return remoteDocs;
    } catch (error) {
      console.warn("Failed to fetch remote sequences, falling back to local", error);
      return tasbeehLocal.getAll();
    }
  },

  /**
   * Synchronizes all pending (unsynced) sequences to Firestore.
   */
  async syncPending(): Promise<void> {
    if (!navigator.onLine) return;

    const unsynced = await tasbeehLocal.getUnsynced();
    if (unsynced.length === 0) return;

    console.log(`Syncing ${unsynced.length} pending sequences...`);
    
    for (const seq of unsynced) {
      try {
        await tasbeehRemote.save(seq);
        await tasbeehLocal.markSynced(seq.id);
      } catch (error) {
        console.error(`Failed to sync sequence ${seq.id}`, error);
      }
    }
  },

  /**
   * Starts a real-time listener to keep local DB updated 
   * when remote sequences change occurs.
   */
  initRealtimeSync(): () => void {
    if (!navigator.onLine) return () => {};

    const unsub = tasbeehRemote.onCatalogChange(async (docs) => {
      if (docs.length > 0) {
        await tasbeehLocal.bulkPut(docs);
      }
    });

    return unsub;
  },
};

// Global network listener to trigger sync when returning online
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    tasbeehRepository.syncPending().catch(console.error);
  });
}
