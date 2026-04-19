import { useState, useCallback } from "react";
import { useTasbeehStore } from "@/features/tasbeeh/store/tasbeehStore";
import { type ActiveZikrSlot, type TasbeehItem } from "@/features/tasbeeh/types";
import { useNavigate } from "react-router-dom";

export const useParallelZikr = () => {
  const navigate = useNavigate();
  const { activeSlots, addActiveSlot, removeActiveSlot, switchPrimarySlot } = useTasbeehStore();
  
  const [successSheetOpen, setSuccessSheetOpen] = useState(false);
  const [lastAddedName, setLastAddedName] = useState("");

  const canAddMore = activeSlots.length < 4;

  /**
   * adds a collection to the active parallel list
   */
  const handleAddToDaily = useCallback((collection: { id: string; name: string; items: TasbeehItem[] }) => {
    if (!canAddMore) return false;
    
    // Check if already active
    if (activeSlots.some(s => s.collectionId === collection.id)) {
        return "already_active";
    }

    addActiveSlot(collection);
    setLastAddedName(collection.name);
    setSuccessSheetOpen(true);
    return true;
  }, [canAddMore, activeSlots, addActiveSlot]);

  const handleGoHome = useCallback(() => {
    setSuccessSheetOpen(false);
    navigate("/");
  }, [navigate]);

  return {
    activeSlots,
    canAddMore,
    successSheetOpen,
    lastAddedName,
    setSuccessSheetOpen,
    handleAddToDaily,
    handleGoHome,
    removeActiveSlot,
    switchPrimarySlot
  };
};
