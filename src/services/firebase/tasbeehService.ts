import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";
import type { TasbeehEntry } from "@/features/tasbeeh/types";
import { updateUserStats } from "./userService";
import { logger } from "@/shared/utils/logger";

const ENTRIES_COLLECTION = "tasbeeh-entries";

/**
 * Logs a new tasbeeh session entry and updates the user's aggregated stats.
 * This is the primary way to save progress to the cloud.
 */
export const logTasbeehSession = async (entry: Omit<TasbeehEntry, "timestamp" | "id">) => {
  try {
    // 1. Create the detailed ledger entry
    const entryData = {
      ...entry,
      timestamp: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, ENTRIES_COLLECTION), entryData);

    // 2. Update the user's summary stats (Atomic)
    await updateUserStats(entry.userId, entry.countReached);

    return docRef.id;
  } catch (error) {
    logger.error("TasbeehService: Error logging session", error);
    throw error;
  }
};

/**
 * Fetches the most recent tasbeeh entries for a specific user.
 * Typically used for the Stats/History page.
 */
export const getUserTasbeehHistory = async (userId: string, count: number = 20) => {
  try {
    const q = query(
      collection(db, ENTRIES_COLLECTION),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(count)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TasbeehEntry[];
  } catch (error) {
    logger.error("TasbeehService: Error fetching history", error);
    throw error;
  }
};
