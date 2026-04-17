import { addMonths, subMonths, addWeeks, subWeeks, format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { type DayPickerProps } from "react-day-picker";
import { Card } from "./Card";
import { GregorianCalendar } from "./GregorianCalendar";
import { HijriCalendar } from "./HijriCalendar";
import { SegmentedControl } from "./SegmentedControl";
import { Text } from "./Text";
import { sharedCalendarClassNames } from "./CalendarStyles";

export type CalendarVariant = "monthly" | "weekly" | "compact";
export type CalendarSystem = "gregorian" | "hijri";

export type ZikrRecord = {
  id: string;
  name: string;
  count: number;
  time: string;
};

export type CalendarProps = DayPickerProps & {
  className?: string;
  variant?: CalendarVariant;
  system?: CalendarSystem;
  onVariantChange?: (v: CalendarVariant) => void;
  onSystemChange?: (s: CalendarSystem) => void;
  intensity?: Record<string, number>;
  activities?: Record<string, ZikrRecord[]>;
};

/**
 * DivineCalendar Pro 3.7 — Clean Architecture Edition.
 * Composes isolated Gregorian and Hijri engines.
 */
export const Calendar: React.FC<CalendarProps> = ({
  className = "",
  variant = "monthly",
  system = "gregorian",
  onVariantChange,
  onSystemChange,
  intensity = {},
  activities = {},
  ...props
}) => {
  const [internalVariant, setInternalVariant] = useState(variant);
  const [internalSystem, setInternalSystem] = useState(system);
  const [currentMonth, setCurrentMonth] = useState(props.month || new Date());

  const activeVariant = onVariantChange ? variant : internalVariant;
  const activeSystem = onSystemChange ? system : internalSystem;

  // Swipe logic
  const handleDragEnd = (_e: any, info: any) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      // Swipe left = Next unit
      setCurrentMonth(activeVariant === "weekly" ? addWeeks(currentMonth, 1) : addMonths(currentMonth, 1));
    } else if (info.offset.x > threshold) {
      // Swipe right = Previous unit
      setCurrentMonth(activeVariant === "weekly" ? subWeeks(currentMonth, 1) : subMonths(currentMonth, 1));
    }
  };

  const handleSelect = (date: Date) => {
    if (props.mode === "single" && props.onSelect) {
      props.onSelect(date, date, {}, {} as any);
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* ── Header Controls ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 px-1">
        <SegmentedControl
          value={activeVariant}
          onChange={(v) =>
            onVariantChange ? onVariantChange(v) : setInternalVariant(v)
          }
          options={[
            { label: "Monthly", value: "monthly" },
            { label: "Weekly", value: "weekly" },
          ]}
        />
        <SegmentedControl
          value={activeSystem}
          onChange={(s) =>
            onSystemChange ? onSystemChange(s) : setInternalSystem(s)
          }
          options={[
            { label: "Gregorian", value: "gregorian" },
            { label: "Hijri", value: "hijri" },
          ]}
        />
      </div>

      {/* ── Calendar Content ─────────────────────────────────────────────────── */}
      <Card
        variant="glass"
        padding="none"
        radius="xl"
        className="border-none shadow-none overflow-hidden"
      >
        <div className="w-full">
          <AnimatePresence mode="wait">
            {activeVariant === "weekly" ? (
              <motion.div
                key={`weekly-${activeSystem}-${currentMonth.toISOString()}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="flex gap-2 justify-between px-3 pb-4 pt-4"
              >
                <div className="flex justify-between items-center px-4 pb-4 pt-2">
                  {Array.from({ length: 7 }).map((_, i) => {
                    // Extract start of week (Sunday by default)
                    const start = new Date(currentMonth);
                    start.setDate(start.getDate() - start.getDay());
                    const date = new Date(start);
                    date.setDate(date.getDate() + i);
                    
                    const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                    const selectedDate = (props as any).selected;
                    const isSelected = selectedDate && selectedDate instanceof Date && format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
                    
                    // Correct BCP47 identifier for Umm al-Qura Hijri Calendar
                    const displayDay = activeSystem === "hijri" 
                      ? new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura-nu-latn', { day: 'numeric' }).format(date)
                      : format(date, "d");

                    return (
                      <div key={date.toISOString()} className="flex flex-col items-center gap-2 flex-1">
                        <Text variant="caption" className="text-[11px] font-bold opacity-40 uppercase tracking-[0.2em]">
                          {format(date, "eeeee")}
                        </Text>
                        <div className={`group relative ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}>
                          <button
                            onClick={() => handleSelect(date)}
                            className={sharedCalendarClassNames.day_button}
                          >
                            {displayDay}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`${activeSystem}-${currentMonth.toISOString()}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="px-2 pb-4"
              >
                {activeSystem === "hijri" ? (
                  <HijriCalendar
                    {...(props as any)}
                    mode="single"
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                  />
                ) : (
                  <GregorianCalendar
                    {...(props as any)}
                    mode="single"
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      <Text
        variant="caption"
        className="text-center opacity-20 text-[10px] italic"
      >
        Swipe left or right to change months
      </Text>
    </div>
  );
};
