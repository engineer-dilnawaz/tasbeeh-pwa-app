import {
  endOfDay,
  format,
  parse,
  parseISO,
  startOfDay,
  subDays,
} from "date-fns";

import type {
  TasbeehCollectionGroupRow,
  TasbeehScheduleType,
} from "@/features/tasbeeh/services/tasbeehDb";

export type CollectionListScheduleFilter = "all" | TasbeehScheduleType;

/** Calendar-driven date filter for the collections list. */
export type CollectionListDateMode =
  | "any"
  /** Last 7 calendar days including today; uses `dateField` timestamp. */
  | "updated_last_7"
  /** Last 30 calendar days including today; uses `dateField` timestamp. */
  | "updated_last_30"
  /** Match if the `dateField` calendar day is in `pickedDates`. */
  | "pick_dates"
  /** Inclusive local-date range on `dateField`; uses `pickedRange`. */
  | "pick_range";

/** Inclusive `yyyy-MM-dd` bounds for `pick_range` (local calendar). */
export type CollectionListPickedRange = { from: string; to: string };

/** Which timestamp date filters use (rolling, picked days, and range). */
export type CollectionListDateField = "created_at" | "updated_at";

export type CollectionListTagMatchMode = "any" | "all";

export type CollectionListSortKey =
  | "sort_order"
  | "title_asc"
  | "title_desc"
  | "updated_desc"
  | "updated_asc"
  | "created_desc"
  | "created_asc";

export interface CollectionListFilters {
  searchQuery: string;
  includeArchived: boolean;
  onlyDefault: boolean;
  onlyWithReminders: boolean;
  scheduleType: CollectionListScheduleFilter;
  selectedTags: string[];
  tagMatchMode: CollectionListTagMatchMode;
  dateMode: CollectionListDateMode;
  /** Which field rolling / pick / range filters compare. */
  dateField: CollectionListDateField;
  /** Local calendar keys `yyyy-MM-dd`; used when `dateMode === "pick_dates"`. */
  pickedDates: string[];
  /** Used when `dateMode === "pick_range"`; inclusive on `dateField`. */
  pickedRange: CollectionListPickedRange | null;
  sortBy: CollectionListSortKey;
}

export const defaultCollectionListFilters: CollectionListFilters = {
  searchQuery: "",
  includeArchived: false,
  onlyDefault: false,
  onlyWithReminders: false,
  scheduleType: "all",
  selectedTags: [],
  tagMatchMode: "any",
  dateMode: "any",
  dateField: "updated_at",
  pickedDates: [],
  pickedRange: null,
  sortBy: "sort_order",
};

function normTag(t: string) {
  return t.trim().toLowerCase();
}

function rowTagsNormalized(row: TasbeehCollectionGroupRow): string[] {
  return row.tags.map((t) => normTag(t)).filter(Boolean);
}

/** Local `yyyy-MM-dd` for an ISO timestamp (collections list + filter UI). */
export function collectionCalendarDateKey(iso: string): string {
  return format(parseISO(iso), "yyyy-MM-dd");
}

function rowDateIso(
  row: TasbeehCollectionGroupRow,
  dateField: CollectionListDateField,
): string {
  return dateField === "created_at" ? row.createdAt : row.updatedAt;
}

function rowMatchesDateFilters(
  row: TasbeehCollectionGroupRow,
  dateMode: CollectionListDateMode,
  dateField: CollectionListDateField,
  pickedDates: string[],
  pickedRange: CollectionListPickedRange | null,
): boolean {
  if (dateMode === "any") return true;
  const now = new Date();
  const ts = parseISO(rowDateIso(row, dateField)).getTime();
  if (dateMode === "updated_last_7") {
    const start = startOfDay(subDays(now, 6));
    return ts >= start.getTime();
  }
  if (dateMode === "updated_last_30") {
    const start = startOfDay(subDays(now, 29));
    return ts >= start.getTime();
  }
  if (dateMode === "pick_dates") {
    if (pickedDates.length === 0) return true;
    const set = new Set(pickedDates);
    const key = collectionCalendarDateKey(rowDateIso(row, dateField));
    return set.has(key);
  }
  if (dateMode === "pick_range") {
    if (!pickedRange?.from || !pickedRange.to) return true;
    const d0 = parse(pickedRange.from, "yyyy-MM-dd", new Date());
    const d1 = parse(pickedRange.to, "yyyy-MM-dd", new Date());
    const lo = Math.min(startOfDay(d0).getTime(), startOfDay(d1).getTime());
    const hi = Math.max(endOfDay(d0).getTime(), endOfDay(d1).getTime());
    return ts >= lo && ts <= hi;
  }
  return true;
}

function rowMatchesTagFilters(
  row: TasbeehCollectionGroupRow,
  selectedTags: string[],
  tagMatchMode: CollectionListTagMatchMode,
): boolean {
  if (selectedTags.length === 0) return true;
  const rowNorm = rowTagsNormalized(row);
  const selectedNorm = selectedTags.map(normTag).filter(Boolean);
  if (selectedNorm.length === 0) return true;

  if (tagMatchMode === "all") {
    return selectedNorm.every((t) => rowNorm.includes(t));
  }
  return selectedNorm.some((t) => rowNorm.includes(t));
}

export function sortCollectionRows(
  rows: TasbeehCollectionGroupRow[],
  sortBy: CollectionListSortKey,
): TasbeehCollectionGroupRow[] {
  const out = [...rows];
  const byTitle = (a: TasbeehCollectionGroupRow, b: TasbeehCollectionGroupRow) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
  const byUpdated = (
    a: TasbeehCollectionGroupRow,
    b: TasbeehCollectionGroupRow,
  ) => parseISO(a.updatedAt).getTime() - parseISO(b.updatedAt).getTime();
  const byCreated = (
    a: TasbeehCollectionGroupRow,
    b: TasbeehCollectionGroupRow,
  ) => parseISO(a.createdAt).getTime() - parseISO(b.createdAt).getTime();

  switch (sortBy) {
    case "sort_order":
      out.sort(
        (a, b) =>
          a.sortOrder - b.sortOrder ||
          byTitle(a, b) ||
          a.id.localeCompare(b.id),
      );
      break;
    case "title_asc":
      out.sort((a, b) => byTitle(a, b) || a.id.localeCompare(b.id));
      break;
    case "title_desc":
      out.sort((a, b) => byTitle(b, a) || a.id.localeCompare(b.id));
      break;
    case "updated_desc":
      out.sort((a, b) => byUpdated(b, a) || a.id.localeCompare(b.id));
      break;
    case "updated_asc":
      out.sort((a, b) => byUpdated(a, b) || a.id.localeCompare(b.id));
      break;
    case "created_desc":
      out.sort((a, b) => byCreated(b, a) || a.id.localeCompare(b.id));
      break;
    case "created_asc":
      out.sort((a, b) => byCreated(a, b) || a.id.localeCompare(b.id));
      break;
    default:
      break;
  }
  return out;
}

export function filtersEqual(
  a: CollectionListFilters,
  b: CollectionListFilters,
): boolean {
  if (
    a.searchQuery !== b.searchQuery ||
    a.includeArchived !== b.includeArchived ||
    a.onlyDefault !== b.onlyDefault ||
    a.onlyWithReminders !== b.onlyWithReminders ||
    a.scheduleType !== b.scheduleType ||
    a.tagMatchMode !== b.tagMatchMode ||
    a.dateMode !== b.dateMode ||
    a.dateField !== b.dateField ||
    a.sortBy !== b.sortBy
  ) {
    return false;
  }
  if (a.selectedTags.length !== b.selectedTags.length) return false;
  const as = [...a.selectedTags].sort();
  const bs = [...b.selectedTags].sort();
  if (!as.every((t, i) => t === bs[i])) return false;
  if (a.pickedDates.length !== b.pickedDates.length) return false;
  const ad = [...a.pickedDates].sort();
  const bd = [...b.pickedDates].sort();
  if (!ad.every((t, i) => t === bd[i])) return false;
  const ar = a.pickedRange;
  const br = b.pickedRange;
  if (!ar && !br) return true;
  if (!ar || !br) return false;
  return ar.from === br.from && ar.to === br.to;
}

export function hasActiveCollectionFilters(
  f: CollectionListFilters,
): boolean {
  return !filtersEqual(f, defaultCollectionListFilters);
}

export function collectionMatchesListFilters(
  row: TasbeehCollectionGroupRow,
  filters: CollectionListFilters,
): boolean {
  const q = filters.searchQuery.trim().toLowerCase();
  if (q.length > 0) {
    const title = row.title.toLowerCase();
    const desc = (row.description ?? "").toLowerCase();
    if (!title.includes(q) && !desc.includes(q)) return false;
  }
  if (!filters.includeArchived && row.isArchived) return false;
  if (filters.onlyDefault && !row.isDefault) return false;
  if (filters.onlyWithReminders && row.reminderPolicy === "off") return false;
  if (
    filters.scheduleType !== "all" &&
    row.scheduleType !== filters.scheduleType
  ) {
    return false;
  }
  if (
    !rowMatchesDateFilters(
      row,
      filters.dateMode,
      filters.dateField,
      filters.pickedDates,
      filters.pickedRange,
    )
  )
    return false;
  if (
    !rowMatchesTagFilters(row, filters.selectedTags, filters.tagMatchMode)
  ) {
    return false;
  }
  return true;
}

export function applyCollectionListFilters(
  rows: TasbeehCollectionGroupRow[],
  filters: CollectionListFilters,
): TasbeehCollectionGroupRow[] {
  const filtered = rows.filter((row) =>
    collectionMatchesListFilters(row, filters),
  );
  return sortCollectionRows(filtered, filters.sortBy);
}
