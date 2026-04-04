import { getFirestore, type Firestore } from "firebase/firestore";
import { app } from "../app";

let firestore: Firestore | null = null;

if (app) {
  firestore = getFirestore(app);
}

export function getFirestoreDb(): Firestore | null {
  return firestore;
}

export function isFirestoreAvailable(): boolean {
  return firestore !== null;
}
