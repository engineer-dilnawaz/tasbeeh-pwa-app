export type TimeframeOption = "week" | "month" | "all";
export type CalendarViewMode = "month" | "week" | "heatmap";

export interface DayActivity {
  date: string;
  totalCount: number;
  completedRounds: number;
  prayers: PrayerSlot[];
}

export type PrayerSlot = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export interface StatsSnapshot {
  currentStreak: number;
  bestStreak: number;
  totalDaysActive: number;
  totalTapsAllTime: number;
  roundsCompletedAllTime: number;
  averagePerDay: number;
  activityByDate: Record<string, DayActivity>;
  prayerBreakdown: Record<PrayerSlot, number>;
  collectionBreakdown: Record<string, { name: string; count: number }>;
}

export interface MotivationalQuote {
  text: string;
  source: string;
  type: "hadith" | "quran" | "wisdom";
}
