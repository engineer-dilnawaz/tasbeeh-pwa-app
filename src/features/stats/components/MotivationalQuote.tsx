import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Text } from "@/shared/design-system/ui/Text";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import type { MotivationalQuote as QuoteType } from "../types";

const QUOTES: QuoteType[] = [
  {
    text: "The best of deeds are those done regularly, even if they are small.",
    source: "Sahih al-Bukhari",
    type: "hadith",
  },
  {
    text: "Verily, in the remembrance of Allah do hearts find rest.",
    source: "Quran 13:28",
    type: "quran",
  },
  {
    text: "Shall I not tell you the best of your deeds? The remembrance of Allah.",
    source: "Tirmidhi",
    type: "hadith",
  },
  {
    text: "Remember Me, and I will remember you.",
    source: "Quran 2:152",
    type: "quran",
  },
  {
    text: "Two words light on the tongue, heavy on the scales: SubhanAllahi wa bihamdihi.",
    source: "Sahih al-Bukhari",
    type: "hadith",
  },
  {
    text: "Whoever says SubhanAllah 100 times, 1000 good deeds are recorded for him.",
    source: "Sahih Muslim",
    type: "hadith",
  },
  {
    text: "The similitude of one who remembers his Lord and one who does not is like the living and the dead.",
    source: "Sahih al-Bukhari",
    type: "hadith",
  },
  {
    text: "And glorify Him morning and evening.",
    source: "Quran 33:42",
    type: "quran",
  },
];

export function MotivationalQuote() {
  const quote = useMemo(() => {
    const today = new Date().toDateString();
    const seed = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return QUOTES[seed % QUOTES.length];
  }, []);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Squircle cornerRadius={24} cornerSmoothing={0.99} asChild>
        <div className="bg-white dark:bg-black p-8 shadow-sm border border-base-content/5 relative overflow-hidden">
          {/* Subtle Decorative Light */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

          <div className="relative flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center justify-center p-2 bg-primary/5 rounded-xl border border-primary/10"
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
              <Text variant="caption" weight="black" className="text-[10px] opacity-40 uppercase tracking-[0.2em]">
                Daily Wisdom
              </Text>
            </div>

            <p className="text-[17px] leading-relaxed font-medium italic text-base-content/80 tracking-tight pr-4">
              "{quote.text}"
            </p>

            <div className="flex items-center gap-2 justify-end">
               <div className="h-[1px] w-4 bg-base-content/10" />
               <Text variant="caption" weight="bold" color="subtle" className="text-[11px] opacity-40">
                 {quote.source}
               </Text>
            </div>
          </div>
        </div>
      </Squircle>
    </motion.div>
  );
}
