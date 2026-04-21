import type { ActiveZikrSlot } from "@/features/tasbeeh/types";
import { Button } from "@/shared/design-system/ui/Button";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Text } from "@/shared/design-system/ui/Text";
import { useAutoScroll } from "@/shared/hooks/useAutoScroll";
import { motion } from "framer-motion";
import { ChevronUp, Play, Trash2 } from "lucide-react";
import React from "react";

interface ZikrCardDetailedProps {
  slot: ActiveZikrSlot;
  isPrimary: boolean;
  canRemove: boolean;
  onSetPrimary: () => void;
  onRemove: () => void;
  onClose: () => void;
}

/**
 * ZikrCardDetailed — The expanded, high-detail view for an Active Zikr Collection.
 * Shows a 2-column key-value grid for all items in the collection and progress.
 */
export const ZikrCardDetailed: React.FC<ZikrCardDetailedProps> = ({
  slot,
  isPrimary,
  canRemove,
  onSetPrimary,
  onRemove,
  onClose,
}) => {
  const { ref } = useAutoScroll({ active: true, threshold: 0.01 });

  return (
    <motion.div ref={ref} layout="position" className="w-full">
      <Squircle cornerRadius={24} cornerSmoothing={0.99} asChild>
        <motion.div 
          layoutId={`card-bg-${slot.collectionId}`}
          className="bg-white dark:bg-black shadow-lg p-6 flex flex-col gap-6"
        >
          {/* Header Row — Clickable to Collapse */}
          <div 
            onClick={onClose}
            className="flex items-center justify-between cursor-pointer group/header -m-2 p-2 rounded-2xl hover:bg-base-content/2 transition-colors"
          >
            <div className="flex flex-col">
              <Text
                variant="caption"
                weight="black"
                className="uppercase tracking-widest text-[10px] text-base-content/60"
              >
                Active Collection
              </Text>
              <Text
                variant="heading"
                weight="black"
                className="tracking-tight text-base-content"
              >
                {slot.name}
              </Text>
            </div>

            <Squircle cornerRadius={12} cornerSmoothing={0.99} asChild>
              <div className="w-10 h-10 flex items-center justify-center bg-base-content/5 text-base-content/60 group-hover/header:bg-base-content/10 transition-colors">
                <ChevronUp size={20} />
              </div>
            </Squircle>
          </div>

          {/* 2-Column Progress Grid */}
          <div className="flex flex-col gap-3">
            <Text
              variant="caption"
              weight="black"
              className="uppercase tracking-widest text-[10px] text-base-content/60 mb-1"
            >
              Collection Progress
            </Text>

            <div className="flex flex-col gap-2">
              {slot.items.map((item, index) => {
                const isCurrentItem = index === slot.currentIndex;
                const itemProgress =
                  index < slot.currentIndex
                    ? item.target
                    : isCurrentItem
                      ? slot.currentCount
                      : 0;

                return (
                  <Squircle
                    key={item.id}
                    cornerRadius={16}
                    cornerSmoothing={0.99}
                    asChild
                  >
                    <div
                      className={`flex items-center justify-between p-4 transition-colors ${
                        isCurrentItem ? "bg-primary/15" : "bg-base-content/3"
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <Text
                          variant="body"
                          weight={isCurrentItem ? "black" : "bold"}
                          className={`${isCurrentItem ? "text-primary" : "text-base-content"} uppercase text-[11px]`}
                        >
                          {item.transliteration}
                        </Text>
                        <Text className="text-display-arabic text-[12px] text-base-content/60">
                          {item.arabic}
                        </Text>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <Text
                          variant="caption"
                          weight="black"
                          className={`${isCurrentItem ? "text-primary" : "text-base-content/40"} text-[10px]`}
                        >
                          {itemProgress} / {item.target}
                        </Text>
                        <div className="w-16 h-1 bg-base-content/5 rounded-full overflow-hidden mt-0.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(itemProgress / item.target) * 100}%`,
                            }}
                            className={`h-full ${isCurrentItem ? "bg-primary" : "bg-base-content/20"}`}
                          />
                        </div>
                      </div>
                    </div>
                  </Squircle>
                );
              })}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex gap-3 mt-2">
            {!isPrimary && (
              <Button
                variant="primary"
                className="flex-1 h-12 gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onSetPrimary();
                }}
              >
                <Play size={16} fill="currentColor" />
                Set as Current
              </Button>
            )}

            <Button
              variant="outline"
              disabled={!canRemove}
              className={`h-12 border-error/20 text-error hover:bg-error/5 ${isPrimary ? "flex-1" : "px-4"} ${!canRemove ? "opacity-30 grayscale" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Trash2 size={18} />
              {isPrimary && (canRemove ? " Remove from Daily" : " Only One Active")}
            </Button>
          </div>
        </motion.div>
      </Squircle>
    </motion.div>
  );
};
