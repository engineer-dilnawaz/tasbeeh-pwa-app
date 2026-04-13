import React, { useEffect, useRef, useState } from "react";
import { Text } from "./Text";

// ── Types ────────────────────────────────────────────────────────────────

export interface TimePickerProps {
  value?: { hour: number; minute: number };
  onChange?: (value: { hour: number; minute: number }) => void;
  hourFormat?: "12h" | "24h";
  className?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────

const ITEM_HEIGHT = 48; // px
const VISIBLE_ITEMS = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

// ── Helper: Generating arrays ─────────────────────────────────────────────

const hours24 = Array.from({ length: 24 }, (_, i) => i);
const hours12 = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from({ length: 60 }, (_, i) => i);
const phases = ["AM", "PM"] as const;

// ── Scroll Wheel Component ────────────────────────────────────────────────

interface WheelProps<T> {
  items: T[];
  selectedValue: T;
  onSelect: (value: T) => void;
  label?: string;
  format?: (value: T) => string;
  width?: number;
}

function Wheel<T extends string | number>({
  items,
  selectedValue,
  onSelect,
  label,
  format = (v) => v.toString().padStart(2, "0"),
  width = 80,
}: WheelProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Initial scroll position
  useEffect(() => {
    if (scrollRef.current) {
      const index = items.indexOf(selectedValue);
      if (index !== -1) {
        scrollRef.current.scrollTop = index * ITEM_HEIGHT;
        setScrollTop(index * ITEM_HEIGHT);
      }
    }
  }, [items]); // Re-run if items change (12h/24h)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setScrollTop(target.scrollTop);
    setIsScrolling(true);

    const timeout = setTimeout(() => {
      const index = Math.round(target.scrollTop / ITEM_HEIGHT);
      const newValue = items[index];
      if (newValue !== undefined && newValue !== selectedValue) {
        onSelect(newValue);
      }
      setIsScrolling(false);
    }, 100);

    return () => clearTimeout(timeout);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {label && (
        <Text variant="caption" color="subtle" weight="semibold">
          {label}
        </Text>
      )}
      <div
        className="relative overflow-hidden bg-base-200/50 rounded-2xl border border-base-content/5"
        style={{ height: CONTAINER_HEIGHT, width }}
      >
        {/* Selection Corridor - Minimalists highlight */}
        <div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 bg-primary/5 border-y border-primary/20 pointer-events-none z-0"
          style={{ height: ITEM_HEIGHT }}
        />

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto no-scrollbar snap-y snap-mandatory touch-pan-y overscroll-contain relative z-10"
        >
          {/* Buffers for center alignment */}
          <div style={{ height: ITEM_HEIGHT * 2 }} />

          {items.map((item, i) => {
            const isSelected = item === selectedValue;

            return (
              <div
                key={item}
                className="flex items-center justify-center snap-center snap-stop-always shrink-0 cursor-pointer"
                style={{ height: ITEM_HEIGHT }}
                onClick={() => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollTo({
                      top: i * ITEM_HEIGHT,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                <Text
                  variant="body"
                  weight="bold"
                  className={`text-2xl transition-all duration-300 ${isSelected ? "text-primary scale-110" : "text-base-content/20"}`}
                >
                  {format(item)}
                </Text>
              </div>
            );
          })}

          <div style={{ height: ITEM_HEIGHT * 2 }} />
        </div>
      </div>
    </div>
  );
}

// ── Main TimePicker ───────────────────────────────────────────────────────

export const TimePicker: React.FC<TimePickerProps> = ({
  value = { hour: 12, minute: 0 },
  onChange,
  hourFormat = "24h",
  className = "",
}) => {
  const is12h = hourFormat === "12h";

  // Translation for 12h display
  const displayHour = is12h
    ? value.hour % 12 === 0
      ? 12
      : value.hour % 12
    : value.hour;

  const currentPhase = value.hour < 12 ? "AM" : "PM";

  const handleHourSelect = (h: number) => {
    let newHour = h;
    if (is12h) {
      if (currentPhase === "PM" && h < 12) newHour = h + 12;
      if (currentPhase === "AM" && h === 12) newHour = 0;
      if (currentPhase === "PM" && h === 12) newHour = 12;
    }
    onChange?.({ ...value, hour: newHour });
  };

  const handleMinuteSelect = (m: number) => {
    onChange?.({ ...value, minute: m });
  };

  const handlePhaseSelect = (p: "AM" | "PM") => {
    let newHour = value.hour;
    if (p === "AM" && value.hour >= 12) newHour = value.hour - 12;
    if (p === "PM" && value.hour < 12) newHour = value.hour + 12;
    onChange?.({ ...value, hour: newHour });
  };

  return (
    <div
      className={`flex items-center justify-center gap-3 sm:gap-6 py-4 ${className}`}
    >
      <Wheel
        items={is12h ? hours12 : hours24}
        selectedValue={displayHour}
        onSelect={handleHourSelect}
        label="HOUR"
        width={70}
      />

      <div className="pt-6">
        <Text
          variant="heading"
          color="subtle"
          className="opacity-20 animate-pulse text-2xl"
        >
          :
        </Text>
      </div>

      <Wheel
        items={minutes}
        selectedValue={value.minute}
        onSelect={handleMinuteSelect}
        label="MINUTE"
        width={70}
      />

      {is12h && (
        <>
          <div className="w-2" />
          <Wheel
            items={phases as any}
            selectedValue={currentPhase}
            onSelect={handlePhaseSelect as any}
            label="PHASE"
            format={(v) => v as string}
            width={70}
          />
        </>
      )}
    </div>
  );
};
