import {
  DEVICE_USER_ID,
  tasbeehDb,
  type CollectionItemRow,
  type TasbeehCollectionGroupRow,
  type TasbeehPhraseRow,
} from "@/features/tasbeeh/services/tasbeehDb";

const FATIMA_COLLECTION_ID = "tasbeeh_fatima";

const nowIso = () => new Date().toISOString();

const createId = () => {
  if ("randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

const DEFAULT_PHRASES: Omit<TasbeehPhraseRow, "createdAt" | "updatedAt">[] = [
  {
    id: "subhanallah",
    userId: DEVICE_USER_ID,
    arabic: "سُبْحَانَ ٱللَّٰهِ",
    transliteration: "SubhanAllah",
    translation: "Glory be to Allah",
    isArchived: false,
    syncStatus: "local",
  },
  {
    id: "alhamdulillah",
    userId: DEVICE_USER_ID,
    arabic: "ٱلْحَمْدُ لِلَّٰهِ",
    transliteration: "Alhamdulillah",
    translation: "All praise is due to Allah",
    isArchived: false,
    syncStatus: "local",
  },
  {
    id: "allahuakbar",
    userId: DEVICE_USER_ID,
    arabic: "ٱللَّٰهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    translation: "Allah is the Greatest",
    isArchived: false,
    syncStatus: "local",
  },
  {
    id: "durood",
    userId: DEVICE_USER_ID,
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
    transliteration: "Allahumma salli 'ala Muhammad wa 'ala aali Muhammad",
    translation: "O Allah, send blessings upon Muhammad and the family of Muhammad",
    isArchived: false,
    syncStatus: "local",
  },
];

const DEFAULT_COLLECTIONS: Omit<TasbeehCollectionGroupRow, "createdAt" | "updatedAt">[] =
  [
    {
      id: FATIMA_COLLECTION_ID,
      userId: DEVICE_USER_ID,
      title: "Tasbeeh Fatima",
      description: null,
      scheduleType: "prayer_specific",
      timesPerDay: 5,
      slots: ["fajr", "dhuhr", "asr", "maghrib", "isha"],
      slotExpiryPolicy: "next_prayer",
      priority: "high",
      reminderPolicy: "gentle",
      tags: ["after-prayer", "daily"],
      reference: { sourceType: "none" },
      isDefault: true,
      isArchived: false,
      sortOrder: 0,
      syncStatus: "local",
    },
  ];

const DEFAULT_COLLECTION_ITEMS: Omit<CollectionItemRow, "createdAt" | "updatedAt">[] =
  [
    {
      id: `${FATIMA_COLLECTION_ID}:start:durood:-1`,
      userId: DEVICE_USER_ID,
      collectionId: FATIMA_COLLECTION_ID,
      phraseId: "durood",
      role: "start",
      targetCount: 1,
      sortOrder: -1,
      syncStatus: "local",
    },
    {
      id: `${FATIMA_COLLECTION_ID}:main:subhanallah:0`,
      userId: DEVICE_USER_ID,
      collectionId: FATIMA_COLLECTION_ID,
      phraseId: "subhanallah",
      role: "main",
      targetCount: 33,
      sortOrder: 0,
      syncStatus: "local",
    },
    {
      id: `${FATIMA_COLLECTION_ID}:main:alhamdulillah:1`,
      userId: DEVICE_USER_ID,
      collectionId: FATIMA_COLLECTION_ID,
      phraseId: "alhamdulillah",
      role: "main",
      targetCount: 33,
      sortOrder: 1,
      syncStatus: "local",
    },
    {
      id: `${FATIMA_COLLECTION_ID}:main:allahuakbar:2`,
      userId: DEVICE_USER_ID,
      collectionId: FATIMA_COLLECTION_ID,
      phraseId: "allahuakbar",
      role: "main",
      targetCount: 34,
      sortOrder: 2,
      syncStatus: "local",
    },
    {
      id: `${FATIMA_COLLECTION_ID}:end:durood:99`,
      userId: DEVICE_USER_ID,
      collectionId: FATIMA_COLLECTION_ID,
      phraseId: "durood",
      role: "end",
      targetCount: 1,
      sortOrder: 99,
      syncStatus: "local",
    },
  ];

export async function bootstrapCollectionsDb() {
  const timestamp = nowIso();
  await tasbeehDb.transaction(
    "rw",
    tasbeehDb.tasbeehCollections,
    tasbeehDb.tasbeehPhrases,
    tasbeehDb.collectionItems,
    async () => {
      // Idempotent bootstrap: ensure defaults exist even if DB was seeded before.
      for (const phrase of DEFAULT_PHRASES) {
        const existing = await tasbeehDb.tasbeehPhrases.get(phrase.id);
        if (existing) continue;
        await tasbeehDb.tasbeehPhrases.put({
          ...phrase,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      }

      for (const collection of DEFAULT_COLLECTIONS) {
        const existing = await tasbeehDb.tasbeehCollections.get(collection.id);
        if (existing) continue;
        await tasbeehDb.tasbeehCollections.put({
          ...collection,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      }

      for (const item of DEFAULT_COLLECTION_ITEMS) {
        const existing = await tasbeehDb.collectionItems.get(item.id);
        if (existing) continue;
        await tasbeehDb.collectionItems.put({
          ...item,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      }
    },
  );
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

  return rows.sort((a, b) => a.transliteration.localeCompare(b.transliteration));
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
    description: params.description !== undefined ? params.description : existing.description,
    scheduleType: params.scheduleType ?? existing.scheduleType,
    timesPerDay: params.timesPerDay ?? existing.timesPerDay,
    slots: params.slots !== undefined ? params.slots : existing.slots,
    slotExpiryPolicy: params.slotExpiryPolicy ?? existing.slotExpiryPolicy,
    priority: params.priority ?? existing.priority,
    reminderPolicy: params.reminderPolicy ?? existing.reminderPolicy,
    tags: params.tags ?? existing.tags,
    reference: params.reference !== undefined ? params.reference : existing.reference,
    updatedAt: timestamp,
    syncStatus: existing.syncStatus === "synced" ? "pending" : existing.syncStatus,
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
    syncStatus: existing.syncStatus === "synced" ? "pending" : existing.syncStatus,
  });
}

