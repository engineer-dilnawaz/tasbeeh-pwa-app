/**
 * Firestore collection IDs — single source of truth.
 * Add new collections here only after confirming the name with the project owner.
 */
export const FIRESTORE_COLLECTIONS = {
  users: "users",
  /** Global tasbeeh sequences (doc id = sequence id, e.g. `core-collection`) */
  tasbeehs: "tasbeehs",
} as const;

export type FirestoreCollectionName =
  (typeof FIRESTORE_COLLECTIONS)[keyof typeof FIRESTORE_COLLECTIONS];
