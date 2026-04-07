export interface TasbeehItem {
  /** Stable id when synced from catalog / Firestore */
  id?: string;
  text: string;
  transliteration: string;
  urdu: string;
  target: number;
  /** Short English meaning (spiritual context). */
  meaningEn?: string;
  /** One-line “why this matters” for reflection. */
  benefitEn?: string;
}

export interface AppState {
  count: number;
  currentIndex: number;
  date: string;
  todayCompleted: number;
  todayRecitations: number;
  totalRecitations: number;
  streak: number;
  lastActiveDate: string | null;
  milestonesSeen: number[];
  weeklyData: Record<string, number>;
  moodData: { mood: string; date: string; timestamp: number }[];
  hourlyActivity: Record<number, number>;
}

export type FlowMode = "sequential" | "single" | "random";
export type HapticPattern = "each" | "10" | "33";

export interface Settings {
  flowMode: FlowMode;
  theme: string;
  holdMode: boolean;
  hapticFeedback: boolean;
  hapticStrength: number;
  hapticPattern: HapticPattern;
  silentMode: boolean;
  bigNumberMode: boolean;
  reflectionMode: boolean;
  focusMode: boolean;
  thumbZoneMode: boolean;
  readableArabic: boolean;
  sessionSummary: boolean;
  keepScreenAwake: boolean;
  dailyReminder: boolean;
  reminderTime: string;
  nightReminder: boolean;
}

export interface LastUndo {
  count: number;
  totalRecitations: number;
  todayRecitations: number;
  weeklyToday: number;
  hour: number;
  hourCount: number;
}

export interface SpiritualAyat {
  arabic: string;
  urdu: string;
  english: string;
  source: string;
}

export interface SpiritualHadith {
  arabic: string;
  urdu: string;
  english: string;
  source: string;
}
