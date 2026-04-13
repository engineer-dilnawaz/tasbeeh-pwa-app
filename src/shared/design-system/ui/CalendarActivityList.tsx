import React from "react";
import { Text } from "./Text";
import { List, ListItem } from "./List";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { type ZikrRecord } from "./Calendar";
import { Clock } from "lucide-react";

interface CalendarActivityListProps {
  title?: string;
  activities: ZikrRecord[];
  className?: string;
}

/**
 * CalendarActivityList — Renders the tactical zikr activity for a selected date.
 */
export const CalendarActivityList: React.FC<CalendarActivityListProps> = ({
  title = "Zikr Activity",
  activities,
  className = "",
}) => {
  if (activities.length === 0) {
    return (
      <Card variant="ghost" className={`py-12 flex flex-col items-center justify-center gap-2 border-dashed border-base-content/10 ${className}`}>
        <div className="w-12 h-12 rounded-full bg-base-content/5 flex items-center justify-center text-base-content/20">
          <Clock size={24} />
        </div>
        <Text variant="caption" color="subtle">No recitation on this day</Text>
      </Card>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex justify-between items-center px-1">
        <Text variant="caption" weight="bold">{title}</Text>
        <Badge variant="secondary" size="sm">{activities.length} Records</Badge>
      </div>

      <List variant="spaced" gap={2}>
        {activities.map((zikr) => (
          <ListItem
            key={zikr.id}
            variant="surface"
            title={zikr.name}
            description={zikr.time}
            trailing={
              <div className="flex flex-col items-end">
                <Text variant="body" weight="bold" className="text-primary">
                  {zikr.count.toLocaleString()}
                </Text>
                <Text variant="caption" color="subtle">Counts</Text>
              </div>
            }
          />
        ))}
      </List>
    </div>
  );
};
