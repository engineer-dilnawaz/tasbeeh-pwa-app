import { useEffect, useMemo, useState } from "react";

import { HomeActionRow } from "@/features/tasbeeh/components/HomeActionRow";
import { HomeCurrentTasbeehCard } from "@/features/tasbeeh/components/HomeCurrentTasbeehCard";
import { HomeStreakStrip } from "@/features/tasbeeh/components/HomeStreakStrip";
import { useTasbeehStore } from "@/features/tasbeeh/store/tasbeehStore";
import { Button } from "@/shared/design-system/ui/Button";
import { Card } from "@/shared/design-system/ui/Card";
import { Dialog } from "@/shared/design-system/ui/Dialog";
import { Text } from "@/shared/design-system/ui/Text";

const getTodayKey = () => new Date().toISOString().slice(0, 10);

export default function Home() {
  const [showResetDialog, setShowResetDialog] = useState(false);

  const tasbeehLibrary = useTasbeehStore((state) => state.tasbeehLibrary);
  const currentTasbeehId = useTasbeehStore((state) => state.currentTasbeehId);
  const count = useTasbeehStore((state) => state.count);
  const streakDays = useTasbeehStore((state) => state.streakDays);
  const lastCompletedOn = useTasbeehStore((state) => state.lastCompletedOn);
  const isHydrated = useTasbeehStore((state) => state.isHydrated);
  const hydrateFromDb = useTasbeehStore((state) => state.hydrateFromDb);
  const incrementCount = useTasbeehStore((state) => state.incrementCount);
  const resetCount = useTasbeehStore((state) => state.resetCount);
  const cycleTasbeeh = useTasbeehStore((state) => state.cycleTasbeeh);
  const completeRound = useTasbeehStore((state) => state.completeRound);
  const setDefaultTasbeeh = useTasbeehStore((state) => state.setDefaultTasbeeh);

  const currentTasbeeh = useMemo(
    () => tasbeehLibrary.find((item) => item.id === currentTasbeehId) ?? null,
    [tasbeehLibrary, currentTasbeehId],
  );

  const isCompleted = currentTasbeeh ? count >= currentTasbeeh.target : false;
  const completedToday = lastCompletedOn === getTodayKey() || isCompleted;

  useEffect(() => {
    void hydrateFromDb();
  }, [hydrateFromDb]);

  const handlePrimaryAction = () => {
    if (isCompleted) {
      void completeRound();
      return;
    }

    void incrementCount();
  };

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-4 px-4 pt-4">
      {!currentTasbeeh ? (
        <Card variant="outlined" radius="lg" className="border-base-content/10">
          <div className="flex flex-col items-center gap-4 text-center">
            <Text variant="heading" weight="semibold">
              {isHydrated ? "No tasbeeh selected" : "Loading your tasbeeh..."}
            </Text>
            <Text variant="body" color="subtle">
              {isHydrated
                ? "Choose a tasbeeh to begin your first round."
                : "Syncing your offline progress from local database."}
            </Text>
            <Button variant="primary" onClick={() => void setDefaultTasbeeh()}>
              Select default tasbeeh
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <HomeCurrentTasbeehCard
            arabic={currentTasbeeh.arabic}
            transliteration={currentTasbeeh.transliteration}
            count={count}
            target={currentTasbeeh.target}
            onCount={() => void incrementCount()}
          />
          <HomeStreakStrip
            streakDays={streakDays}
            completedToday={completedToday}
          />
          <HomeActionRow
            isCompleted={isCompleted}
            onChangeTasbeeh={() => void cycleTasbeeh()}
            onReset={() => setShowResetDialog(true)}
            onPrimaryAction={handlePrimaryAction}
          />
        </>
      )}

      <Dialog
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        title="Reset current count?"
        description="This will reset your current tasbeeh progress to zero."
        primaryActionLabel="Reset"
        primaryVariant="warning"
        onPrimaryAction={() => void resetCount()}
      />
    </div>
  );
}

