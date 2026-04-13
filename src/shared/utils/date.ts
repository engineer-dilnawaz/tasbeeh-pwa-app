import { startOfWeek, addDays } from "date-fns";

/**
 * Generates an array of dates for the current week starting on the given day.
 */
export const getWeekDays = (baseDate: Date = new Date(), weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0): Date[] => {
  const start = startOfWeek(baseDate, { weekStartsOn });
  return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
};

// Note: Hijri formatting functions removed. 
// Use react-day-picker/hijri native components instead.
