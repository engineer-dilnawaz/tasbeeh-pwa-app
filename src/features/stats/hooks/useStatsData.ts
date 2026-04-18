import { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { tasbeehDb } from "@/features/tasbeeh/services/tasbeehDb";
import type { StatsSnapshot, TimeframeOption, DayActivity, PrayerSlot } from "../types";
import { subDays, subMonths, startOfDay, format, differenceInDays } from "date-fns";

const getDateRangeStart = (timeframe: TimeframeOption): Date | null => {
  const today = startOfDay(new Date());
  switch (timeframe) {
    case "week":
      return subDays(today, 7);
    case "month":
      return subMonths(today, 1);
    case "all":
      return null;
  }
};

const calculateStreak = (completedDates: string[]): { current: number; best: number } => {
  if (completedDates.length === 0) return { current: 0, best: 0 };

  const sortedDates = [...completedDates].sort().reverse();
  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

  let current = 0;
  let best = 0;
  let streakCount = 0;
  let expectedDate = sortedDates[0] === today || sortedDates[0] === yesterday ? new Date() : null;

  if (sortedDates[0] === today) {
    expectedDate = new Date();
  } else if (sortedDates[0] === yesterday) {
    expectedDate = subDays(new Date(), 1);
  }

  if (expectedDate) {
    for (const dateStr of sortedDates) {
      const expected = format(expectedDate, "yyyy-MM-dd");
      if (dateStr === expected) {
        streakCount++;
        expectedDate = subDays(expectedDate, 1);
      } else if (differenceInDays(new Date(expected), new Date(dateStr)) === 1) {
        streakCount++;
        expectedDate = subDays(new Date(dateStr), 1);
      } else {
        break;
      }
    }
    current = streakCount;
  }

  streakCount = 1;
  let prevDate = new Date(sortedDates[0]);
  for (let i = 1; i < sortedDates.length; i++) {
    const currDate = new Date(sortedDates[i]);
    const diff = differenceInDays(prevDate, currDate);
    if (diff === 1) {
      streakCount++;
    } else {
      best = Math.max(best, streakCount);
      streakCount = 1;
    }
    prevDate = currDate;
  }
  best = Math.max(best, streakCount, current);

  return { current, best };
};

export function useStatsData(timeframe: TimeframeOption): StatsSnapshot | null {
  const rangeStart = useMemo(() => getDateRangeStart(timeframe), [timeframe]);

  const progressEvents = useLiveQuery(async () => {
    let query = tasbeehDb.progressEvents.orderBy("occurredOn");
    if (rangeStart) {
      query = query.filter((e) => new Date(e.occurredOn) >= rangeStart);
    }
    return query.toArray();
  }, [rangeStart]);

  const collections = useLiveQuery(() => tasbeehDb.tasbeehCollections.toArray(), []);

  return useMemo(() => {
    if (!progressEvents) return null;

    const activityByDate: Record<string, DayActivity> = {};
    const completedDates: string[] = [];
    let totalTaps = 0;
    let totalCompleted = 0;
    const prayerBreakdown: Record<PrayerSlot, number> = {
      fajr: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0,
    };
    const collectionCounts: Record<string, number> = {};

    for (const event of progressEvents) {
      const dateKey = event.occurredOn.slice(0, 10);

      if (!activityByDate[dateKey]) {
        activityByDate[dateKey] = {
          date: dateKey,
          totalCount: 0,
          completedRounds: 0,
          prayers: [],
        };
      }

      if (event.eventType === "tap") {
        activityByDate[dateKey].totalCount += event.delta;
        totalTaps += event.delta;
      }

      if (event.eventType === "complete") {
        activityByDate[dateKey].completedRounds++;
        totalCompleted++;
        if (!completedDates.includes(dateKey)) {
          completedDates.push(dateKey);
        }
        collectionCounts[event.tasbeehId] = (collectionCounts[event.tasbeehId] || 0) + 1;
      }
    }

    const { current, best } = calculateStreak(completedDates);
    const totalDaysActive = Object.keys(activityByDate).length;
    const averagePerDay = totalDaysActive > 0 ? Math.round(totalTaps / totalDaysActive) : 0;

    const collectionBreakdown: Record<string, { name: string; count: number }> = {};
    const collectionMap = new Map((collections ?? []).map((c) => [c.id, c.title]));
    for (const [id, count] of Object.entries(collectionCounts)) {
      collectionBreakdown[id] = {
        name: collectionMap.get(id) ?? "Unknown",
        count,
      };
    }

    return {
      currentStreak: current,
      bestStreak: best,
      totalDaysActive,
      totalTapsAllTime: totalTaps,
      roundsCompletedAllTime: totalCompleted,
      averagePerDay,
      activityByDate,
      prayerBreakdown,
      collectionBreakdown,
    };
  }, [progressEvents, collections]);
}
