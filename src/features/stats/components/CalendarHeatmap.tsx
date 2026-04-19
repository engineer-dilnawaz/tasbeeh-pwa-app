import { useMemo } from "react";
import { motion } from "framer-motion";
import { format, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { Text } from "@/shared/design-system/ui/Text";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import type { DayActivity } from "../types";

interface CalendarHeatmapProps {
  activityByDate: Record<string, DayActivity>;
}

const getIntensityStyles = (count: number): string => {
  if (count === 0) return "bg-base-content/5 opacity-40";
  if (count < 33) return "bg-primary/20 text-primary";
  if (count < 100) return "bg-primary/40 text-primary-content";
  if (count < 200) return "bg-primary/70 text-primary-content";
  return "bg-primary text-primary-content shadow-lg shadow-primary/20";
};

export function CalendarHeatmap({ activityByDate }: CalendarHeatmapProps) {
  const heatmapWeeks = useMemo(() => {
    const weeks: Date[][] = [];
    let current = subMonths(new Date(), 3);
    current = startOfWeek(current);
    const end = endOfWeek(new Date());

    while (current <= end) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
    }
    return weeks;
  }, []);

  return (
    <Squircle cornerRadius={24} cornerSmoothing={0.99} asChild>
      <div className="bg-white dark:bg-black p-6 shadow-sm border border-base-content/5">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <Text variant="body" weight="black" className="tracking-tight text-base-content">
              Spiritual Consistency
            </Text>
            <Text variant="caption" color="subtle" className="text-[10px] leading-tight opacity-50 font-bold uppercase tracking-wider">
              A 3-month map of your daily zikr
            </Text>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-1 overflow-x-auto pb-4 no-scrollbar">
              {heatmapWeeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day) => {
                    const dateKey = format(day, "yyyy-MM-dd");
                    const activity = activityByDate[dateKey];
                    return (
                      <Squircle key={dateKey} cornerRadius={3} cornerSmoothing={0.9} asChild>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: wi * 0.01 }}
                          className={`w-3.5 h-3.5 ${getIntensityStyles(activity?.totalCount ?? 0).split(" ")[0]}`}
                          title={`${dateKey}: ${activity?.totalCount ?? 0} taps`}
                        />
                      </Squircle>
                    );
                  })}
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-end gap-1.5 px-1">
              <Text variant="caption" color="subtle" className="text-[9px] font-bold uppercase tracking-wider opacity-40 mr-1">
                Intensity
              </Text>
              {[0, 33, 100, 200, 300].map((threshold) => (
                <Squircle key={threshold} cornerRadius={2} cornerSmoothing={0.9} asChild>
                  <div className={`w-3 h-3 ${getIntensityStyles(threshold).split(" ")[0]}`} />
                </Squircle>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Squircle>
  );
}

const formatNumber = (num: number): string => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};
