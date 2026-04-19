import React from "react";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Text } from "@/shared/design-system/ui/Text";
import { Button } from "@/shared/design-system/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, Trash2, Play } from "lucide-react";
import type { ActiveZikrSlot } from "@/features/tasbeeh/types";

interface ZikrCardDetailedProps {
  slot: ActiveZikrSlot;
  isPrimary: boolean;
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
  onSetPrimary,
  onRemove,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="w-full overflow-hidden"
    >
      <Squircle cornerRadius={24} cornerSmoothing={0.99} asChild>
        <div className="bg-white dark:bg-black border border-base-content/10 shadow-lg p-6 flex flex-col gap-6">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <Text variant="caption" weight="black" className="uppercase tracking-widest text-[10px] text-base-content/30">
                Active Collection
              </Text>
              <Text variant="heading" weight="black" className="tracking-tight text-base-content">
                {slot.name}
              </Text>
            </div>
            
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center bg-base-content/5 rounded-full text-base-content/40"
            >
              <ChevronUp size={20} />
            </button>
          </div>

          {/* 2-Column Progress Grid */}
          <div className="flex flex-col gap-3">
             <Text variant="caption" weight="black" className="uppercase tracking-widest text-[10px] text-base-content/30 mb-1">
                Collection Progress
              </Text>
              
              <div className="flex flex-col gap-2">
                {slot.items.map((item, index) => {
                  const isCurrentItem = index === slot.currentIndex;
                  const itemProgress = index < slot.currentIndex ? item.target : (isCurrentItem ? slot.currentCount : 0);
                  
                  return (
                    <div 
                      key={item.id}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        isCurrentItem ? "border-primary/20 bg-primary/5" : "border-base-content/5 bg-base-content/5"
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <Text variant="body" weight={isCurrentItem ? "black" : "bold"} className="text-base-content uppercase text-[12px]">
                          {item.transliteration}
                        </Text>
                        <Text className="text-display-arabic text-[12px] text-base-content/60">
                          {item.arabic}
                        </Text>
                      </div>
                      
                      <div className="flex flex-col items-end gap-0.5">
                        <Text variant="caption" weight="black" className="text-primary text-[11px]">
                          {itemProgress} / {item.target}
                        </Text>
                        <div className="w-16 h-1 bg-base-content/10 rounded-full overflow-hidden mt-1">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${(itemProgress / item.target) * 100}%` }} 
                          />
                        </div>
                      </div>
                    </div>
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
                onClick={onSetPrimary}
              >
                <Play size={16} fill="currentColor" />
                Set as Current
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className={`h-12 border-error/20 text-error hover:bg-error/5 ${isPrimary ? "flex-1" : "px-4"}`}
              onClick={onRemove}
            >
              <Trash2 size={18} />
              {isPrimary && " Remove from Daily"}
            </Button>
          </div>
        </div>
      </Squircle>
    </motion.div>
  );
};
