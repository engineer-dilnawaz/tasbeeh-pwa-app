import React from "react";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Text } from "@/shared/design-system/ui/Text";
import { motion } from "framer-motion";

interface ZikrCardCompactProps {
  collectionId: string;
  transliteration: string;
  arabic: string;
  progress: number;
  target: number;
  isActive: boolean;
  onClick?: () => void;
}

/**
 * ZikrCardCompact — A sleek, row-based view for the Parallel Active Zikr list.
 * Adopts the 'Inked Card' aesthetic (bg-white dark:bg-black).
 */
export const ZikrCardCompact: React.FC<ZikrCardCompactProps> = ({
  collectionId,
  transliteration,
  arabic,
  progress,
  target,
  isActive,
  onClick,
}) => {
  const progressPercentage = Math.min((progress / target) * 100, 100);

  return (
    <motion.div
      layout="position"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full cursor-pointer group"
    >
      <Squircle cornerRadius={20} cornerSmoothing={0.99} asChild>
        <motion.div
          layoutId={`card-bg-${collectionId}`}
          className={`
          relative overflow-hidden w-full px-5 py-4 flex flex-col gap-2 
          bg-white dark:bg-black  transition-all duration-300`}
        >
          {/* Row Content */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Text
                variant="caption"
                weight="black"
                className="uppercase tracking-widest text-[10px] text-base-content/60"
              >
                Transliteration
              </Text>
              <Text
                variant="body"
                weight="black"
                className="tracking-tight text-base-content uppercase"
              >
                {transliteration}
              </Text>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Text
                variant="caption"
                weight="black"
                className="uppercase tracking-widest text-[10px] text-base-content/60"
              >
                Arabic
              </Text>
              <Text className="text-display-arabic text-lg text-base-content">
                {arabic}
              </Text>
            </div>
          </div>

          {/* Progress Indicator (Thin Line) */}
          <div className="w-full h-1 bg-base-content/5 rounded-full overflow-hidden mt-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              className={`h-full ${isActive ? "bg-primary" : "bg-base-content/20"}`}
            />
          </div>

          {/* Active Glow Overlay (Subtle) */}
          {isActive && (
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          )}
        </motion.div>
      </Squircle>
    </motion.div>
  );
};
