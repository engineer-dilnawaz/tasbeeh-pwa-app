import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, X } from "lucide-react";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Button } from "@/shared/design-system/ui/Button";
import { confettiService } from "@/shared/services/confettiService";
import { getRandomInsight } from "@/shared/constants/spiritualData";
import { hapticService } from "@/shared/services/hapticService";

interface VictoryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VictoryOverlay: React.FC<VictoryOverlayProps> = ({ isOpen, onClose }) => {
  const insight = getRandomInsight();

  useEffect(() => {
    if (isOpen) {
      // Trigger the Jubilee sequence
      hapticService.success();
      confettiService.divine();
      
      // Delay side cannons for a "layered" celebration
      const timer = setTimeout(() => {
        confettiService.sideCannons(1500);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-xl p-6 overflow-hidden"
        >
          {/* Close Button - Top Right */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            onClick={onClose}
            className="absolute top-8 right-8 p-3 rounded-full bg-base-content/5 text-base-content/40 hover:bg-base-content/10 transition-colors"
          >
            <X size={20} />
          </motion.button>

          {/* Main Celebration Content */}
          <div className="flex flex-col items-center text-center max-w-[420px] w-full">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="mb-8"
            >
              <div className="text-display-arabic text-[64px] text-primary mb-2">
                الحمد لله
              </div>
              <h2 className="text-[24px] font-black tracking-tight text-base-content uppercase">
                Goal Achieved
              </h2>
              <p className="text-[14px] font-medium text-base-content/50 mt-1 uppercase tracking-widest">
                Daily Zikr Completed
              </p>
            </motion.div>

            {/* Premium Insight Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative w-full"
            >
              <Squircle
                cornerRadius={32}
                cornerSmoothing={0.99}
                className="bg-white dark:bg-base-100 border border-base-content/5 p-8 shadow-2xl relative overflow-hidden"
              >
                {/* Decorative Background Quote */}
                <Quote 
                  size={80} 
                  className="absolute -top-4 -right-2 text-primary/5 rotate-12" 
                />

                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                    <Quote size={18} />
                  </div>

                  <span className="text-[11px] uppercase font-black text-primary tracking-[0.25em] mb-4">
                    {insight.type} of the day
                  </span>

                  <p className="text-[17px] font-semibold text-base-content leading-relaxed mb-6 italic">
                    "{insight.content}"
                  </p>

                  <div className="h-px w-12 bg-base-content/10 mb-3" />
                  
                  <span className="text-[12px] font-bold text-base-content/30 uppercase tracking-widest">
                    {insight.source}
                  </span>
                </div>
              </Squircle>
            </motion.div>

            {/* Action Area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-12 w-full"
            >
              <Button
                variant="primary"
                size="lg"
                className="w-full h-14 rounded-3xl bg-base-content! text-base-100! font-black uppercase tracking-widest text-[14px] shadow-lg"
                onClick={onClose}
              >
                Return Home
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
