import Dexie, { type Table } from "dexie";
import type { TasbeehSequenceDoc } from "@/shared/types/tasbeehCatalog";

export class TasbeehDatabase extends Dexie {
  sequences!: Table<TasbeehSequenceDoc>;

  constructor() {
    super("TasbeehDB_v2"); // New version
    this.version(1).stores({
      sequences: "id, synced, updatedAt, isDefault, createdBy",
    });
  }
}

export const db = new TasbeehDatabase();

/**
 * Local Data Source for Tasbeeh Sequences (Sets)
 */
export const tasbeehLocal = {
  async getAll(): Promise<TasbeehSequenceDoc[]> {
    return db.sequences.toArray();
  },

  async bulkPut(items: TasbeehSequenceDoc[]): Promise<void> {
    await db.sequences.bulkPut(items);
  },

  async put(item: TasbeehSequenceDoc): Promise<string> {
    return db.sequences.put(item);
  },

  async delete(id: string): Promise<void> {
    await db.sequences.delete(id);
  },

  async clear(): Promise<void> {
    await db.sequences.clear();
  },

  /**
   * Returns sequences that haven't been synchronized with Firestore yet.
   */
  async getUnsynced(): Promise<TasbeehSequenceDoc[]> {
    // Dexie: if boolean index is used, we check .equals(0) or .equals(false)
    // Here we just use the synced property to check unsynced items.
    return db.sequences.where("synced").equals(0).toArray();
  },

  async markSynced(id: string): Promise<void> {
    await db.sequences.update(id, { synced: true });
  },
};
