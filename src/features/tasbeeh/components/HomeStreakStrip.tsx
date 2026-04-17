import { Card } from "@/shared/design-system/ui/Card";
import { Text } from "@/shared/design-system/ui/Text";

interface HomeStreakStripProps {
  streakDays: number;
  completedToday: boolean;
}

export function HomeStreakStrip({
  streakDays,
  completedToday,
}: HomeStreakStripProps) {
  return (
    <Card variant="filled" radius="lg" className="bg-base-200/70">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <Text variant="caption" color="subtle" className="text-[10px]! tracking-[0.14em]!">
            CURRENT STREAK
          </Text>
          <Text variant="heading" weight="bold" className="mt-1 text-xl!">
            {streakDays} day{streakDays === 1 ? "" : "s"}
          </Text>
        </div>

        <div className="rounded-2xl bg-base-100 px-3 py-2">
          <Text variant="caption" color={completedToday ? "primary" : "subtle"}>
            {completedToday ? "Today complete" : "Today in progress"}
          </Text>
        </div>
      </div>
    </Card>
  );
}

