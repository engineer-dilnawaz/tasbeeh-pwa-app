import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Check,
  RotateCcw,
  Undo2,
  Heart,
  Circle,
  ChevronDown,
  ChevronUp,
  Calendar,
} from "lucide-react";

import { TasbeehRing } from "@/features/tasbeeh/components/TasbeehRing";
import { useTasbeehStore } from "@/features/tasbeeh/store/tasbeehStore";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Drawer } from "@/shared/design-system/ui/Drawer";
import { Button } from "@/shared/design-system/ui/Button";
import { useDate } from "@/shared/hooks/useDate";
import { hapticService } from "@/shared/services/hapticService";
import { confettiService } from "@/shared/services/confettiService";
import { soundService } from "@/shared/services/soundService";
import { VictoryOverlay } from "@/features/tasbeeh/components/VictoryOverlay";
import { ZikrDashboard } from "@/features/tasbeeh/components/ActiveZikr/ZikrDashboard";

export default function Home() {
  const [showResetSheet, setShowResetSheet] = useState(false);

  // States for micro-animations
  const [showHeart, setShowHeart] = useState(false);
  const [showUndoRipple, setShowUndoRipple] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSwitchSheet, setShowSwitchSheet] = useState(false);
  const [pendingTasbeeh, setPendingTasbeeh] = useState<any>(null);
  const [showRestartIcon, setShowRestartIcon] = useState(false);
  const [isHijri, setIsHijri] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [wasManuallySelected, setWasManuallySelected] = useState(false);

  const tasbeehLibrary = useTasbeehStore((state) => state.tasbeehLibrary);
  const currentTasbeehId = useTasbeehStore((state) => state.currentTasbeehId);
  const count = useTasbeehStore((state) => state.count);
  const streakDays = useTasbeehStore((state) => state.streakDays);
  const incrementCount = useTasbeehStore((state) => state.incrementCount);
  const decrementCount = useTasbeehStore((state) => state.decrementCount);
  const resetCount = useTasbeehStore((state) => state.resetCount);
  const cycleTasbeeh = useTasbeehStore((state) => state.cycleTasbeeh);
  const completeRound = useTasbeehStore((state) => state.completeRound);
  const hydrateFromDb = useTasbeehStore((state) => state.hydrateFromDb);
  const setCurrentTasbeeh = useTasbeehStore((state) => state.setCurrentTasbeeh);

  const currentTasbeeh = useMemo(
    () => tasbeehLibrary.find((item) => item.id === currentTasbeehId) ?? null,
    [tasbeehLibrary, currentTasbeehId],
  );

  const currentIndex = useMemo(
    () => tasbeehLibrary.findIndex((item) => item.id === currentTasbeehId),
    [tasbeehLibrary, currentTasbeehId],
  );

  const isCompleted = currentTasbeeh ? count >= currentTasbeeh.target : false;
  const isZero = count === 0;

  const handleRecite = useCallback(() => {
    if (isCompleted) {
      const isLastTasbeeh = currentIndex === tasbeehLibrary.length - 1;

      // If it's a manual selection of a completed zikr or the last one, we restart
      if (wasManuallySelected || isLastTasbeeh) {
        resetCount();
        setShowRestartIcon(true);
        hapticService.heavy();
        setWasManuallySelected(false); // Reset manual flag on restart
        setTimeout(() => setShowRestartIcon(false), 800);
        return;
      }

      // Natural flow: Go to Next
      cycleTasbeeh();
      hapticService.medium();
      setWasManuallySelected(false);
      return;
    }

    incrementCount();
    hapticService.light();
    soundService.playBead();

    // Check if we just hit the target
    if (currentTasbeeh && count + 1 === currentTasbeeh.target) {
      // 🏆 Individual Completion Cannon
      confettiService.cannon();

      // 🏅 check if this was the last tasbeeh in the session
      const isLastTasbeeh = currentIndex === tasbeehLibrary.length - 1;
      if (isLastTasbeeh) {
        setTimeout(() => setShowVictory(true), 600);
      }
    }

    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  }, [
    isCompleted,
    incrementCount,
    resetCount,
    currentTasbeeh,
    count,
    currentIndex,
    tasbeehLibrary.length,
    wasManuallySelected,
    cycleTasbeeh,
  ]);

  const handleUndo = useCallback(() => {
    if (isZero) return;
    decrementCount();
    hapticService.medium();
    setShowUndoRipple(true);
    setTimeout(() => setShowUndoRipple(false), 900);
  }, [decrementCount, isZero]);

  const handleResetConfirm = () => {
    resetCount();
    hapticService.heavy();
    setShowResetSheet(false);
  };

  const handleStepClick = (item: any) => {
    if (item.id === currentTasbeehId) return;
    setPendingTasbeeh(item);
    setShowSwitchSheet(true);
  };

  const handleSwitchConfirm = () => {
    if (pendingTasbeeh) {
      setCurrentTasbeeh(pendingTasbeeh.id);
      setWasManuallySelected(true); // Flag that this was a manual jump
      hapticService.medium();
    }
    setShowSwitchSheet(false);
  };

  useEffect(() => {
    void hydrateFromDb();
  }, [hydrateFromDb]);

  const { gregorian, hijri } = useDate();

  return (
    <div className="relative min-h-[calc(100vh-160px)] flex flex-col items-center bg-base-100 overflow-hidden px-4 pt-2 pb-10">
      {/* 1. Top Header: Streak & Interactive Date */}
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex items-center justify-between">
          {/* Animated Streak - Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Squircle cornerRadius={12} cornerSmoothing={0.99} asChild>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-black border border-base-content/5 shadow-sm">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-orange-500"
                >
                  <Flame size={16} fill="currentColor" />
                </motion.div>
                <span className="text-[12px] font-black text-base-content tracking-tight">
                  {streakDays} {streakDays === 1 ? "DAY" : "DAYS"}
                </span>
              </div>
            </Squircle>
          </motion.div>

          {/* Interactive Date Switcher - Right (3D Flip) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="cursor-pointer select-none"
            onClick={() => setIsHijri(!isHijri)}
            style={{ perspective: 1000 }}
          >
            <motion.div
              animate={{ rotateY: isHijri ? 180 : 0 }}
              transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative w-[185px] h-[34px]"
            >
              {/* Front: Gregorian */}
              <div
                style={{ backfaceVisibility: "hidden" }}
                className="absolute inset-0 z-10"
              >
                <Squircle cornerRadius={12} cornerSmoothing={0.99} asChild>
                  <div className="flex items-center gap-2 px-3 py-1.5 h-full bg-white dark:bg-black border border-base-content/5 shadow-sm">
                    <Calendar size={13} className="text-primary shrink-0" />
                    <span className="text-[10px] font-black text-base-content/70 tracking-tight leading-none uppercase whitespace-nowrap">
                      {gregorian}
                    </span>
                  </div>
                </Squircle>
              </div>

              {/* Back: Hijri */}
              <div
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
                className="absolute inset-0"
              >
                <Squircle cornerRadius={12} cornerSmoothing={0.99} asChild>
                  <div className="flex items-center gap-2 px-3 py-1.5 h-full bg-primary text-primary-content border border-primary/20 shadow-sm">
                    <Calendar size={13} className="shrink-0" />
                    <span className="text-[10px] font-black tracking-tight leading-none uppercase whitespace-nowrap">
                      {hijri}
                    </span>
                  </div>
                </Squircle>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Zikr Stepper Wrapped in Squircle */}
        <Squircle cornerRadius={24} cornerSmoothing={0.99} asChild>
          <div className="w-full bg-white dark:bg-black px-4 py-3">
            <div className="w-full overflow-x-auto no-scrollbar">
              <ul className="steps w-full">
                {tasbeehLibrary.map((item, index) => {
                  const status =
                    index < currentIndex
                      ? "completed"
                      : index === currentIndex
                        ? "current"
                        : "upcoming";

                  return (
                    <li
                      key={item.id}
                      onClick={() => handleStepClick(item)}
                      data-content={
                        status === "completed"
                          ? "✓"
                          : status === "current"
                            ? "●"
                            : ""
                      }
                      className={`step transition-all duration-500 cursor-pointer ${
                        status === "completed" || status === "current"
                          ? "step-primary"
                          : "before:bg-base-content/10!"
                      }`}
                    >
                      <span
                        className={`
                        uppercase tracking-widest transition-all duration-500 h-4 flex items-center justify-center
                        ${status === "completed" ? "text-[8px] text-base-content/40 font-semibold" : ""}
                        ${status === "current" ? "text-[10px] text-base-content font-black" : ""}
                        ${status === "upcoming" ? "text-[8px] text-base-content/30 font-bold" : ""}
                      `}
                      >
                        {item.transliteration}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Squircle>
      </div>

      {/* 2. Dynamic Expandable Zikr Content Card */}
      <div className="w-full mt-2">
        <Squircle cornerRadius={20} cornerSmoothing={0.99} asChild>
          <motion.div
            layout
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-white dark:bg-black px-5 pt-5 pb-8 flex flex-col items-center text-center relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {currentTasbeeh && (
                <motion.div
                  key={currentTasbeeh.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col w-full"
                >
                  {/* Top Header: Transliteration (Left) & Arabic (Right) */}
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

                  {/* Expandable Translation Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="flex flex-col items-start w-full overflow-hidden text-left"
                      >
                        {/* Subtle Divider */}
                        <div className="w-full h-px bg-base-content/5 mb-4" />

                        <span className="text-[9px] font-bold text-base-content/30 uppercase tracking-[0.2em] mb-2">
                          Meaning / Translation
                        </span>
                        <span className="text-[13px] font-medium text-base-content/80 leading-relaxed italic border-l-2 border-base-content/30 pl-3">
                          {currentTasbeeh.translation ||
                            "Translation is missing for this Zikr"}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
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
      </div>

      {/* 3. Immersive Ring Section */}
      <div className="flex-1 flex items-center justify-center w-full pt-1 pb-2">
        {currentTasbeeh && (
          <TasbeehRing
            count={count}
            target={currentTasbeeh.target}
            onTap={handleRecite}
            isCompleted={isCompleted}
          />
        )}
      </div>

      {/* 4. Refined Control Center */}
      <div className="w-full flex flex-col gap-3 mt-auto">
        {/* Primary: Recite */}
        <div className="relative w-full">
          <Squircle cornerRadius={24} cornerSmoothing={0.99} asChild>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleRecite}
              className="w-full h-16 bg-base-content text-base-100 flex items-center justify-center gap-3 font-black text-[16px] tracking-widest uppercase shadow-xl z-20 hover:opacity-90 transition-opacity"
            >
              {isCompleted &&
              (wasManuallySelected ||
                currentIndex === tasbeehLibrary.length - 1) ? (
                <>
                  <RotateCcw size={20} className="animate-pulse" />
                  Restart
                </>
              ) : isCompleted ? (
                <>
                  <Check size={20} className="text-white" />
                  Next
                </>
              ) : (
                "Recite"
              )}
            </motion.button>
          </Squircle>

          {/* Animated Heart feedback - Burst from Center */}
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

        {/* Secondary Actions */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Squircle cornerRadius={20} cornerSmoothing={0.99} asChild>
              <button
                onClick={handleUndo}
                disabled={isZero}
                className={`w-full h-14 bg-base-content/5 flex items-center justify-center gap-2 text-base-content/60 font-bold text-[13px] uppercase tracking-widest overflow-hidden transition-all duration-300 ${
                  isZero
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-base-content/10 active:scale-95"
                }`}
              >
                <Undo2 size={18} />
                Undo
              </button>
            </Squircle>

            {/* Undo Ripple (-1) - Non-cropping Floating Animation */}
            <AnimatePresence>
              {showUndoRipple && (
                <div className="absolute inset-0 z-30 pointer-events-none">
                  {/* 1. Solid mask to hide the "Undo" text */}
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

                  {/* 2. Floating indicator that can move outside the container */}
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

          <Squircle cornerRadius={20} cornerSmoothing={0.99} asChild>
            <button
              onClick={() => setShowResetSheet(true)}
              disabled={isZero}
              className={`flex-1 h-14 border-2 border-base-content/10 flex items-center justify-center gap-2 text-base-content/60 font-bold text-[13px] uppercase tracking-widest transition-all duration-300 ${
                isZero
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-base-content/5 active:scale-95"
              }`}
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </Squircle>
        </div>

        {/* Multi-Active Zikr Dashboard Section */}
        <ZikrDashboard />
      </div>

      {/* Standardized Reset Confirmation Sheet */}
      <Drawer
        isOpen={showResetSheet}
        onClose={() => setShowResetSheet(false)}
        snapPoints={["45%"]}
        presentation="height"
      >
        <div className="flex flex-col h-[320px] px-4 pt-4">
          <div className="flex flex-col gap-3">
            <p className="text-[17px] font-bold text-base-content leading-tight">
              Are you sure you want to reset?
            </p>
            <p className="text-[14px] leading-relaxed text-base-content/50 italic">
              "Every ending is a new beginning, in the remembrance of the
              Divine."
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-3 pb-4">
            <Button
              variant="primary"
              size="lg"
              className="bg-base-content! text-base-100! border-none hover:opacity-90"
              onClick={handleResetConfirm}
            >
              Yes, Reset Count
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-base-content/50"
              onClick={() => setShowResetSheet(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Standardized Switch Zikr Sheet */}
      <Drawer
        isOpen={showSwitchSheet}
        onClose={() => setShowSwitchSheet(false)}
        snapPoints={["45%"]}
        presentation="height"
        contentPaddingBottomPx={0}
      >
        <div className="flex flex-col h-[320px] px-4 pt-4">
          <div className="flex flex-col gap-3">
            <p className="text-[17px] font-bold text-base-content leading-tight">
              Switch to{" "}
              <span className="text-primary font-black">
                {pendingTasbeeh?.transliteration}
              </span>
              ?
            </p>
            <p className="text-[14px] leading-relaxed text-base-content/50 italic">
              Don't worry, your current progress won't be lost. You can switch
              back anytime.
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-3 ">
            <Button
              variant="primary"
              size="lg"
              className="bg-base-content! text-base-100! border-none hover:opacity-90"
              onClick={handleSwitchConfirm}
            >
              Yes, Switch Zikr
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-base-content/50"
              onClick={() => setShowSwitchSheet(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Drawer>
      <VictoryOverlay
        isOpen={showVictory}
        onClose={() => setShowVictory(false)}
      />
    </div>
  );
}
