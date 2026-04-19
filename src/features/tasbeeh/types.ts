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
