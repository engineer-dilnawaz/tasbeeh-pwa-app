/** App copy, milestones, theme metadata — import from here for pages and features. */
export {
  DEFAULT_TASBEEH,
  AYAT_OF_THE_DAY,
  HADITH_OF_THE_DAY,
  MILESTONES,
  SPLASH_SESSION_STORAGE_KEY,
  SPLASH_MIN_DURATION_MS,
  TASBEEH_CONTENT_VERSION,
  VALID_THEMES,
  THEME_COLOR_META,
} from "./constants";
export type { ThemeId } from "./constants";
export type { SpiritualAyat, SpiritualHadith, TasbeehItem } from "../types/models";
export { getDayRotationIndex } from "../utils/dayRotation";
