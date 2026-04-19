import React from "react";
import { Drawer } from "@/shared/design-system/ui/Drawer";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Text } from "@/shared/design-system/ui/Text";
import { Button } from "@/shared/design-system/ui/Button";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { type ActiveZikrSlot } from "@/features/tasbeeh/types";

interface AddZikrSuccessSheetProps {
  isOpen: boolean;
  onClose: () => void;
  addedCollectionName: string;
  activeSlots: ActiveZikrSlot[];
  onGoHome: () => void;
}

/**
 * AddZikrSuccessSheet — The high-fidelity confirmation sheet after adding a zikr.
 * Displays the 4 parallel slots as a physical 'tray'.
 */
export const AddZikrSuccessSheet: React.FC<AddZikrSuccessSheetProps> = ({
  isOpen,
  onClose,
  addedCollectionName,
  activeSlots,
  onGoHome,
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={["50%"]}
      presentation="height"
    >
      <div className="flex flex-col h-full bg-base-100 px-6 pt-6 pb-8 gap-8">
        {/* Success Icon & Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-success/10 text-success flex items-center justify-center rounded-full"
          >
            <Check size={32} />
          </motion.div>
          
          <div className="flex flex-col">
            <Text variant="heading" weight="black" className="tracking-tight text-base-content">
              Barakah Added!
            </Text>
            <Text variant="body" color="subtle" className="leading-tight">
                {addedCollectionName} is now active in your daily zikr list.
            </Text>
          </div>
        </div>

        {/* 4-Slot Visualization Tray */}
        <div className="flex flex-col gap-3">
            <Text variant="caption" weight="black" className="uppercase tracking-widest text-[10px] text-base-content/30 text-center">
                Your Parallel Active Slots ({activeSlots.length}/4)
            </Text>
            
            <div className="grid grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((idx) => {
                    const slot = activeSlots[idx];
                    const isNew = slot?.name === addedCollectionName;

                    return (
                        <div key={idx} className="flex flex-col items-center gap-2">
                            <Squircle cornerRadius={16} cornerSmoothing={0.99} asChild>
                                <div className={`
                                    w-full aspect-square border-2 flex items-center justify-center transition-all duration-500
                                    ${slot ? (isNew ? "border-success bg-success/5 animate-pulse" : "border-base-content/10 bg-base-content/5") : "border-dashed border-base-content/5 bg-transparent"}
                                `}>
                                    {slot ? (
                                        <Text variant="heading" weight="black" className="text-base-content/40 uppercase">
                                            {slot.name[0]}
                                        </Text>
                                    ) : (
                                        <div className="w-1.5 h-1.5 rounded-full bg-base-content/10" />
                                    )}
                                </div>
                            </Squircle>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex flex-col gap-3">
            <Button 
                variant="primary" 
                size="lg" 
                className="w-full h-14 gap-2"
                onClick={onGoHome}
            >
                View in Home
                <ArrowRight size={18} />
            </Button>
            
            <Button 
                variant="ghost" 
                className="text-base-content/50"
                onClick={onClose}
            >
                Keep Picking
            </Button>
        </div>
      </div>
    </Drawer>
  );
};
