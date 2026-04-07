import {
  collection,
  onSnapshot,
  doc,
  getDocs,
  setDoc,
  writeBatch,
  type DocumentData,
} from "firebase/firestore";
import type { TasbeehSequenceDoc, Tasbeeh } from "@/shared/types/tasbeehCatalog";
import { FIRESTORE_COLLECTIONS } from "@/shared/config/firestoreCollections";
import { getFirestoreDb } from "@/services/firebase/firestore/instance";

function normalizeTasbeeh(raw: any): Tasbeeh {
  return {
    id: String(raw.id || ""),
    text: String(raw.text || ""),
    transliteration: String(raw.transliteration || ""),
    urdu: raw.urdu || null,
    meaningEn: raw.meaningEn || null,
    target: typeof raw.target === "number" ? raw.target : Number(raw.target) || 100,
    category: Array.isArray(raw.category) ? raw.category : [],
    benefitEn: raw.benefitEn || null,
    reference: raw.reference || null,
  };
}

/** Map Firestore document → TasbeehSequenceDoc */
export function firestoreDocToSequenceDoc(
  id: string,
  data: DocumentData,
): TasbeehSequenceDoc {
  const d = data as Record<string, unknown>;
  const rawItems = Array.isArray(d.items) ? d.items : [];

  return {
    id: String(d.id ?? id),
    title: String(d.title ?? "Untitled Sequence"),
    items: rawItems.map(normalizeTasbeeh),
    createdBy: String(d.createdBy ?? "unknown"),
    isDefault: Boolean(d.isDefault),
    synced: true,
  };
}

function serializeSequenceForFirestore(row: TasbeehSequenceDoc): DocumentData {
  return {
    id: row.id,
    title: row.title,
    items: row.items, // Flat objects in Firestore as part of this sequence document
    isDefault: row.isDefault || false,
    createdBy: row.createdBy || "system",
  };
}

export const tasbeehRemote = {
  async getAll(): Promise<TasbeehSequenceDoc[]> {
    const db = getFirestoreDb();
    if (!db) throw new Error("Firestore not available");

    const col = collection(db, FIRESTORE_COLLECTIONS.tasbeehs);
    const snap = await getDocs(col);
    return snap.docs.map((d) => firestoreDocToSequenceDoc(d.id, d.data()));
  },

  async save(item: TasbeehSequenceDoc): Promise<void> {
    const db = getFirestoreDb();
    if (!db) throw new Error("Firestore not available");

    const docRef = doc(db, FIRESTORE_COLLECTIONS.tasbeehs, item.id);
    await setDoc(docRef, serializeSequenceForFirestore(item));
  },

  onCatalogChange(callback: (docs: TasbeehSequenceDoc[]) => void) {
    const db = getFirestoreDb();
    if (!db) return () => {};

    const col = collection(db, FIRESTORE_COLLECTIONS.tasbeehs);
    return onSnapshot(col, (snap) => {
      const docs = snap.docs.map((d) =>
        firestoreDocToSequenceDoc(d.id, d.data()),
      );
      callback(docs);
    });
  },

  async seedCatalog(sequences: TasbeehSequenceDoc[]): Promise<void> {
    const db = getFirestoreDb();
    if (!db) throw new Error("Firestore not available");

    const col = collection(db, FIRESTORE_COLLECTIONS.tasbeehs);
    let batch = writeBatch(db);
    let count = 0;

    for (const seq of sequences) {
      const docRef = doc(col, seq.id);
      batch.set(docRef, serializeSequenceForFirestore(seq), { merge: true });
      count++;

      if (count >= 450) {
        await batch.commit();
        batch = writeBatch(db);
        count = 0;
      }
    }

    if (count > 0) {
      await batch.commit();
    }
  },
};
