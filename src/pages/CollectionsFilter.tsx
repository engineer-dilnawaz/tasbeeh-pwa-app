import { Check, Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import React from "react";
import { Squircle as SmoothDaySquircle } from "corner-smoothing";
import {
  DayPicker,
  type DateRange,
  type DayButtonProps,
} from "react-day-picker";
import { addMonths, format, parse as parseDate } from "date-fns";
import { useNavigate } from "react-router-dom";

import { useCollections } from "@/features/tasbeeh/collections/hooks/useCollections";
import { useCollectionsFilterStore } from "@/features/tasbeeh/collections/store/collectionsFilterStore";
import {
  applyCollectionListFilters,
  defaultCollectionListFilters,
  type CollectionListDateField,
  type CollectionListDateMode,
  type CollectionListFilters,
  type CollectionListScheduleFilter,
  type CollectionListSortKey,
  type CollectionListTagMatchMode,
} from "@/features/tasbeeh/collections/utils/collectionListFilters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/shared/design-system/ui/Select";
import { SegmentedControl } from "@/shared/design-system/ui/SegmentedControl";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Switch } from "@/shared/design-system/ui/Switch";
import { Text } from "@/shared/design-system/ui/Text";
import { TextInput } from "@/shared/design-system/ui/TextInput";
import { collectionsFilterCalendarClassNames } from "@/shared/design-system/ui/CalendarStyles";

const SCHEDULE_OPTIONS: Array<{
  label: string;
  value: CollectionListScheduleFilter;
}> = [
  { value: "all", label: "All" },
  { value: "prayer_specific", label: "Prayer" },
  { value: "anytime_today", label: "Anytime" },
];

const DATE_FIELD_OPTIONS: Array<{
  label: string;
  value: CollectionListDateField;
}> = [
  { value: "created_at", label: "Created at" },
  { value: "updated_at", label: "Updated at" },
];

const DATE_MODE_OPTIONS: Array<{
  value: CollectionListDateMode;
  label: string;
}> = [
  { value: "any", label: "Any time" },
  { value: "updated_last_7", label: "Last 7 days" },
  { value: "updated_last_30", label: "Last 30 days" },
  { value: "pick_dates", label: "Pick dates" },
  { value: "pick_range", label: "Pick date range" },
];

const FILTER_CALENDAR_COMPONENTS = {
  /** Hidden: month swipe uses `SwipeMonthCalendarFrame` instead. */
  Nav: (): React.JSX.Element => <></>,
};

/** Filter calendars: smooth squircle on each day (corner-smoothing). */
const FILTER_CAL_DAY_SQUIRCLE = { cornerRadius: 18, cornerSmoothing: 0.92 } as const;

/** corner-smoothing `Squircle` typings default `as` to div; `as="button"` is valid at runtime. */
const SmoothDaySquircleButton = SmoothDaySquircle as unknown as React.ComponentType<
  Record<string, unknown>
>;

function FilterCalendarSquircleDayButton(
  props: DayButtonProps,
): React.JSX.Element {
  const { modifiers, className, day, ...buttonProps } = props;
  void day;
  const innerRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (modifiers.focused) innerRef.current?.focus();
  }, [modifiers.focused]);

  const rangeCell =
    modifiers.range_start === true ||
    modifiers.range_middle === true ||
    modifiers.range_end === true;

  const selectedDiscrete =
    modifiers.selected === true && !rangeCell;

  const selectedCls = selectedDiscrete
    ? "!bg-primary !text-primary-content"
    : "";

  const todayCls =
    modifiers.today === true && !rangeCell && !selectedDiscrete
      ? "!bg-primary/12 !text-primary font-semibold"
      : "";

  const cls = [
    className?.replace(/\brounded-none\b/g, "").trim(),
    "w-full max-w-[calc(100%-4px)]",
    todayCls,
    selectedCls,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <SmoothDaySquircleButton
      as="button"
      ref={innerRef}
      cornerRadius={FILTER_CAL_DAY_SQUIRCLE.cornerRadius}
      cornerSmoothing={FILTER_CAL_DAY_SQUIRCLE.cornerSmoothing}
      {...buttonProps}
      className={cls}
    />
  );
}
FilterCalendarSquircleDayButton.displayName = "FilterCalendarSquircleDayButton";

function SwipeMonthCalendarFrame({
  month,
  onMonthChange,
  children,
}: {
  month: Date;
  onMonthChange: (next: Date) => void;
  children: React.ReactNode;
}) {
  const touchStartX = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const endX = e.changedTouches[0]?.clientX;
    if (endX == null) {
      touchStartX.current = null;
      return;
    }
    const dx = endX - touchStartX.current;
    touchStartX.current = null;
    const threshold = 56;
    if (dx > threshold) onMonthChange(addMonths(month, -1));
    else if (dx < -threshold) onMonthChange(addMonths(month, 1));
  };

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {children}
    </div>
  );
}

const TAG_MATCH_OPTIONS: Array<{
  label: string;
  value: CollectionListTagMatchMode;
}> = [
  { value: "any", label: "Match any" },
  { value: "all", label: "Match all" },
];

const SORT_OPTIONS: Array<{
  value: CollectionListSortKey;
  label: string;
  description: string;
}> = [
  {
    value: "sort_order",
    label: "Default order",
    description: "Your manual list order",
  },
  {
    value: "title_asc",
    label: "Name A → Z",
    description: "Alphabetical",
  },
  {
    value: "title_desc",
    label: "Name Z → A",
    description: "Reverse alphabetical",
  },
  {
    value: "updated_desc",
    label: "Recently updated",
    description: "Newest edits first",
  },
  {
    value: "updated_asc",
    label: "Oldest updates",
    description: "Least recently edited",
  },
  {
    value: "created_desc",
    label: "Newest first",
    description: "Recently created",
  },
  {
    value: "created_asc",
    label: "Oldest first",
    description: "Earliest created",
  },
];

function dateKeysFromDates(dates: Date[] | undefined): string[] {
  if (!dates?.length) return [];
  const keys = dates.map((d) => format(d, "yyyy-MM-dd"));
  return [...new Set(keys)].sort();
}

function datesFromKeys(keys: string[]): Date[] {
  return keys.map((k) => parseDate(k, "yyyy-MM-dd", new Date()));
}

function FilterToggleRow({
  title,
  description,
  checked,
  onChange,
  withDivider = true,
}: {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  withDivider?: boolean;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`flex cursor-pointer select-none items-center justify-between gap-3 py-3 text-left ${
        withDivider ? "border-b border-base-content/8" : ""
      }`}
      onClick={() => onChange(!checked)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onChange(!checked);
        }
      }}
    >
      <div className="min-w-0 flex-1">
        <Text variant="body" weight="medium">
          {title}
        </Text>
        {description ? (
          <Text variant="caption" color="subtle" className="mt-0.5 block">
            {description}
          </Text>
        ) : null}
      </div>
      <div
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Switch checked={checked} onChange={onChange} />
      </div>
    </div>
  );
}

export default function CollectionsFilter() {
  const navigate = useNavigate();
  const setFilters = useCollectionsFilterStore((s) => s.setFilters);
  const prefersReducedMotion = useReducedMotion();

  const [draft, setDraft] = React.useState<CollectionListFilters>(() => ({
    ...useCollectionsFilterStore.getState().filters,
  }));

  const [filterCalMonth, setFilterCalMonth] = React.useState(() => new Date());
  const [rangeSelection, setRangeSelection] = React.useState<
    DateRange | undefined
  >(() => {
    const pr = useCollectionsFilterStore.getState().filters.pickedRange;
    if (pr?.from && pr.to) {
      return {
        from: parseDate(pr.from, "yyyy-MM-dd", new Date()),
        to: parseDate(pr.to, "yyyy-MM-dd", new Date()),
      };
    }
    return undefined;
  });

  React.useLayoutEffect(() => {
    setDraft({ ...useCollectionsFilterStore.getState().filters });
  }, []);

  const { collections } = useCollections();

  const availableTags = React.useMemo(() => {
    const set = new Set<string>();
    for (const c of collections) {
      for (const t of c.tags) {
        const trimmed = t.trim();
        if (trimmed) set.add(trimmed);
      }
    }
    return [...set].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" }),
    );
  }, [collections]);

  const sortLabel = React.useMemo(
    () => SORT_OPTIONS.find((o) => o.value === draft.sortBy)?.label ?? "Sort",
    [draft.sortBy],
  );

  const matchCount = React.useMemo(
    () => applyCollectionListFilters(collections, draft).length,
    [collections, draft],
  );

  const updateDraft = React.useCallback(
    (patch: Partial<CollectionListFilters>) => {
      setDraft((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  const toggleTag = (tag: string) => {
    setDraft((prev) => {
      const on = prev.selectedTags.includes(tag);
      return {
        ...prev,
        selectedTags: on
          ? prev.selectedTags.filter((t) => t !== tag)
          : [...prev.selectedTags, tag],
      };
    });
  };

  const handleApply = () => {
    setFilters(draft);
    navigate("/collections");
  };

  const handleClearFilters = () => {
    setDraft({ ...defaultCollectionListFilters });
    setRangeSelection(undefined);
    setFilterCalMonth(new Date());
  };

  // Only on `dateMode` changes: in-progress range selection stays in `rangeSelection` + `onSelect`.
  React.useEffect(() => {
    if (draft.dateMode !== "pick_range") {
      setRangeSelection(undefined);
      return;
    }
    const pr = draft.pickedRange;
    if (pr?.from && pr.to) {
      setRangeSelection({
        from: parseDate(pr.from, "yyyy-MM-dd", new Date()),
        to: parseDate(pr.to, "yyyy-MM-dd", new Date()),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- pickedRange only when switching into `pick_range`
  }, [draft.dateMode]);

  const showDateCalendar =
    draft.dateMode === "pick_dates" || draft.dateMode === "pick_range";

  const calendarMotion = prefersReducedMotion
    ? {
        initial: false as const,
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] as const },
      };

  return (
    <div className="relative mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-[480px] flex-col">
      <div className="flex shrink-0 justify-end px-4 py-3">
        <Text variant="caption" color="subtle" className="tabular-nums">
          {matchCount} of {collections.length} match
        </Text>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-4 px-2 pb-[calc(168px+env(safe-area-inset-bottom,0px))] pt-0">
            <Squircle
              cornerRadius={28}
              cornerSmoothing={0.92}
              className="surface-card p-4"
            >
              <Text variant="body" weight="semibold">
                Search
              </Text>
              <div className="mt-2">
                <TextInput
                  size="md"
                  variant="bordered"
                  className="border-base-300 bg-base-200"
                  placeholder="Title or description"
                  value={draft.searchQuery}
                  onChange={(e) => updateDraft({ searchQuery: e.target.value })}
                  leftIcon={<Search size={18} className="opacity-50" aria-hidden />}
                  aria-label="Search collections"
                />
              </div>
            </Squircle>

            <Squircle
              cornerRadius={28}
              cornerSmoothing={0.92}
              className="surface-card p-4"
            >
              <Text variant="body" weight="semibold">
                Date
              </Text>
              <Text variant="caption" color="subtle" className="mt-0.5 block">
                Choose which date applies, then how to narrow the list.
              </Text>

              <div className="mt-3">
                <SegmentedControl
                  size="sm"
                  uppercase={false}
                  activeItemClassName="bg-white dark:bg-base-100"
                  activeTextClassName="text-base-content"
                  options={DATE_FIELD_OPTIONS}
                  value={draft.dateField}
                  onChange={(value) =>
                    updateDraft({ dateField: value as CollectionListDateField })
                  }
                />
              </div>

              <div className="mt-3 grid grid-cols-6 gap-2.5">
                {DATE_MODE_OPTIONS.map((opt, index) => {
                  const on = draft.dateMode === opt.value;
                  const colSpan = index < 3 ? "col-span-2" : "col-span-3";
                  return (
                    <label
                      key={opt.value}
                      className={`${colSpan} flex min-h-10 cursor-pointer items-center gap-2 rounded-full border px-3 py-2 has-focus-visible:ring-2 has-focus-visible:ring-primary/35 has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-base-100 ${
                        on
                          ? "border-primary bg-primary/10"
                          : "border-transparent bg-base-200/90 hover:bg-base-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="collections-date-mode"
                        className={`radio radio-sm shrink-0 ${
                          on ? "radio-primary" : "radio-neutral"
                        }`}
                        checked={on}
                        onChange={() => {
                          setDraft((prev) => ({
                            ...prev,
                            dateMode: opt.value,
                            pickedDates:
                              opt.value === "pick_dates" ? prev.pickedDates : [],
                            pickedRange:
                              opt.value === "pick_range"
                                ? prev.pickedRange
                                : null,
                          }));
                        }}
                      />
                      <Text
                        variant="body"
                        weight="semibold"
                        className="flex-1 text-balance text-left text-[13px] leading-snug sm:text-sm"
                      >
                        {opt.label}
                      </Text>
                    </label>
                  );
                })}
              </div>

              <AnimatePresence initial={false}>
                {showDateCalendar ? (
                  <motion.div
                    key={
                      draft.dateMode === "pick_dates"
                        ? "cal-multi"
                        : "cal-range"
                    }
                    className="mt-3 overflow-hidden"
                    initial={calendarMotion.initial}
                    animate={calendarMotion.animate}
                    exit={calendarMotion.exit}
                    transition={calendarMotion.transition}
                  >
                    <SwipeMonthCalendarFrame
                      month={filterCalMonth}
                      onMonthChange={setFilterCalMonth}
                    >
                      {draft.dateMode === "pick_dates" ? (
                        <DayPicker
                          mode="multiple"
                          month={filterCalMonth}
                          onMonthChange={setFilterCalMonth}
                          selected={datesFromKeys(draft.pickedDates)}
                          onSelect={(dates) =>
                            updateDraft({
                              pickedDates: dateKeysFromDates(dates),
                            })
                          }
                          components={{
                            ...FILTER_CALENDAR_COMPONENTS,
                            DayButton: FilterCalendarSquircleDayButton,
                          }}
                          className="w-full"
                          classNames={collectionsFilterCalendarClassNames}
                        />
                      ) : (
                        <DayPicker
                          mode="range"
                          month={filterCalMonth}
                          onMonthChange={setFilterCalMonth}
                          selected={rangeSelection}
                          onSelect={(range) => {
                            setRangeSelection(range);
                            if (range?.from && range.to) {
                              updateDraft({
                                pickedRange: {
                                  from: format(range.from, "yyyy-MM-dd"),
                                  to: format(range.to, "yyyy-MM-dd"),
                                },
                              });
                            } else {
                              updateDraft({ pickedRange: null });
                            }
                          }}
                          components={{
                            ...FILTER_CALENDAR_COMPONENTS,
                            DayButton: FilterCalendarSquircleDayButton,
                          }}
                          className="w-full"
                          classNames={collectionsFilterCalendarClassNames}
                        />
                      )}
                    </SwipeMonthCalendarFrame>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </Squircle>

            <Squircle
              cornerRadius={28}
              cornerSmoothing={0.92}
              className="surface-card p-4"
            >
              <Text variant="body" weight="semibold">
                Tags
              </Text>
              {availableTags.length === 0 ? (
                <Text variant="caption" color="subtle" className="mt-2 block">
                  No tags on any collection yet. Add tags in the collection
                  editor.
                </Text>
              ) : (
                <>
                  <motion.div
                    layout
                    className="mt-3 flex flex-wrap gap-2"
                  >
                    {availableTags.map((tag) => {
                      const isOn = draft.selectedTags.includes(tag);
                      return (
                        <motion.div key={tag} layout>
                          <motion.button
                            type="button"
                            aria-pressed={isOn}
                            onClick={() => toggleTag(tag)}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                              isOn
                                ? "border-primary/40 bg-primary text-primary-content"
                                : "border-primary/20 bg-primary/8 text-base-content/85 hover:border-primary/30 hover:bg-primary/12"
                            }`}
                            whileTap={
                              prefersReducedMotion
                                ? undefined
                                : { scale: 0.98 }
                            }
                            transition={{
                              duration: 0.12,
                              ease: "easeOut",
                            }}
                          >
                            <AnimatePresence initial={false}>
                              {isOn ? (
                                <motion.span
                                  key="check"
                                  initial={{ opacity: 0, scale: 0.6 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.6 }}
                                  transition={{
                                    duration: 0.14,
                                    ease: "easeOut",
                                  }}
                                  className="inline-flex items-center"
                                  aria-hidden
                                >
                                  <Check size={14} />
                                </motion.span>
                              ) : null}
                            </AnimatePresence>
                            <span>{tag}</span>
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                  {draft.selectedTags.length >= 2 ? (
                    <div className="mt-3">
                      <Text
                        variant="caption"
                        color="subtle"
                        weight="semibold"
                        className="mb-2 block"
                      >
                        When several tags are selected
                      </Text>
                      <SegmentedControl
                        size="sm"
                        uppercase={false}
                        activeItemClassName="bg-white dark:bg-base-100"
                        activeTextClassName="text-base-content"
                        options={TAG_MATCH_OPTIONS}
                        value={draft.tagMatchMode}
                        onChange={(value) =>
                          updateDraft({
                            tagMatchMode: value as CollectionListTagMatchMode,
                          })
                        }
                      />
                    </div>
                  ) : null}
                </>
              )}
            </Squircle>

            <Squircle
              cornerRadius={28}
              cornerSmoothing={0.92}
              className="surface-card p-4"
            >
              <Text variant="body" weight="semibold">
                Sort
              </Text>
              <div className="mt-2">
                <Select
                  itemTone="neutral"
                  value={draft.sortBy}
                  onValueChange={(v) =>
                    updateDraft({ sortBy: v as CollectionListSortKey })
                  }
                >
                  <SelectTrigger
                    aria-label="Sort collections list"
                    className="rounded-full border-base-content/20 bg-base-200 hover:bg-base-300/50 focus:ring-0! focus:ring-offset-0!"
                  >
                    <span className="min-w-0 truncate text-left text-sm font-semibold text-base-content">
                      {sortLabel}
                    </span>
                  </SelectTrigger>
                  <SelectContent
                    title="Sort collections"
                    snapPoints={["72%"]}
                    presentation="height"
                    initialSnap={0}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        label={opt.label}
                        description={opt.description}
                      />
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Squircle>

            <Squircle
              cornerRadius={28}
              cornerSmoothing={0.92}
              className="surface-card p-4"
            >
              <Text variant="body" weight="semibold">
                Schedule
              </Text>
              <div className="mt-2">
                <SegmentedControl
                  size="sm"
                  uppercase={false}
                  activeItemClassName="bg-white dark:bg-base-100"
                  activeTextClassName="text-base-content"
                  options={SCHEDULE_OPTIONS}
                  value={draft.scheduleType}
                  onChange={(value) =>
                    updateDraft({
                      scheduleType: value as CollectionListScheduleFilter,
                    })
                  }
                />
              </div>
            </Squircle>

            <Squircle
              cornerRadius={28}
              cornerSmoothing={0.92}
              className="surface-card px-4 pb-1 pt-2"
            >
              <FilterToggleRow
                title="Include archived"
                description="Show collections you have archived."
                checked={draft.includeArchived}
                onChange={(checked) => updateDraft({ includeArchived: checked })}
              />
              <FilterToggleRow
                title="Default collection only"
                checked={draft.onlyDefault}
                onChange={(checked) => updateDraft({ onlyDefault: checked })}
              />
              <FilterToggleRow
                title="Has reminders"
                description="Gentle or strong reminder policy only."
                checked={draft.onlyWithReminders}
                onChange={(checked) =>
                  updateDraft({ onlyWithReminders: checked })
                }
                withDivider={false}
              />
            </Squircle>
          </div>
        </div>

        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-30 pt-12 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.00)_0%,rgba(0,0,0,0.05)_28%,rgba(0,0,0,0.12)_62%,rgba(0,0,0,0.24)_100%)] dark:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.00)_0%,rgba(255,255,255,0.04)_28%,rgba(255,255,255,0.08)_62%,rgba(255,255,255,0.14)_100%)]"
        >
          <div className="pointer-events-auto mx-auto w-full max-w-[480px] px-2 pb-0">
            <Squircle
              cornerRadius={28}
              cornerSmoothing={0.92}
              className="surface-card relative z-10 bg-(--color-surface-card) px-3 pt-3 pb-[max(12px,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_28px_rgba(0,0,0,0.45)]"
            >
              <div className="grid gap-2">
                <Squircle cornerRadius={100} cornerSmoothing={0.92} asChild>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="flex h-14 w-full items-center justify-center bg-neutral px-4 text-sm font-semibold text-neutral-content"
                  >
                    Apply Filters
                  </button>
                </Squircle>
                <Squircle cornerRadius={100} cornerSmoothing={0.92} asChild>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="flex h-14 w-full items-center justify-center rounded-full border border-base-content/20 bg-transparent px-4 text-sm font-semibold text-base-content"
                  >
                    Clear Filters
                  </button>
                </Squircle>
              </div>
            </Squircle>
          </div>
        </div>
      </div>
    </div>
  );
}
