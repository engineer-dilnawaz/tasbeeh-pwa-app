import {
  DEVICE_USER_ID,
  tasbeehDb,
  type ProgressEventType,
  type TasbeehCollectionRow,
} from "./tasbeehDb";

export interface TasbeehSnapshot {
  tasbeehLibrary: Array<{
    id: string;
    arabic: string;
    transliteration: string;
    target: number;
  }>;
  currentTasbeehId: string | null;
  count: number;
  streakDays: number;
  lastCompletedOn: string | null;
}

const ACTIVE_PROGRESS_ID = "active:device";

const DEFAULT_TASBEEH_ROWS: Omit<TasbeehCollectionRow, "createdAt" | "updatedAt">[] = [
  {
    id: "subhanallah",
    userId: DEVICE_USER_ID,
    arabic: "سُبْحَانَ ٱللَّٰهِ",
    transliteration: "SubhanAllah",
    translation: "Glory be to Allah",
    targetCount: 33,
    sortOrder: 0,
    isDefault: true,
    isArchived: false,
    syncStatus: "local",
  },
  {
    id: "alhamdulillah",
    userId: DEVICE_USER_ID,
    arabic: "ٱلْحَمْدُ لِلَّٰهِ",
    transliteration: "Alhamdulillah",
    translation: "All praise is due to Allah",
    targetCount: 33,
    sortOrder: 1,
    isDefault: true,
    isArchived: false,
    syncStatus: "local",
  },
  {
    id: "allahuakbar",
    userId: DEVICE_USER_ID,
    arabic: "ٱللَّٰهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    translation: "Allah is the Greatest",
    targetCount: 34,
    sortOrder: 2,
    isDefault: true,
    isArchived: false,
    syncStatus: "local",
  },
];

const todayKey = () => new Date().toISOString().slice(0, 10);

const yesterdayKey = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
};

const isoNow = () => new Date().toISOString();

const createEventId = () => {
  if ("randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

const mapCollectionToLibrary = (
  rows: TasbeehCollectionRow[],
): TasbeehSnapshot["tasbeehLibrary"] =>
  rows.map((row) => ({
    id: row.id,
    arabic: row.arabic,
    transliteration: row.transliteration,
    target: row.targetCount,
  }));

async function getActiveRows() {
  const deviceCollection = await tasbeehDb.tasbeehCollection
    .where("userId")
    .equals(DEVICE_USER_ID)
    .and((row) => !row.isArchived)
    .sortBy("sortOrder");

  const collection =
    deviceCollection.length > 0
      ? deviceCollection
      : await tasbeehDb.tasbeehCollection
          .filter((row) => !row.isArchived)
          .sortBy("sortOrder");

  const progress = await tasbeehDb.userProgress.get(ACTIVE_PROGRESS_ID);

  return {
    collection,
    progress,
  };
}

function toSnapshot(
  collection: TasbeehCollectionRow[],
  progress: {
    activeTasbeehId: string | null;
    currentCount: number;
    streakDays: number;
    lastCompletedOn: string | null;
  } | null,
): TasbeehSnapshot {
  const fallbackTasbeehId = collection[0]?.id ?? null;
  const isActiveValid = !!progress?.activeTasbeehId
    && collection.some((row) => row.id === progress.activeTasbeehId);

  return {
    tasbeehLibrary: mapCollectionToLibrary(collection),
    currentTasbeehId: isActiveValid ? progress!.activeTasbeehId : fallbackTasbeehId,
    count: progress?.currentCount ?? 0,
    streakDays: progress?.streakDays ?? 0,
    lastCompletedOn: progress?.lastCompletedOn ?? null,
  };
}

async function appendProgressEvent(params: {
  tasbeehId: string;
  eventType: ProgressEventType;
  delta: number;
  countAfter: number;
}) {
  await tasbeehDb.progressEvents.add({
    id: createEventId(),
    userId: DEVICE_USER_ID,
    tasbeehId: params.tasbeehId,
    eventType: params.eventType,
    delta: params.delta,
    countAfter: params.countAfter,
    occurredOn: todayKey(),
    createdAt: isoNow(),
    source: "home",
    syncStatus: "pending",
  });
}

export async function bootstrapTasbeehDb() {
  const hasCollection = (await tasbeehDb.tasbeehCollection.count()) > 0;

  if (!hasCollection) {
    const now = isoNow();
    await tasbeehDb.tasbeehCollection.bulkAdd(
      DEFAULT_TASBEEH_ROWS.map((item) => ({
        ...item,
        createdAt: now,
        updatedAt: now,
      })),
    );
  }

  const activeProgress = await tasbeehDb.userProgress.get(ACTIVE_PROGRESS_ID);
  const defaultTasbeehId = DEFAULT_TASBEEH_ROWS[0].id;

  if (!activeProgress) {
    await tasbeehDb.userProgress.add({
      id: ACTIVE_PROGRESS_ID,
      userId: DEVICE_USER_ID,
      activeTasbeehId: defaultTasbeehId,
      currentCount: 0,
      streakDays: 0,
      lastCompletedOn: null,
      updatedAt: isoNow(),
      version: 1,
      syncStatus: "local",
    });
    return;
  }

  const availableTasbeehIds = new Set(
    (
      await tasbeehDb.tasbeehCollection
        .filter((row) => !row.isArchived)
        .sortBy("sortOrder")
    ).map((item) => item.id),
  );

  const hasValidActiveTasbeeh =
    !!activeProgress.activeTasbeehId &&
    availableTasbeehIds.has(activeProgress.activeTasbeehId);

  if (!hasValidActiveTasbeeh) {
    await tasbeehDb.userProgress.update(ACTIVE_PROGRESS_ID, {
      activeTasbeehId: defaultTasbeehId,
      updatedAt: isoNow(),
      version: activeProgress.version + 1,
      syncStatus: "pending",
    });
  }
}

export async function readTasbeehSnapshot(): Promise<TasbeehSnapshot> {
  await bootstrapTasbeehDb();
  const { collection, progress } = await getActiveRows();
  return toSnapshot(collection, progress ?? null);
}

export async function incrementProgress() {
  await tasbeehDb.transaction(
    "rw",
    tasbeehDb.userProgress,
    tasbeehDb.tasbeehCollection,
    tasbeehDb.progressEvents,
    async () => {
      const { collection, progress } = await getActiveRows();
      if (!progress || !progress.activeTasbeehId) {
        return;
      }

      const active = collection.find((row) => row.id === progress.activeTasbeehId);
      if (!active || progress.currentCount >= active.targetCount) {
        return;
      }

      const nextCount = progress.currentCount + 1;
      await tasbeehDb.userProgress.update(progress.id, {
        currentCount: nextCount,
        updatedAt: isoNow(),
        version: progress.version + 1,
        syncStatus: "pending",
      });

      await appendProgressEvent({
        tasbeehId: active.id,
        eventType: "tap",
        delta: 1,
        countAfter: nextCount,
      });
    },
  );
}

export async function decrementProgress() {
  await tasbeehDb.transaction(
    "rw",
    tasbeehDb.userProgress,
    tasbeehDb.progressEvents,
    async () => {
      const progress = await tasbeehDb.userProgress.get(ACTIVE_PROGRESS_ID);
      if (!progress || progress.currentCount <= 0) {
        return;
      }

      const nextCount = progress.currentCount - 1;
      await tasbeehDb.userProgress.update(progress.id, {
        currentCount: nextCount,
        updatedAt: isoNow(),
        version: progress.version + 1,
        syncStatus: "pending",
      });

      await appendProgressEvent({
        tasbeehId: progress.activeTasbeehId!,
        eventType: "undo",
        delta: -1,
        countAfter: nextCount,
      });
    },
  );
}

export async function resetProgress() {
  await tasbeehDb.transaction(
    "rw",
    tasbeehDb.userProgress,
    tasbeehDb.progressEvents,
    async () => {
      const progress = await tasbeehDb.userProgress.get(ACTIVE_PROGRESS_ID);
      if (!progress || !progress.activeTasbeehId) {
        return;
      }

      await tasbeehDb.userProgress.update(progress.id, {
        currentCount: 0,
        updatedAt: isoNow(),
        version: progress.version + 1,
        syncStatus: "pending",
      });

      await appendProgressEvent({
        tasbeehId: progress.activeTasbeehId,
        eventType: "reset",
        delta: 0,
        countAfter: 0,
      });
    },
  );
}

export async function selectTasbeehProgress(tasbeehId: string) {
  await tasbeehDb.transaction(
    "rw",
    tasbeehDb.userProgress,
    tasbeehDb.progressEvents,
    async () => {
      const progress = await tasbeehDb.userProgress.get(ACTIVE_PROGRESS_ID);
      if (!progress) return;

      // Find last known count for this tasbeeh today
      const lastEvent = await tasbeehDb.progressEvents
        .where("[tasbeehId+createdAt]")
        .between([tasbeehId, todayKey()], [tasbeehId, todayKey() + "\uffff"])
        .reverse()
        .first();

      const restoredCount = lastEvent?.countAfter ?? 0;

      await tasbeehDb.userProgress.update(progress.id, {
        activeTasbeehId: tasbeehId,
        currentCount: restoredCount,
        updatedAt: isoNow(),
        version: progress.version + 1,
        syncStatus: "pending",
      });

      await appendProgressEvent({
        tasbeehId,
        eventType: "switch",
        delta: 0,
        countAfter: restoredCount,
      });
    },
  );
}

export async function cycleTasbeehProgress() {
  await tasbeehDb.transaction(
    "rw",
    tasbeehDb.userProgress,
    tasbeehDb.tasbeehCollection,
    tasbeehDb.progressEvents,
    async () => {
      const { collection, progress } = await getActiveRows();
      if (!progress || collection.length === 0) {
        return;
      }

      const currentIndex = collection.findIndex(
        (item) => item.id === progress.activeTasbeehId,
      );
      const fallbackIndex = currentIndex >= 0 ? currentIndex : 0;
      const nextIndex = (fallbackIndex + 1) % collection.length;
      const nextTasbeehId = collection[nextIndex].id;

      // Find last known count for the next tasbeeh today
      const lastEvent = await tasbeehDb.progressEvents
        .where("[tasbeehId+createdAt]")
        .between([nextTasbeehId, todayKey()], [nextTasbeehId, todayKey() + "\uffff"])
        .reverse()
        .first();

      const restoredCount = lastEvent?.countAfter ?? 0;

      await tasbeehDb.userProgress.update(progress.id, {
        activeTasbeehId: nextTasbeehId,
        currentCount: restoredCount,
        updatedAt: isoNow(),
        version: progress.version + 1,
        syncStatus: "pending",
      });

      await appendProgressEvent({
        tasbeehId: nextTasbeehId,
        eventType: "switch",
        delta: 0,
        countAfter: restoredCount,
      });
    },
  );
}

export async function completeRoundProgress() {
  await tasbeehDb.transaction(
    "rw",
    tasbeehDb.userProgress,
    tasbeehDb.progressEvents,
    async () => {
      const progress = await tasbeehDb.userProgress.get(ACTIVE_PROGRESS_ID);
      if (!progress || !progress.activeTasbeehId) {
        return;
      }

      const today = todayKey();
      const yesterday = yesterdayKey();
      const nextStreak =
        progress.lastCompletedOn === today
          ? progress.streakDays
          : progress.lastCompletedOn === yesterday
            ? progress.streakDays + 1
            : 1;

      await tasbeehDb.userProgress.update(progress.id, {
        currentCount: 0,
        streakDays: nextStreak,
        lastCompletedOn: today,
        updatedAt: isoNow(),
        version: progress.version + 1,
        syncStatus: "pending",
      });

      await appendProgressEvent({
        tasbeehId: progress.activeTasbeehId,
        eventType: "complete",
        delta: 0,
        countAfter: 0,
      });
    },
  );
}

export async function setDefaultTasbeehProgress() {
  await bootstrapTasbeehDb();

  await tasbeehDb.transaction(
    "rw",
    tasbeehDb.userProgress,
    tasbeehDb.tasbeehCollection,
    async () => {
      const firstForDevice = await tasbeehDb.tasbeehCollection
        .where("userId")
        .equals(DEVICE_USER_ID)
        .and((row) => !row.isArchived)
        .sortBy("sortOrder");

      const firstTasbeeh =
        firstForDevice[0] ??
        (await tasbeehDb.tasbeehCollection
          .filter((row) => !row.isArchived)
          .first());

      if (!firstTasbeeh) {
        return;
      }

      const progress = await tasbeehDb.userProgress.get(ACTIVE_PROGRESS_ID);
      if (!progress) {
        await tasbeehDb.userProgress.put({
          id: ACTIVE_PROGRESS_ID,
          userId: DEVICE_USER_ID,
          activeTasbeehId: firstTasbeeh.id,
          currentCount: 0,
          streakDays: 0,
          lastCompletedOn: null,
          updatedAt: isoNow(),
          version: 1,
          syncStatus: "pending",
        });
        return;
      }

      await tasbeehDb.userProgress.update(progress.id, {
        activeTasbeehId: firstTasbeeh.id,
        updatedAt: isoNow(),
        version: progress.version + 1,
        syncStatus: "pending",
      });
    },
  );
}

