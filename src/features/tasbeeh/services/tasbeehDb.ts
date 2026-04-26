import Dexie, { type EntityTable } from "dexie";

export type SyncStatus = "local" | "pending" | "synced" | "error";
export type ProgressEventType = "tap" | "reset" | "complete" | "switch";
export type ProgressEventSource = "home" | "migration" | "sync";
export const DEVICE_USER_ID = "device";
export type PrayerSlot = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export interface TasbeehCollectionRow {
  id: string;
  userId: string;
  arabic: string;
  transliteration: string;
  translation: string | null;
  targetCount: number;
  sortOrder: number;
  isDefault: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
}

export interface UserProgressRow {
  id: string;
  userId: string;
  activeTasbeehId: string | null;
  currentCount: number;
  streakDays: number;
  lastCompletedOn: string | null;
  updatedAt: string;
  version: number;
  syncStatus: SyncStatus;
}

export interface ProgressEventRow {
  id: string;
  userId: string;
  tasbeehId: string;
  eventType: ProgressEventType;
  delta: number;
  countAfter: number;
  occurredOn: string;
  createdAt: string;
  source: ProgressEventSource;
  syncStatus: SyncStatus;
}

export interface AppConfigRow {
  id: string;
  userId: string;
  schemaVersion: number;
  data: Record<string, unknown>;
  updatedAt: string;
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
}

export type TasbeehScheduleType = "prayer_specific" | "anytime_today";
export type SlotExpiryPolicy = "next_prayer" | "day_end";
export type TasbeehPriority = "low" | "normal" | "high";
export type ReminderPolicy = "off" | "gentle" | "strong";

export interface TasbeehReference {
  sourceType: "hadith" | "quran" | "scholar" | "custom" | "none";
  book?: string;
  chapter?: string;
  hadithNumber?: string;
  verse?: string;
  text?: string;
  url?: string;
}

export interface TasbeehCollectionGroupRow {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  scheduleType: TasbeehScheduleType;
  timesPerDay: number;
  slots: PrayerSlot[] | null;
  slotExpiryPolicy: SlotExpiryPolicy;
  priority: TasbeehPriority;
  reminderPolicy: ReminderPolicy;
  tags: string[];
  reference: TasbeehReference | null;
  isDefault: boolean;
  isArchived: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
}

export interface TasbeehPhraseRow {
  id: string;
  userId: string;
  arabic: string;
  transliteration: string;
  translation: string | null;
  /** User-authored phrase from this app; kept in Dexie for UI (e.g. “New” tag). */
  isNewlyCreated?: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
}

export type CollectionItemRole = "start" | "main" | "end";

export interface CollectionItemRow {
  id: string;
  userId: string;
  collectionId: string;
  phraseId: string;
  role: CollectionItemRole;
  targetCount: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
}

class TasbeehDexieDb extends Dexie {
  tasbeehCollection!: EntityTable<TasbeehCollectionRow, "id">;
  userProgress!: EntityTable<UserProgressRow, "id">;
  progressEvents!: EntityTable<ProgressEventRow, "id">;
  appConfig!: EntityTable<AppConfigRow, "id">;
  tasbeehCollections!: EntityTable<TasbeehCollectionGroupRow, "id">;
  tasbeehPhrases!: EntityTable<TasbeehPhraseRow, "id">;
  collectionItems!: EntityTable<CollectionItemRow, "id">;
  kvStore!: EntityTable<{ key: string; value: any }, "key">;

  constructor() {
    super("tasbeehFlowDb");

    this.version(1).stores({
      tasbeehCollection:
        "id,[userId+sortOrder],[userId+isArchived],isDefault,updatedAt,syncStatus",
      userProgress: "id,userId,updatedAt,syncStatus,[userId+updatedAt]",
      progressEvents:
        "id,[userId+createdAt],[tasbeehId+createdAt],[eventType+createdAt],occurredOn,syncStatus",
    });

    this.version(2)
      .stores({
        tasbeehCollection:
          "id,[userId+sortOrder],[userId+isArchived],isDefault,updatedAt,syncStatus",
        userProgress: "id,userId,updatedAt,syncStatus,[userId+updatedAt]",
        progressEvents:
          "id,[userId+createdAt],[tasbeehId+createdAt],[eventType+createdAt],occurredOn,syncStatus",
      })
      .upgrade(async (tx) => {
        await tx
          .table("tasbeehCollection")
          .toCollection()
          .modify((row: { userId?: string | null }) => {
            if (row.userId == null) {
              row.userId = DEVICE_USER_ID;
            }
          });

        await tx
          .table("userProgress")
          .toCollection()
          .modify((row: { userId?: string | null }) => {
            if (row.userId == null) {
              row.userId = DEVICE_USER_ID;
            }
          });

        await tx
          .table("progressEvents")
          .toCollection()
          .modify((row: { userId?: string | null }) => {
            if (row.userId == null) {
              row.userId = DEVICE_USER_ID;
            }
          });
      });

    this.version(3).stores({
      tasbeehCollection:
        "id,[userId+sortOrder],[userId+isArchived],isDefault,updatedAt,syncStatus",
      userProgress: "id,userId,updatedAt,syncStatus,[userId+updatedAt]",
      progressEvents:
        "id,[userId+createdAt],[tasbeehId+createdAt],[eventType+createdAt],occurredOn,syncStatus",
      appConfig: "id,userId,updatedAt,syncStatus",
    });

    this.version(5).stores({
      tasbeehCollection:
        "id,[userId+sortOrder],[userId+isArchived],isDefault,updatedAt,syncStatus",
      userProgress: "id,userId,updatedAt,syncStatus,[userId+updatedAt]",
      progressEvents:
        "id,[userId+createdAt],[tasbeehId+createdAt],[eventType+createdAt],occurredOn,syncStatus",
      appConfig: "id,userId,updatedAt,syncStatus",
      tasbeehCollections:
        "id,userId,isDefault,isArchived,sortOrder,updatedAt,syncStatus,[userId+sortOrder]",
      tasbeehPhrases: "id,userId,isArchived,updatedAt,syncStatus",
      collectionItems:
        "id,userId,collectionId,phraseId,role,sortOrder,updatedAt,syncStatus,[collectionId+sortOrder]",
      kvStore: "key",
    });
  }
}

export const tasbeehDb = new TasbeehDexieDb();

