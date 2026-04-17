import type {
  CollectionItemRole,
  PrayerSlot,
  ReminderPolicy,
  SlotExpiryPolicy,
  TasbeehPhraseRow,
  TasbeehPriority,
  TasbeehReference,
  TasbeehScheduleType,
} from "@/features/tasbeeh/services/tasbeehDb";

export interface DraftItem {
  id: string;
  role: CollectionItemRole;
  phrase: TasbeehPhraseRow;
  targetCount: number;
}

export interface CollectionDraftItem {
  role: CollectionItemRole;
  phraseId: string;
  targetCount: number;
}

export interface CreateCollectionDraft {
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
  items: CollectionDraftItem[];
}

export interface UpdateCollectionDraft extends Partial<CreateCollectionDraft> {
  id: string;
}

export type PhraseSheetMode = "pick_existing" | "create_new";
