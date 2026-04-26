export type TasbeehItem = {
  id: string;
  arabic: string;
  transliteration: string;
  translation?: string;
  target: number;
};

export type ActiveZikrSlot = {
  collectionId: string;
  name: string;
  items: TasbeehItem[];
  currentIndex: number;
  currentCount: number;
  isCompleted: boolean;
  totalTaps: number;
};

/**
 * Represents a historical log of a tasbeeh session.
 * Stored in the 'tasbeeh-entries' collection.
 */
export type TasbeehEntry = {
  id?: string;
  userId: string;
  zikrName: string;
  zikrArabic: string;
  countReached: number;
  target: number;
  timestamp: any; // Firestore Timestamp
  durationSeconds?: number;
};
