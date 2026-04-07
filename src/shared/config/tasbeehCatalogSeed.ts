import type { TasbeehSequenceDoc, Tasbeeh } from "@/shared/types/tasbeehCatalog";
import type { TasbeehItem } from "@/shared/types/models";

/** Legacy phrases – as objects for sequence items */
const LEGACY_ITEMS: Tasbeeh[] = [
  {
    id: "ya-salam-ya-mumin-ya-allah",
    text: "يَا سَلَامُ يَا مُؤْمِنُ يَا اللَّهُ",
    transliteration: "Ya Salam Ya Mu'minu Ya Allah",
    meaningEn: "The Source of Peace, the Granter of Faith — Ya Allah.",
    urdu: "اے سلام، اے مومن، اے اللہ",
    category: ["daily"],
    target: 100,
    reference: {
      hadith: null,
      grade: null,
      description: "Names of Allah root your heart in serenity and conviction before you count.",
    },
  },
  {
    id: "ya-rahman-ya-rahim-ya-allah",
    text: "يَا رَحْمَٰنُ يَا رَحِيمُ يَا اللَّهُ",
    transliteration: "Ya Rahman Ya Rahim Ya Allah",
    meaningEn: "The Most Merciful, the Especially Merciful — Ya Allah.",
    urdu: "اے رحمان، اے رحیم، اے اللہ",
    category: ["daily"],
    target: 100,
    reference: {
      hadith: null,
      grade: null,
      description: "Reciting mercy-focused names softens the breath and intention behind each bead.",
    },
  },
  {
    id: "ya-dhal-jalali-wal-ikram",
    text: "يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
    transliteration: "Ya Zal-Jalali Wal-Ikram",
    meaningEn: "Owner of Majesty and Generous Honor.",
    urdu: "اے ذوالجلال والکرام",
    category: ["daily"],
    target: 100,
    reference: {
      hadith: null,
      grade: null,
      description: "Honoring Allah’s majesty turns repetition into humble awe, not routine.",
    },
  },
];

const CORE_ITEMS: Tasbeeh[] = [
  {
    id: "bismillah",
    text: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah",
    meaningEn: "In the name of Allah",
    category: ["daily", "beforeActions"],
    target: 100,
  },
  {
    id: "subhanallah",
    text: "سُبْحَانَ اللَّهِ",
    transliteration: "SubhanAllah",
    meaningEn: "Allah is free from imperfection",
    category: ["daily"],
    target: 100,
  },
  {
    id: "alhamdulillah",
    text: "ٱلْحَمْدُ لِلّٰهِ",
    transliteration: "Alhamdulillah",
    meaningEn: "All praise is due to Allah",
    category: ["daily"],
    target: 100,
  },
  {
    id: "allahuakbar",
    text: "اللّٰهُ أَكْبَر",
    transliteration: "Allahu Akbar",
    meaningEn: "Allah is the Greatest",
    category: ["daily"],
    target: 100,
  },
  {
    id: "lailahaillallah",
    text: "لاَ إِلَهَ إِلاَّ اللَّهُ",
    transliteration: "La ilaha illallah",
    meaningEn: "There is none worthy of worship except Allah",
    category: ["tawheed"],
    target: 100,
  },
];

/** Catalog seed now contains Sequences (Programs) instead of flat items */
export const TASBEEH_CATALOG_SEED: TasbeehSequenceDoc[] = [
  {
    id: "legacy-collection",
    title: "Names of Allah",
    items: LEGACY_ITEMS,
    isDefault: true,
    createdBy: "system",
  },
  {
    id: "core-collection",
    title: "Daily Morning/Evening",
    items: CORE_ITEMS,
    isDefault: true,
    createdBy: "system",
  },
];

/** Simple converter to TasbeehItem (Legacy UI Model compatibility if needed) */
export function tasbeehToLegacyItem(t: Tasbeeh): TasbeehItem {
    return {
        id: t.id,
        text: t.text,
        transliteration: t.transliteration,
        urdu: t.urdu ?? "",
        target: t.target,
        meaningEn: t.meaningEn ?? undefined,
        benefitEn: t.reference?.description ?? undefined,
    }
}
