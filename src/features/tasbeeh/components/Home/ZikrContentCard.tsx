import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import type { TasbeehItem } from "@/features/tasbeeh/types";

interface ZikrContentCardProps {
  currentTasbeeh: TasbeehItem | null;
}

export const ZikrContentCard: React.FC<ZikrContentCardProps> = ({
  currentTasbeeh,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentTasbeeh) return null;

  return (
    <Squircle cornerRadius={20} cornerSmoothing={0.99} asChild>
      <motion.div
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-white dark:bg-black px-5 pt-5 pb-8 flex flex-col items-center text-center relative overflow-hidden cursor-pointer"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTasbeeh.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col w-full"
          >
            {/* Arabic & Transliteration Header */}
            <div className="flex w-full justify-between items-center gap-6">
              <motion.span
                layout="position"
                className="text-sm font-bold text-base-content transition-colors"
              >
                {currentTasbeeh.transliteration}
              </motion.span>
              <motion.span
                layout="position"
                dir="rtl"
                className="text-display-arabic text-xl leading-none text-base-content whitespace-nowrap"
              >
                {currentTasbeeh.arabic}
              </motion.span>
            </div>

            {/* Translation (Expandable) */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="flex flex-col items-start w-full overflow-hidden text-left"
                >
                  <div className="w-full h-px bg-base-content/5 mb-4" />
                  <span className="text-[9px] font-bold text-base-content/30 uppercase tracking-[0.2em] mb-2">
                    Meaning / Translation
                  </span>
                  <span className="text-[13px] font-medium text-base-content/80 leading-relaxed italic border-l-2 border-base-content/30 pl-3">
                    {currentTasbeeh.translation || "Translation is missing for this Zikr"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Expander Icon */}
        <motion.div
          animate={{
            y: isExpanded ? [0, -2, 0] : [0, 2, 0],
            rotate: isExpanded ? 180 : 0,
          }}
          transition={{
            y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
            rotate: { type: "spring", stiffness: 260, damping: 20 },
          }}
          className="absolute bottom-2 left-1/2 -ml-2.5 text-base-content/60"
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </Squircle>
  );
};
