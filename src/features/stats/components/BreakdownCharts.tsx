import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/shared/design-system/ui/Card";
import { Text } from "@/shared/design-system/ui/Text";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import type { PrayerSlot } from "../types";

interface BarItemProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  delay: number;
}

function BarItem({ label, value, maxValue, color, delay }: BarItemProps) {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <motion.div
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay, type: "spring", bounce: 0.2 }}
      className="flex flex-col gap-2"
    >
      <div className="flex items-end justify-between px-0.5">
        <Text variant="caption" className="text-[10px] uppercase font-black tracking-[0.1em] text-base-content/40">
          {label}
        </Text>
        <span className="text-xs font-black text-base-content/70 tracking-tighter">
          {value}
        </span>
      </div>
      <div className="h-2 bg-base-content/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: delay + 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full ${color} shadow-sm`}
        />
      </div>
    </motion.div>
  );
}

const PRAYER_COLORS: Record<PrayerSlot, string> = {
  fajr: "bg-gradient-to-r from-indigo-500/80 to-blue-500/80",
  dhuhr: "bg-gradient-to-r from-amber-400/80 to-orange-500/80",
  asr: "bg-gradient-to-r from-orange-500/80 to-red-500/80",
  maghrib: "bg-gradient-to-r from-purple-500/80 to-fuchsia-600/80",
  isha: "bg-gradient-to-r from-slate-600/80 to-slate-800/80",
};

const PRAYER_ORDER: PrayerSlot[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

interface PrayerBreakdownChartProps {
  breakdown: Record<PrayerSlot, number>;
}

export function PrayerBreakdownChart({ breakdown }: PrayerBreakdownChartProps) {
  const maxValue = useMemo(() => Math.max(...Object.values(breakdown), 1), [breakdown]);
  const hasData = Object.values(breakdown).some((v) => v > 0);

  return (
    <Squircle cornerRadius={24} cornerSmoothing={0.99} asChild>
      <div className="bg-white dark:bg-black p-6 shadow-sm border border-base-content/5">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <Text variant="body" weight="black" className="tracking-tight">
              Prayer Symmetry
            </Text>
            <Text variant="caption" color="subtle" className="text-[10px] leading-tight opacity-40 font-bold uppercase tracking-wider">
              Daily distribution of zikr
            </Text>
          </div>

          {hasData ? (
            <div className="flex flex-col gap-4">
              {PRAYER_ORDER.map((prayer, i) => (
                <BarItem
                  key={prayer}
                  label={prayer}
                  value={breakdown[prayer]}
                  maxValue={maxValue}
                  color={PRAYER_COLORS[prayer]}
                  delay={i * 0.05}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center bg-base-200/30 rounded-2xl border border-dashed border-base-content/10">
              <Text variant="caption" color="subtle" className="font-bold opacity-30 uppercase tracking-widest text-[9px]">
                No data for this period
              </Text>
            </div>
          )}
        </div>
      </div>
    </Squircle>
  );
}

const COLLECTION_COLORS = [
  "bg-primary/80",
  "bg-success/80",
  "bg-info/80",
  "bg-secondary/80",
  "bg-accent/80",
];

interface CollectionBreakdownChartProps {
  breakdown: Record<string, { name: string; count: number }>;
}

export function CollectionBreakdownChart({ breakdown }: CollectionBreakdownChartProps) {
  const sortedItems = useMemo(
    () =>
      Object.entries(breakdown)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
    [breakdown]
  );
  const maxValue = useMemo(() => Math.max(...sortedItems.map((i) => i.count), 1), [sortedItems]);
  const hasData = sortedItems.length > 0;

  return (
    <Squircle cornerRadius={24} cornerSmoothing={0.99} asChild>
      <div className="bg-white dark:bg-black p-6 shadow-sm border border-base-content/5">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <Text variant="body" weight="black" className="tracking-tight">
              Top Intentions
            </Text>
            <Text variant="caption" color="subtle" className="text-[10px] leading-tight opacity-40 font-bold uppercase tracking-wider">
              Most engaged tasbeeh collections
            </Text>
          </div>

          {hasData ? (
            <div className="flex flex-col gap-4">
              {sortedItems.map((item, i) => (
                <BarItem
                  key={item.id}
                  label={item.name}
                  value={item.count}
                  maxValue={maxValue}
                  color={COLLECTION_COLORS[i % COLLECTION_COLORS.length]}
                  delay={i * 0.05}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center bg-base-200/30 rounded-2xl border border-dashed border-base-content/10">
              <Text variant="caption" color="subtle" className="font-bold opacity-30 uppercase tracking-widest text-[9px]">
                Explore collections to see charts
              </Text>
            </div>
          )}
        </div>
      </div>
    </Squircle>
  );
}
