import {
  collection,
  onSnapshot,
  writeBatch,
  doc,
  type DocumentData,
} from "firebase/firestore";
import type { TasbeehSequenceDoc, Tasbeeh } from "@/shared/types/tasbeehCatalog";
import { FIRESTORE_COLLECTIONS } from "@/shared/config/firestoreCollections";
import { TASBEEH_CATALOG_SEED } from "@/shared/config/tasbeehCatalogSeed";
import { getFirestoreDb } from "@/services/firebase/firestore/instance";

let catalogUnsubscribe: (() => void) | null = null;
let catalogListenerUid: string | null = null;

function nn(v: unknown): string | null {
  if (v === undefined || v === null || v === "") return null;
  return String(v);
}

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
    id: nn(d.id) ?? id,
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
    items: row.items,
    isDefault: row.isDefault || false,
    createdBy: row.createdBy || "system",
  };
}

/** Dev/admin: write seed sequences to Firestore. */
export async function seedTasbeehCatalogFromLocal(): Promise<void> {
  const db = getFirestoreDb();
  if (!db) throw new Error("Firestore not available");

  const col = collection(db, FIRESTORE_COLLECTIONS.tasbeehs);
  let batch = writeBatch(db);
  let n = 0;
  
  for (const seq of TASBEEH_CATALOG_SEED) {
    const docRef = doc(col, seq.id);
    batch.set(docRef, serializeSequenceForFirestore(seq), { merge: true });
    n++;
    if (n >= 400) {
      await batch.commit();
      batch = writeBatch(db);
      n = 0;
    }
  }
  if (n > 0) await batch.commit();
}

export function attachTasbeehCatalogListener(
  uid: string,
  onDocs: (docs: TasbeehSequenceDoc[]) => void,
): void {
  const db = getFirestoreDb();
  if (!db) return;

  if (catalogListenerUid === uid && catalogUnsubscribe) return;

  catalogUnsubscribe?.();
  catalogListenerUid = uid;

  const col = collection(db, FIRESTORE_COLLECTIONS.tasbeehs);
  catalogUnsubscribe = onSnapshot(
    col,
    (snap) => {
      const docs = snap.docs.map((d) =>
        firestoreDocToSequenceDoc(d.id, d.data()),
      );
      onDocs(docs);
    },
    () => {
      /* rules / permission errors — listener stays off until next sign-in */
    },
  );
}

export function stopTasbeehCatalogListener(): void {
  catalogUnsubscribe?.();
  catalogUnsubscribe = null;
  catalogListenerUid = null;
}
