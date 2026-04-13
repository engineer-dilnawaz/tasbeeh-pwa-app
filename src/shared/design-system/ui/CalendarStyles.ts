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
