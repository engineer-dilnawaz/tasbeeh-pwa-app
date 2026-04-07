export interface TasbeehReference {
  hadith: string | null;
  grade: string | null;
  description: string | null;
}

/** Atomic Unit of a Tasbeeh counter item */
export interface Tasbeeh {
  id: string;
  text: string;
  transliteration: string;
  urdu?: string | null;
  meaningEn?: string | null;
  target: number;
  category?: string[];
  benefitEn?: string | null;
  reference?: TasbeehReference | null;
}

/** A Program or Set containing multiple Tasbeeh units */
export interface TasbeehSequence {
  id: string;
  title: string;
  items: Tasbeeh[];
  createdBy?: string;
  isDefault?: boolean;
}

/** Document shape for synchronization and persistence */
export interface TasbeehSequenceDoc extends TasbeehSequence {
  synced?: boolean;
  updatedAt?: number;
}
