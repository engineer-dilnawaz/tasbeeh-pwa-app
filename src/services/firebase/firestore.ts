import { getFirestore } from "firebase/firestore";
import { app } from "./config";

/**
 * Firestore Database Instance
 * 
 * Shared instance for all repository services.
 */
export const db = getFirestore(app);
