import { type ClassNames } from "react-day-picker";

/**
 * Shared Tailwind classes for Divine Calendar Pro 3.8.
 * This ensures Gregorian and Hijri engines look identical and are easy to maintain.
 */
export const sharedCalendarClassNames: Partial<ClassNames> = {
  root: "w-full",
  months: "w-full",
  month: "w-full",
  month_caption: "flex justify-center items-center py-4",
  caption_label: "text-lg font-bold text-base-content capitalize",
  month_grid: "w-full border-collapse table-fixed mt-2",
  weekdays: "",
  weekday: "text-base-content/40 font-bold text-[11px] uppercase tracking-[0.2em] text-center pb-4 align-middle",
  week: "", // The tr element holding days
  
  // The 'day' is the td element. We make it a 'group' and pass modifiers to it.
  day: "p-0.5 align-middle group relative", 
  
  // The button lives inside the td. We target hover, selection, and today states here to ensure round corners.
  day_button: "w-[42px] h-[42px] mx-auto flex items-center justify-center rounded-[16px] transition-colors duration-300 hover:bg-primary/10 text-base font-semibold border-none outline-none focus:outline-none bg-transparent cursor-pointer group-[.is-today]:text-primary group-[.is-today]:bg-primary/10 group-[.is-selected]:!bg-primary group-[.is-selected]:!text-white",
  
  // Modifiers applied to the td wrapper:
  selected: "is-selected", // We just pass a class marker, button styles handle the rest!
  today: "is-today",
  outside: "opacity-20 pointer-events-none",
  disabled: "opacity-10 cursor-not-allowed",
  hidden: "opacity-0 invisible pointer-events-none",
};

/** Neutral selection for list filters: tight grid, continuous range row (no gaps). Nav hidden — swipe months. */
export const collectionsFilterCalendarClassNames: Partial<ClassNames> = {
  ...sharedCalendarClassNames,
  month_caption: "flex justify-center items-center py-3",
  month_grid:
    "w-full table-fixed border-collapse border-spacing-0 mt-1 [&_tbody]:border-spacing-0",
  weekday:
    "text-base-content/40 font-bold text-[11px] uppercase tracking-[0.14em] text-center pb-2 align-middle",
  nav: "hidden",
  button_previous: "hidden",
  button_next: "hidden",
  /** `group` required so `day_button` `group-[.is-selected]` / `group-[.is-today]` variants resolve. */
  day: "group p-0 m-0 align-stretch h-11 min-h-[2.75rem] text-center [.is-range-start.is-range-end]:rounded-full [.is-range-start:not(.is-range-end)]:rounded-l-full [.is-range-end:not(.is-range-start)]:rounded-r-full",
  today: "is-today",
  range_start: "is-range-start !bg-primary !text-primary-content",
  range_middle: "is-range-middle !bg-primary !text-primary-content",
  range_end: "is-range-end !bg-primary !text-primary-content",
  /** Discrete (multiple) selection fill lives on `DayButton` (squircle); range fill stays on `td`. */
  selected: "is-selected",
  /** Today / discrete selected fills are set on `FilterCalendarSquircleDayButton` (pick + range). */
  day_button:
    "mx-0 my-0 flex h-11 min-h-[2.75rem] w-full max-w-none cursor-pointer items-center justify-center rounded-none border-none bg-transparent text-[15px] font-semibold text-inherit shadow-none outline-none transition-colors hover:bg-primary/12 focus:outline-none disabled:pointer-events-none disabled:opacity-25 dark:hover:bg-primary/18 group-[.is-selected]:!bg-primary group-[.is-selected]:!text-primary-content group-[.is-range-start]:!bg-transparent group-[.is-range-middle]:!bg-transparent group-[.is-range-end]:!bg-transparent group-[.is-range-start]:!text-inherit group-[.is-range-middle]:!text-inherit group-[.is-range-end]:!text-inherit",
};
