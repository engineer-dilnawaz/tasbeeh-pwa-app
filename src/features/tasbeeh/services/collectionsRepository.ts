import {
  DEVICE_USER_ID,
  tasbeehDb,
  type CollectionItemRow,
  type TasbeehCollectionGroupRow,
  type TasbeehPhraseRow,
} from "@/features/tasbeeh/services/tasbeehDb";

const nowIso = () => new Date().toISOString();

const createId = () => {
  if ("randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

export async function bootstrapCollectionsDb() {
  // We no longer automatically add default collections to ensure a clean slate.
  // Users can create their own or discover from an external source in the future.
  return;
}

export async function listCollections(userId: string = DEVICE_USER_ID) {
  await bootstrapCollectionsDb();
  return await tasbeehDb.tasbeehCollections
    .where("userId")
    .equals(userId)
    .and((row) => !row.isArchived)
    .sortBy("sortOrder");
}

export async function getCollectionDetails(
  collectionId: string,
  userId: string = DEVICE_USER_ID,
) {
  await bootstrapCollectionsDb();
  const collection = await tasbeehDb.tasbeehCollections.get(collectionId);
  if (!collection || collection.userId !== userId) return null;

  const items = await tasbeehDb.collectionItems
    .where("collectionId")
    .equals(collectionId)
    .sortBy("sortOrder");

  const phraseIds = items.map((it) => it.phraseId);
  const phrases = await tasbeehDb.tasbeehPhrases.bulkGet(phraseIds);

  const phrasesById = new Map(
    phrases.filter(Boolean).map((p) => [p!.id, p!] as const),
  );

  return {
    collection,
    items: items.map((it) => ({
      ...it,
      phrase: phrasesById.get(it.phraseId) ?? null,
    })),
  };
}

export async function listPhrases(userId: string = DEVICE_USER_ID) {
  await bootstrapCollectionsDb();

  const rows = await tasbeehDb.tasbeehPhrases
    .where("userId")
    .equals(userId)
    .and((row) => !row.isArchived)
    .toArray();

  return rows.sort((a, b) =>
    a.transliteration.localeCompare(b.transliteration),
  );
}

export async function createPhrase(
  draft: Pick<TasbeehPhraseRow, "transliteration"> &
    Partial<Pick<TasbeehPhraseRow, "arabic" | "translation">>,
  userId: string = DEVICE_USER_ID,
) {
  await bootstrapCollectionsDb();
  const timestamp = nowIso();

  const row: TasbeehPhraseRow = {
    id: createId(),
    userId,
    arabic: draft.arabic ?? "",
    transliteration: draft.transliteration.trim(),
    translation: draft.translation ?? null,
    isNewlyCreated: true,
    isArchived: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    syncStatus: "pending",
  };

  await tasbeehDb.tasbeehPhrases.put(row);
  return row;
}

export async function updatePhrase(
  id: string,
  draft: Pick<TasbeehPhraseRow, "transliteration"> &
    Partial<Pick<TasbeehPhraseRow, "arabic" | "translation">>,
  userId: string = DEVICE_USER_ID,
) {
  await bootstrapCollectionsDb();
  const existing = await tasbeehDb.tasbeehPhrases.get(id);
  if (!existing || existing.userId !== userId) {
    throw new Error("Phrase not found.");
  }

  const timestamp = nowIso();
  const translationNext =
    draft.translation !== undefined
      ? (() => {
          const s = String(draft.translation ?? "").trim();
          return s.length > 0 ? s : null;
        })()
      : existing.translation;
  const arabicNext =
    draft.arabic !== undefined ? draft.arabic : existing.arabic;

  const next: TasbeehPhraseRow = {
    ...existing,
    transliteration: draft.transliteration.trim(),
    arabic: arabicNext,
    translation: translationNext,
    updatedAt: timestamp,
    syncStatus:
      existing.syncStatus === "synced" ? "pending" : existing.syncStatus,
  };

  await tasbeehDb.tasbeehPhrases.put(next);
  return next;
}

export interface CreateCollectionParams {
  title: string;
  description?: string | null;
  scheduleType: TasbeehCollectionGroupRow["scheduleType"];
  timesPerDay?: number;
  slots: TasbeehCollectionGroupRow["slots"];
  slotExpiryPolicy?: TasbeehCollectionGroupRow["slotExpiryPolicy"];
  priority: TasbeehCollectionGroupRow["priority"];
  reminderPolicy?: TasbeehCollectionGroupRow["reminderPolicy"];
  tags?: string[];
  reference?: TasbeehCollectionGroupRow["reference"];
  items: Array<Pick<CollectionItemRow, "role" | "phraseId" | "targetCount">>;
  userId?: string;
}

export async function createCollection(params: CreateCollectionParams) {
  const userId = params.userId ?? DEVICE_USER_ID;
  await bootstrapCollectionsDb();

  const timestamp = nowIso();
  const id = createId();

  const existing = await tasbeehDb.tasbeehCollections
    .where("userId")
    .equals(userId)
    .sortBy("sortOrder");
  const nextSortOrder = (existing.at(-1)?.sortOrder ?? -1) + 1;

  const collection: TasbeehCollectionGroupRow = {
    id,
    userId,
    title: params.title.trim(),
    description: params.description ?? null,
    scheduleType: params.scheduleType,
    timesPerDay:
      params.timesPerDay ??
      (params.scheduleType === "prayer_specific"
        ? (params.slots?.length ?? 5)
        : 1),
    slots: params.scheduleType === "prayer_specific" ? params.slots : null,
    slotExpiryPolicy:
      params.slotExpiryPolicy ??
      (params.scheduleType === "prayer_specific" ? "next_prayer" : "day_end"),
    priority: params.priority,
    reminderPolicy: params.reminderPolicy ?? "gentle",
    tags: params.tags ?? [],
    reference: params.reference ?? { sourceType: "none" },
    isDefault: false,
    isArchived: false,
    sortOrder: nextSortOrder,
    createdAt: timestamp,
    updatedAt: timestamp,
    syncStatus: "pending",
  };

  const items: CollectionItemRow[] = params.items.map((it, index) => ({
    id: `${id}:${it.role}:${it.phraseId}:${index}`,
    userId,
    collectionId: id,
    phraseId: it.phraseId,
    role: it.role,
    targetCount: it.targetCount,
    sortOrder: index,
    createdAt: timestamp,
    updatedAt: timestamp,
    syncStatus: "pending",
  }));

  await tasbeehDb.transaction(
    "rw",
    tasbeehDb.tasbeehCollections,
    tasbeehDb.collectionItems,
    async () => {
      await tasbeehDb.tasbeehCollections.put(collection);
      await tasbeehDb.collectionItems.bulkPut(items);
    },
  );

  return collection;
}

export interface UpdateCollectionParams {
  id: string;
  title?: string;
  description?: string | null;
  scheduleType?: TasbeehCollectionGroupRow["scheduleType"];
  timesPerDay?: number;
  slots?: TasbeehCollectionGroupRow["slots"];
  slotExpiryPolicy?: TasbeehCollectionGroupRow["slotExpiryPolicy"];
  priority?: TasbeehCollectionGroupRow["priority"];
  reminderPolicy?: TasbeehCollectionGroupRow["reminderPolicy"];
  tags?: string[];
  reference?: TasbeehCollectionGroupRow["reference"];
  items?: Array<Pick<CollectionItemRow, "role" | "phraseId" | "targetCount">>;
  userId?: string;
}

export async function updateCollection(params: UpdateCollectionParams) {
  const userId = params.userId ?? DEVICE_USER_ID;
  await bootstrapCollectionsDb();

  const existing = await tasbeehDb.tasbeehCollections.get(params.id);
  if (!existing || existing.userId !== userId) {
    throw new Error("Collection not found.");
  }

  const timestamp = nowIso();

  const updated: TasbeehCollectionGroupRow = {
    ...existing,
    title: params.title?.trim() ?? existing.title,
    description:
      params.description !== undefined
        ? params.description
        : existing.description,
    scheduleType: params.scheduleType ?? existing.scheduleType,
    timesPerDay: params.timesPerDay ?? existing.timesPerDay,
    slots: params.slots !== undefined ? params.slots : existing.slots,
    slotExpiryPolicy: params.slotExpiryPolicy ?? existing.slotExpiryPolicy,
    priority: params.priority ?? existing.priority,
    reminderPolicy: params.reminderPolicy ?? existing.reminderPolicy,
    tags: params.tags ?? existing.tags,
    reference:
      params.reference !== undefined ? params.reference : existing.reference,
    updatedAt: timestamp,
    syncStatus:
      existing.syncStatus === "synced" ? "pending" : existing.syncStatus,
  };

  await tasbeehDb.transaction(
    "rw",
    tasbeehDb.tasbeehCollections,
    tasbeehDb.collectionItems,
    async () => {
      await tasbeehDb.tasbeehCollections.put(updated);

      if (params.items) {
        await tasbeehDb.collectionItems
          .where("collectionId")
          .equals(params.id)
          .delete();

        const newItems: CollectionItemRow[] = params.items.map((it, index) => ({
          id: `${params.id}:${it.role}:${it.phraseId}:${index}`,
          userId,
          collectionId: params.id,
          phraseId: it.phraseId,
          role: it.role,
          targetCount: it.targetCount,
          sortOrder: index,
          createdAt: timestamp,
          updatedAt: timestamp,
          syncStatus: "pending",
        }));

        await tasbeehDb.collectionItems.bulkPut(newItems);
      }
    },
  );

  return updated;
}

export async function archiveCollection(
  id: string,
  userId: string = DEVICE_USER_ID,
) {
  await bootstrapCollectionsDb();

  const existing = await tasbeehDb.tasbeehCollections.get(id);
  if (!existing || existing.userId !== userId) {
    throw new Error("Collection not found.");
  }

  const timestamp = nowIso();
  await tasbeehDb.tasbeehCollections.update(id, {
    isArchived: true,
    updatedAt: timestamp,
    syncStatus:
      existing.syncStatus === "synced" ? "pending" : existing.syncStatus,
  });
}
