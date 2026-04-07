import type {
  SpiritualAyat,
  SpiritualHadith,
  TasbeehItem,
} from "../types/models";
import { TASBEEH_CATALOG_SEED, tasbeehToLegacyItem } from "./tasbeehCatalogSeed";

export const TASBEEH_CONTENT_VERSION = "arabic-urdu-v1";

/** Session-only: splash timer is skipped for the rest of the browser tab after first completion. */
export const SPLASH_SESSION_STORAGE_KEY = "tasbeeh_splash_seen";

/** First-time onboarding; local-only until synced with auth backend (e.g. Firebase). */
export const ONBOARDING_COMPLETED_STORAGE_KEY = "tasbeeh_onboarding_completed";

/** Minimum time the splash screen stays visible before routing (ms). */
export const SPLASH_MIN_DURATION_MS = 2500;

/** Counter list derived from bundled catalog seed (see `TASBEEH_CATALOG_SEED`). */
export const DEFAULT_TASBEEH: TasbeehItem[] = TASBEEH_CATALOG_SEED.flatMap(
  (s) => s.items,
).map(tasbeehToLegacyItem);

export const AYAT_OF_THE_DAY: SpiritualAyat[] = [
  {
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    urdu: "خب، اللہ کے ذکر سے دلوں کو اطمینان حاصل ہوتا ہے۔",
    english: "Unquestionably, by the remembrance of Allah hearts are assured.",
    source: "Qur'an 13:28",
  },
  {
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    urdu: "پس تم مجھے یاد کرو، میں تمہیں یاد کروں گا۔",
    english: "So remember Me; I will remember you.",
    source: "Qur'an 2:152",
  },
  {
    arabic: "وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنْفَعُ الْمُؤْمِنِينَ",
    urdu: "اور نصیحت کر، کیونکہ نصیحت مومنوں کو فائده دیتی ہے۔",
    english: "And remind, for indeed reminder benefits the believers.",
    source: "Qur'an 51:55",
  },
  {
    arabic: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ",
    urdu: "اور تمہارے رب نے فرمایا: مجھے پکارو، میں تمہاری دعا قبول کروں گا۔",
    english: 'And your Lord says, "Call upon Me; I will respond to you."',
    source: "Qur'an 40:60",
  },
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    urdu: "یقیناً تنگی کے ساتھ آسانی ہے۔",
    english: "Indeed, with hardship [will be] ease.",
    source: "Qur'an 94:6",
  },
];

export const HADITH_OF_THE_DAY: SpiritualHadith[] = [
  {
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    urdu: "اعمال کا دارومدار نیتوں پر ہے۔",
    english: "Actions are judged by intentions.",
    source: "Sahih al-Bukhari & Muslim",
  },
  {
    arabic: "مَنْ لَا يَشْكُرِ النَّاسَ لَا يَشْكُرُ اللَّهَ",
    urdu: "جو لوگوں کا شکر نہیں ادا کرتا، وہ اللہ کا شکر بھی نہیں کرتا۔",
    english: "Whoever does not thank people has not thanked Allah.",
    source: "Hadith — Tirmidhi",
  },
  {
    arabic: "الطُّهُورُ شَطْرُ الْإِيمَانِ",
    urdu: "پاکیزگی ایمان کا آدھا حصہ ہے۔",
    english: "Purity is half of faith.",
    source: "Sahih Muslim",
  },
  {
    arabic: "لَا تَقُومُ السَّاعَةُ حَتَّى يُقْبَضَ الْعِلْمُ",
    urdu: "قیامت اس وقت تک نہیں آئے گی جب تک علم نہ اٹھا لیا جائے۔",
    english: "Knowledge will be taken away before the Hour.",
    source: "Hadith — Bukhari",
  },
  {
    arabic: "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ",
    urdu: "صدقے سے مال میں کمی نہیں آتی۔",
    english: "Charity does not decrease wealth.",
    source: "Sahih Muslim",
  },
];

export const MILESTONES = [100, 500, 1000, 5000, 10000, 25000, 50000, 100000];

export const VALID_THEMES = ["light", "dark"] as const;

export type ThemeId = (typeof VALID_THEMES)[number];

export const THEME_COLOR_META: Record<ThemeId, string> = {
  light: "#f8fafc",
  dark: "#020617",
};
