import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirestoreDb } from "./firestore";

/** Matches your Firestore collection name. */
export const FIRESTORE_TEST_COLLECTION = "test";

export type FirestoreTestDoc = {
  id: string;
  name?: string;
};

export function useFirestoreTestCollection() {
  const [data, setData] = useState<FirestoreTestDoc[]>([]);
  const [isLoading, setIsLoading] = useState(() => getFirestoreDb() != null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const db = getFirestoreDb();
    if (!db) return;

    const col = collection(db, FIRESTORE_TEST_COLLECTION);
    const unsub = onSnapshot(
      col,
      (snapshot) => {
        const next = snapshot.docs.map((d) => {
          const raw = d.data().name;
          return {
            id: d.id,
            name: raw != null ? String(raw) : undefined,
          };
        });
        setData(next);
        setError(null);
        setIsLoading(false);
      },
      (err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      },
    );

    return unsub;
  }, []);

  return {
    data,
    isLoading,
    isError: error != null,
    error,
  };
}
