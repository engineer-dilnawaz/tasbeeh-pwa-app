import type { User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { FIRESTORE_COLLECTIONS } from "@/shared/config/firestoreCollections";
import { getFirestoreDb } from "@/services/firebase/firestore/instance";

function resolveDisplayName(user: User): string {
  const fromProfile = user.displayName?.trim();
  if (fromProfile) return fromProfile;
  if (user.email) {
    const local = user.email.split("@")[0]?.trim();
    if (local) return local;
  }
  if (user.isAnonymous) return "Guest";
  return "User";
}

/**
 * Upserts `users/{uid}`.
 * - New doc: `name`, `email`, `photoURL` (null when absent), `createdAt` (server).
 * - Existing: merges `name`, `email`, `photoURL` only — never overwrites `createdAt`.
 * Manual email/password users typically have `photoURL === null`; OAuth may set a URL.
 */
export async function syncUserDocument(user: User): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;

  const ref = doc(db, FIRESTORE_COLLECTIONS.users, user.uid);
  const snap = await getDoc(ref);

  const name = resolveDisplayName(user);
  const email = user.email ?? "";
  const photoURL = user.photoURL ?? null;

  if (!snap.exists()) {
    await setDoc(ref, {
      name,
      email,
      photoURL,
      createdAt: serverTimestamp(),
    });
    return;
  }

  await setDoc(
    ref,
    {
      name,
      email,
      photoURL,
    },
    { merge: true },
  );
}
