/**
 * Firestore client (`getFirestoreDb`). Import helpers (`doc`, `getDoc`, …) from `firebase/firestore`
 * or add re-exports here when the app standardizes on specific patterns.
 */
export type { Firestore } from "firebase/firestore";
export { getFirestoreDb, isFirestoreAvailable } from "./instance";
