import { useState } from "react";
import { motion } from "framer-motion";
import { SegmentedControl } from "@/shared/design-system/ui/SegmentedControl";
import { Text } from "@/shared/design-system/ui/Text";
import { Skeleton } from "@/shared/design-system/ui/Skeleton";
import {
  StreakHero,
  StatsSummaryCards,
  CalendarHeatmap,
  PrayerBreakdownChart,
  CollectionBreakdownChart,
  MotivationalQuote,
  StatsEmptyState,
  useStatsData,
  type TimeframeOption,
} from "@/features/stats";

const TIMEFRAME_OPTIONS: { label: string; value: TimeframeOption }[] = [
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "All Time", value: "all" },
];

function StatsLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-12 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>
    </div>
  );
}

export default function Stats() {
  const [timeframe, setTimeframe] = useState<TimeframeOption>("week");
  const stats = useStatsData(timeframe);

  const hasActivity = stats && stats.totalDaysActive > 0;

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-5 px-4 pt-4 pb-8">
      {stats === null ? (
        <StatsLoading />
      ) : !hasActivity ? (
        <StatsEmptyState />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-5"
        >
          <StreakHero
            currentStreak={stats.currentStreak}
            bestStreak={stats.bestStreak}
            totalDaysActive={stats.totalDaysActive}
          />

          <SegmentedControl
            value={timeframe}
            onChange={setTimeframe}
            options={TIMEFRAME_OPTIONS}
            size="sm"
          />

          <CalendarHeatmap activityByDate={stats.activityByDate} />

          <StatsSummaryCards
            totalTaps={stats.totalTapsAllTime}
            roundsCompleted={stats.roundsCompletedAllTime}
            averagePerDay={stats.averagePerDay}
            totalDaysActive={stats.totalDaysActive}
          />

          <PrayerBreakdownChart breakdown={stats.prayerBreakdown} />

          <CollectionBreakdownChart breakdown={stats.collectionBreakdown} />

          <MotivationalQuote />
        </motion.div>
      )}
    </div>
  );
}
