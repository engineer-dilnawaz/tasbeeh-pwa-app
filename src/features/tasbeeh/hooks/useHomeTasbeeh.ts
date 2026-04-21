import { useState, useCallback, useMemo, useEffect } from "react";
import { useTasbeehStore } from "@/features/tasbeeh/store/tasbeehStore";
import { hapticService } from "@/shared/services/hapticService";
import { soundService } from "@/shared/services/soundService";
import { confettiService } from "@/shared/services/confettiService";

export function useHomeTasbeeh() {
  // --- Persistent Store State ---
  const activeSlots = useTasbeehStore((state) => state.activeSlots);
  const primarySlotIndex = useTasbeehStore((state) => state.primarySlotIndex);

  const tasbeehLibrary = useMemo(
    () => activeSlots[primarySlotIndex]?.items ?? [],
    [activeSlots, primarySlotIndex]
  );

  const currentTasbeehId = useTasbeehStore((state) => state.currentTasbeehId);
  const count = useTasbeehStore((state) => state.count);
  const streakDays = useTasbeehStore((state) => state.streakDays);

  // --- Actions ---
  const incrementCount = useTasbeehStore((state) => state.incrementCount);
  const decrementCount = useTasbeehStore((state) => state.decrementCount);
  const resetCount = useTasbeehStore((state) => state.resetCount);
  const cycleTasbeeh = useTasbeehStore((state) => state.cycleTasbeeh);
  const hydrateFromDb = useTasbeehStore((state) => state.hydrateFromDb);
  const setCurrentTasbeeh = useTasbeehStore((state) => state.setCurrentTasbeeh);

  // --- UI States (Feedback & Sheets) ---
  const [showResetSheet, setShowResetSheet] = useState(false);
  const [showSwitchSheet, setShowSwitchSheet] = useState(false);
  const [pendingTasbeeh, setPendingTasbeeh] = useState<any>(null);
  
  const [showHeart, setShowHeart] = useState(false);
  const [showUndoRipple, setShowUndoRipple] = useState(false);
  const [showRestartIcon, setShowRestartIcon] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showProgressDetailsSheet, setShowProgressDetailsSheet] = useState(false);
  
  const [wasManuallySelected, setWasManuallySelected] = useState(false);

  // --- Derived State ---
  const currentTasbeeh = useMemo(
    () => tasbeehLibrary.find((item) => item.id === currentTasbeehId) ?? tasbeehLibrary[0] ?? null,
    [tasbeehLibrary, currentTasbeehId]
  );

  const currentIndex = useMemo(
    () => tasbeehLibrary.findIndex((item) => item.id === currentTasbeehId),
    [tasbeehLibrary, currentTasbeehId]
  );

  const isCompleted = currentTasbeeh ? count >= currentTasbeeh.target : false;
  const isZero = count === 0;

  const isLastTasbeeh = currentIndex === tasbeehLibrary.length - 1;
  const isCollectionCompleted = isCompleted && isLastTasbeeh;

  // --- Handlers ---
  const handleRecite = useCallback(() => {
    if (isCompleted) {
      if (isLastTasbeeh) {
        // If the whole collection is done, we don't auto-reset.
        // The UI will switch to SuccessView.
        hapticService.light();
        return;
      }

      if (wasManuallySelected) {
        resetCount();
        setShowRestartIcon(true);
        hapticService.heavy();
        setWasManuallySelected(false);
        setTimeout(() => setShowRestartIcon(false), 800);
        return;
      }

      cycleTasbeeh();
      hapticService.medium();
      setWasManuallySelected(false);
      return;
    }

    incrementCount();
    hapticService.light();
    soundService.playBead();

    if (currentTasbeeh && count + 1 === currentTasbeeh.target) {
      confettiService.cannon();
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
      setWasManuallySelected(true);
      hapticService.medium();
    }
    setShowSwitchSheet(false);
  };

  const closeResetSheet = () => setShowResetSheet(false);
  const openResetSheet = () => setShowResetSheet(true);
  const closeSwitchSheet = () => setShowSwitchSheet(false);
  const closeVictory = () => setShowVictory(false);

  useEffect(() => {
    void hydrateFromDb();
  }, [hydrateFromDb]);

  return {
    // Data
    tasbeehLibrary,
    currentTasbeeh,
    count,
    streakDays,
    activeSlots,
    primarySlotIndex,
    isCompleted,
    isCollectionCompleted,
    isZero,
    pendingTasbeeh,
    
    // UI Visibility States
    showResetSheet,
    showSwitchSheet,
    showHeart,
    showUndoRipple,
    showRestartIcon,
    showVictory,
    showProgressDetailsSheet,
    wasManuallySelected,
    currentIndex,

    // Actions/Handlers
    handleRecite,
    handleUndo,
    handleResetConfirm,
    handleStepClick,
    handleSwitchConfirm,
    openResetSheet,
    closeResetSheet,
    closeSwitchSheet,
    closeVictory,
    openProgressDetailsSheet: () => setShowProgressDetailsSheet(true),
    closeProgressDetailsSheet: () => setShowProgressDetailsSheet(false),
  };
}
