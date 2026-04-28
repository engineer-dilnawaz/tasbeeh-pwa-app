import type { LocaleKey } from "@/shared/locales";

export type TasbeehId = string;
export type CollectionId = string;

export type Tasbeeh = {
  id: TasbeehId;
  titleKey?: LocaleKey;
  title?: string;
  arabic?: string;
  transliterationKey?: LocaleKey;
  transliteration?: string;
  targetCount: number;
};

export type Collection = {
  id: CollectionId;
  title: string;
  /** Ordered list of tasbeeh IDs — defines the queue sequence */
  tasbeehIds: TasbeehId[];
};
