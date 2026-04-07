import {
  collection,
  onSnapshot,
  writeBatch,
  doc,
  type DocumentData,
} from "firebase/firestore";
import type { TasbeehCatalogDoc } from "@/shared/types/tasbeehCatalog";
import { FIRESTORE_COLLECTIONS } from "@/shared/config/firestoreCollections";
import { TASBEEH_CATALOG_SEED } from "@/shared/config/tasbeehCatalogSeed";
import { getFirestoreDb } from "@/services/firebase/firestore/instance";

let catalogUnsubscribe: (() => void) | null = null;
let catalogListenerUid: string | null = null;

function nn(v: unknown): string | null {
  if (v === undefined || v === null || v === "") return null;
  return String(v);
}

function normalizeReference(
  raw: DocumentData | undefined,
): TasbeehCatalogDoc["reference"] {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const hadith = nn(o.hadith);
  const grade = nn(o.grade);
  const description = nn(o.description);
  if (!hadith && !grade && !description) return null;
  return { hadith, grade, description };
}

/** Map Firestore document → app catalog row */
export function firestoreDocToCatalogDoc(
  id: string,
  data: DocumentData,
): TasbeehCatalogDoc {
  const d = data as Record<string, unknown>;
  const cats = d.category;
  const category = Array.isArray(cats)
    ? cats.map((c) => String(c))
    : cats
      ? [String(cats)]
      : [];

  return {
    id: nn(d.id) ?? id,
    text: String(d.text ?? ""),
    transliteration: String(d.transliteration ?? ""),
    meaningEn: nn(d.meaningEn),
    urdu: d.urdu !== undefined ? nn(d.urdu) : null,
    category,
    target: typeof d.target === "number" ? d.target : Number(d.target) || 100,
    reference: normalizeReference(d.reference as DocumentData | undefined),
    isDefault: Boolean(d.isDefault),
    createdBy: String(d.createdBy ?? "unknown"),
    priority:
      d.priority === undefined || d.priority === null
        ? null
        : Number(d.priority),
  };
}

function serializeCatalogForFirestore(row: TasbeehCatalogDoc): DocumentData {
  const ref = row.reference;
  return {
    id: row.id,
    text: row.text,
    transliteration: row.transliteration,
    meaningEn: row.meaningEn ?? null,
    urdu: row.urdu ?? null,
    category: row.category ?? [],
    target: row.target,
    reference: ref
      ? {
          hadith: ref.hadith ?? null,
          grade: ref.grade ?? null,
          description: ref.description ?? null,
        }
      : null,
    isDefault: row.isDefault,
    createdBy: row.createdBy,
    priority: row.priority ?? null,
  };
}

/** Dev/admin: write seed documents to `tasbeehs/{id}` (merge: full replace per doc). */
export async function seedTasbeehCatalogFromLocal(): Promise<void> {
  const db = getFirestoreDb();
  if (!db) throw new Error("Firestore not available");

  const col = collection(db, FIRESTORE_COLLECTIONS.tasbeehs);
  let batch = writeBatch(db);
  let n = 0;
  const commitChunks = async () => {
    await batch.commit();
    batch = writeBatch(db);
    n = 0;
  };

  for (const row of TASBEEH_CATALOG_SEED) {
    const docRef = doc(col, row.id);
    batch.set(docRef, serializeCatalogForFirestore(row));
    n++;
    if (n >= 400) {
      await commitChunks();
    }
  }
  if (n > 0) await commitChunks();
}

export function attachTasbeehCatalogListener(
  uid: string,
  onDocs: (docs: TasbeehCatalogDoc[]) => void,
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
        firestoreDocToCatalogDoc(d.id, d.data()),
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
