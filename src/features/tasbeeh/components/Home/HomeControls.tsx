import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Undo2, Check, Heart } from "lucide-react";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { SyncStatusIndicator } from "@/features/layout/components/HeaderActions";

interface ZikrActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

const ZikrActionButton: React.FC<ZikrActionButtonProps> = ({
  onClick,
  disabled,
  children,
  variant = "secondary",
  className = "",
}) => {
  const baseClasses = variant === "primary"
    ? "w-full h-16 bg-base-content text-base-100 font-black text-[16px] tracking-widest uppercase shadow-xl hover:opacity-90 transition-opacity"
    : "w-full h-14 bg-base-content/5 flex items-center justify-center gap-2 text-base-content/60 font-bold text-[13px] uppercase tracking-widest transition-all duration-300 hover:bg-base-content/10 active:scale-95";

  const disabledClasses = disabled ? "opacity-30 cursor-not-allowed" : "";

  return (
    <div className={`relative flex-1 ${className}`}>
      <Squircle cornerRadius={variant === "primary" ? 24 : 20} cornerSmoothing={0.99} asChild>
        <motion.button
          whileTap={disabled ? {} : { scale: 0.98 }}
          onClick={onClick}
          disabled={disabled}
          className={`${baseClasses} ${disabledClasses} flex items-center justify-center gap-3`}
        >
          {children}
        </motion.button>
      </Squircle>
    </div>
  );
};

interface HomeControlsProps {
  isCompleted: boolean;
  isZero: boolean;
  isLastTasbeeh: boolean;
  wasManuallySelected: boolean;
  handleRecite: () => void;
  handleUndo: () => void;
  onResetClick: () => void;
  showHeart: boolean;
  showRestartIcon: boolean;
  showUndoRipple: boolean;
}

export const HomeControls: React.FC<HomeControlsProps> = ({
  isCompleted,
  isZero,
  isLastTasbeeh,
  wasManuallySelected,
  handleRecite,
  handleUndo,
  onResetClick,
  showHeart,
  showRestartIcon,
  showUndoRipple,
}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Recite/Restart/Next Button */}
      <div className="relative w-full">
        <ZikrActionButton variant="primary" onClick={handleRecite}>
          {isCompleted && (wasManuallySelected || isLastTasbeeh) ? (
            <>
              <RotateCcw size={20} className="animate-pulse" />
              Restart
            </>
          ) : isCompleted ? (
            <>
              <Check size={20} />
              Next
            </>
          ) : (
            "Recite"
          )}
        </ZikrActionButton>

        {/* Feedback Animations */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ opacity: 0, scale: 0.2, y: 0 }}
              animate={{ opacity: 1, scale: 1.4, y: -45 }}
              exit={{ opacity: 0, scale: 1.8, y: -65 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-0 flex items-center justify-center text-error z-30 pointer-events-none"
            >
              <Heart size={32} fill="currentColor" />
            </motion.div>
          )}
          {showRestartIcon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.2, y: 0 }}
              animate={{ opacity: 1, scale: 1.4, y: -45 }}
              exit={{ opacity: 0, scale: 1.8, y: -65 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-0 flex items-center justify-center text-primary z-30 pointer-events-none"
            >
              <RotateCcw size={32} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Secondary Actions: Undo & Reset */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <ZikrActionButton onClick={handleUndo} disabled={isZero}>
            <Undo2 size={18} />
            Undo
          </ZikrActionButton>

          {/* Undo Ripple Indicator */}
          <AnimatePresence>
            {showUndoRipple && (
              <div className="absolute inset-0 z-30 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <Squircle cornerRadius={20} cornerSmoothing={0.99} asChild>
                    <div className="w-full h-full bg-base-100 border-2 border-error/20" />
                  </Squircle>
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    initial={{ y: 0, opacity: 0, scale: 0.5 }}
                    animate={{ y: -50, opacity: 1, scale: 1.5 }}
                    exit={{ y: -80, opacity: 0, scale: 2 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-error font-black text-[18px] tracking-widest whitespace-nowrap"
                  >
                    -1
                  </motion.span>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        <ZikrActionButton 
          onClick={onResetClick} 
          disabled={isZero}
          className="border-2 border-base-content/10 rounded-[20px]"
        >
          <RotateCcw size={18} />
          Reset
        </ZikrActionButton>
      </div>

      {/* Parallel Zikr Dashboard Section would follow here if integrated */}
    </div>
  );
};
