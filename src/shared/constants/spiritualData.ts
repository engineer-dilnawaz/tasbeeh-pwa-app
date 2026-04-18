export interface SpiritualInsight {
  type: "Ayat" | "Hadith";
  content: string;
  source: string;
}

export const spiritualInsights: SpiritualInsight[] = [
  {
    type: "Ayat",
    content: "So remember Me; I will remember you.",
    source: "Al-Baqarah 2:152",
  },
  {
    type: "Ayat",
    content: "Unquestionably, by the remembrance of Allah hearts are assured.",
    source: "Ar-Ra'd 13:28",
  },
  {
    type: "Hadith",
    content: "The best of remembrance is 'La ilaha illa Allah'.",
    source: "Tirmidhi",
  },
  {
    type: "Hadith",
    content:
      "Whoever says 'Subhan Allah wa bihamdihi' 100 times a day, his sins will be forgiven even if they are like the foam of the sea.",
    source: "Bukhari",
  },
  {
    type: "Ayat",
    content: "And remember your Lord much and exalt Him with praise in the evening and the morning.",
    source: "Al-Imran 3:41",
  },
  {
    type: "Hadith",
    content: "The comparison of one who remembers his Lord and one who does not is like that of the living and the dead.",
    source: "Bukhari",
  },
];

export const getRandomInsight = (): SpiritualInsight => {
  const dayIndex = new Date().getDate() % spiritualInsights.length;
  return spiritualInsights[dayIndex];
};
