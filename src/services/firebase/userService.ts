import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";
import type { UserDocument } from "@/features/auth/types";
import { logger } from "@/shared/utils/logger";

const USERS_COLLECTION = "users";

/**
 * Fetches a user's profile from Firestore.
 */
export const getUserProfile = async (uid: string): Promise<UserDocument | null> => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserDocument;
    }
    return null;
  } catch (error) {
    logger.error("UserService: Error fetching user profile", error);
    throw error;
  }
};

/**
 * Initializes or updates a user profile in Firestore.
 * This is used during signup or the first time a user is seen.
 */
export const createUserProfile = async (uid: string, initialData: Partial<UserDocument>) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const defaultData = {
      uid,
      stats: {
        totalTasbeehCount: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastActiveAt: serverTimestamp(),
      },
      metadata: {
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        appVersion: "1.0.0",
        platform: "web",
        isAnonymous: initialData.metadata?.isAnonymous ?? false,
      },
      ...initialData,
    };

    await setDoc(userRef, defaultData, { merge: true });
  } catch (error) {
    logger.error("UserService: Error creating user profile", error);
    throw error;
  }
};

/**
 * Updates a user's total count and last active timestamp.
 * Uses atomic increment to avoid race conditions.
 */
export const updateUserStats = async (uid: string, countToAdd: number) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      "stats.totalTasbeehCount": increment(countToAdd),
      "stats.lastActiveAt": serverTimestamp(),
      "metadata.lastLoginAt": serverTimestamp(),
    });
  } catch (error) {
    logger.error("UserService: Error updating user stats", error);
    throw error;
  }
};

/**
 * Updates a specific subset of user settings.
 */
export const updateUserSettings = async (uid: string, settingsPatch: Record<string, any>) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, settingsPatch);
  } catch (error) {
    logger.error("UserService: Error updating user settings", error);
    throw error;
  }
};
