import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firestore";

/**
 * Tasbeeh Repository
 * 
 * Handles all Firestore-specific data operations for Tasbeeh zikr.
 * Pattern: Isolated DB logic, no UI knowledge.
 */
const getUserDocRef = (userId: string) =>
  doc(db, "users", userId);

export const saveTasbeehToCloud = async (
  userId: string,
  data: any
) => {
  try {
    await setDoc(getUserDocRef(userId), {
      tasbeeh: data,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error("Failed to save tasbeeh to cloud:", error);
    throw error;
  }
};

export const getTasbeehFromCloud = async (
  userId: string
) => {
  try {
    const snap = await getDoc(getUserDocRef(userId));
    if (!snap.exists()) return null;
    return snap.data().tasbeeh;
  } catch (error) {
    console.error("Failed to fetch tasbeeh from cloud:", error);
    return null;
  }
};
