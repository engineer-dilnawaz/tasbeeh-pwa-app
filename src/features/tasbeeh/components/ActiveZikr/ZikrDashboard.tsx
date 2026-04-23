import React, { useState } from "react";
import { useTasbeehStore } from "@/features/tasbeeh/store/tasbeehStore";
import { ZikrCardCompact } from "./ZikrCardCompact";
import { ZikrCardDetailed } from "./ZikrCardDetailed";
import { AnimatePresence, motion } from "framer-motion";
import { Text } from "@/shared/design-system/ui/Text";

/**
 * ZikrDashboard — The main orchestrator for Parallel Active Zikrs.
 * Managed the list of up to 4 active slots and handles expansion states.
 */
export const ZikrDashboard: React.FC = () => {
  const { activeSlots, primarySlotIndex, switchPrimarySlot, removeActiveSlot } = useTasbeehStore();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // If there's only one slot and it's primary, we might want to hide the list
  // or show it as the single active entry. For now, we show all active.
  if (activeSlots.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-4 mt-6">
      <div className="flex items-center justify-between px-1">
        <Text variant="caption" weight="black" className="uppercase tracking-[0.2em] text-[10px] text-base-content/50">
          Your Focus Sessions ({activeSlots.length}/4)
        </Text>
      </div>

      <motion.div layout className="flex flex-col gap-3">
        <AnimatePresence>
          {activeSlots.map((slot, index) => {
            const isPrimary = index === primarySlotIndex;
            const isExpanded = expandedIndex === index;

            return (
              <motion.div
                key={slot.collectionId}
                layoutId={`card-container-${slot.collectionId}`}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 35,
                  mass: 1,
                }}
                className="w-full"
              >
                {isExpanded ? (
                  <ZikrCardDetailed
                    slot={slot}
                    isPrimary={isPrimary}
                    canRemove={activeSlots.length > 1}
                    onClose={() => setExpandedIndex(null)}
                    onRemove={() => {
                        removeActiveSlot(slot.collectionId);
                        setExpandedIndex(null);
                    }}
                    onSetPrimary={() => {
                        switchPrimarySlot(index);
                        setExpandedIndex(null);
                    }}
                  />
                ) : (
                  <ZikrCardCompact
                    collectionId={slot.collectionId}
                    isActive={isPrimary}
                    transliteration={slot.name}
                    arabic={slot.items[slot.currentIndex]?.arabic || ""}
                    progress={slot.currentCount}
                    target={slot.items[slot.currentIndex]?.target || 0}
                    onClick={() => setExpandedIndex(index)}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
