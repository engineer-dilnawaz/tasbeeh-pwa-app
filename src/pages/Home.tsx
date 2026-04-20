import React, { useState } from "react";
import { useDate } from "@/shared/hooks/useDate";

// Hooks
import { useHomeTasbeeh } from "@/features/tasbeeh/hooks/useHomeTasbeeh";

// Shared Components
import { Drawer } from "@/shared/design-system/ui/Drawer";
import { Button } from "@/shared/design-system/ui/Button";

// Feature Components
import { TasbeehRing } from "@/features/tasbeeh/components/TasbeehRing";
import { VictoryOverlay } from "@/features/tasbeeh/components/VictoryOverlay";
import { ZikrDashboard } from "@/features/tasbeeh/components/ActiveZikr/ZikrDashboard";

// Modularized Home Components
import { HomeHeader } from "@/features/tasbeeh/components/Home/HomeHeader";
import { HomeStepper } from "@/features/tasbeeh/components/Home/HomeStepper";
import { ZikrContentCard } from "@/features/tasbeeh/components/Home/ZikrContentCard";
import { HomeControls } from "@/features/tasbeeh/components/Home/HomeControls";
import { ProgressDetailsSheet } from "@/features/tasbeeh/components/ProgressDetailsSheet";

export default function Home() {
  const [isHijri, setIsHijri] = useState(false);
  const { gregorian, hijri } = useDate();

  const {
    // Data
    tasbeehLibrary,
    currentTasbeeh,
    count,
    streakDays,
    isCompleted,
    isZero,
    pendingTasbeeh,
    currentIndex,

    // UI States
    showResetSheet,
    showSwitchSheet,
    showHeart,
    showUndoRipple,
    showRestartIcon,
    showVictory,
    showProgressDetailsSheet,
    wasManuallySelected,

    // Actions
    handleRecite,
    handleUndo,
    handleResetConfirm,
    handleStepClick,
    handleSwitchConfirm,
    openResetSheet,
    closeResetSheet,
    closeSwitchSheet,
    closeVictory,
    openProgressDetailsSheet,
    closeProgressDetailsSheet,
  } = useHomeTasbeeh();

  const isLastTasbeeh = currentIndex === tasbeehLibrary.length - 1;

  return (
    <div className="relative min-h-[calc(100vh-160px)] flex flex-col items-center bg-base-100 overflow-hidden px-4 pt-2 pb-10">
      
      {/* Header: Streak & Interactive Date Switcher */}
      <HomeHeader
        streakDays={streakDays}
        isHijri={isHijri}
        onDateToggle={() => setIsHijri(!isHijri)}
        gregorianDate={gregorian}
        hijriDate={hijri}
      />

      {/* Zikr Progress Stepper */}
      <div className="w-full mt-4">
        <HomeStepper
          library={tasbeehLibrary}
          currentIndex={currentIndex}
          onStepClick={handleStepClick}
        />
      </div>

      {/* Recitation Content Card (Expandable) */}
      <div className="w-full mt-2">
        <ZikrContentCard currentTasbeeh={currentTasbeeh} />
      </div>

      {/* Central Immersive Ring */}
      <div className="flex-1 flex items-center justify-center w-full pt-1 pb-2">
        {currentTasbeeh && (
          <TasbeehRing
            count={count}
            target={currentTasbeeh.target}
            onTap={handleRecite}
            onShowDetails={openProgressDetailsSheet}
            isCompleted={isCompleted}
          />
        )}
      </div>

      {/* Control Center & Parallel Zikr Dashboard */}
      <div className="w-full flex flex-col gap-3 mt-auto">
        <HomeControls
          isCompleted={isCompleted}
          isZero={isZero}
          isLastTasbeeh={isLastTasbeeh}
          wasManuallySelected={wasManuallySelected}
          handleRecite={handleRecite}
          handleUndo={handleUndo}
          onResetClick={openResetSheet}
          showHeart={showHeart}
          showRestartIcon={showRestartIcon}
          showUndoRipple={showUndoRipple}
        />

        <ZikrDashboard />
      </div>

      {/* Confirmation Drawers */}
      <Drawer
        isOpen={showResetSheet}
        onClose={closeResetSheet}
        snapPoints={["45%"]}
        presentation="height"
      >
        <div className="flex flex-col h-[320px] px-4 pt-4">
          <div className="flex flex-col gap-3">
            <p className="text-[17px] font-bold text-base-content leading-tight">
              Are you sure you want to reset?
            </p>
            <p className="text-[14px] leading-relaxed text-base-content/50 italic">
              "Every ending is a new beginning, in the remembrance of the Divine."
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-3 pb-4">
            <Button
              variant="primary"
              size="lg"
              className="bg-base-content! text-base-100! border-none"
              onClick={handleResetConfirm}
            >
              Yes, Reset Count
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-base-content/50"
              onClick={closeResetSheet}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Drawer>

      <Drawer
        isOpen={showSwitchSheet}
        onClose={closeSwitchSheet}
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
              Don't worry, your current progress won't be lost.
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <Button
              variant="primary"
              size="lg"
              className="bg-base-content! text-base-100! border-none"
              onClick={handleSwitchConfirm}
            >
              Yes, Switch Zikr
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-base-content/50"
              onClick={closeSwitchSheet}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Drawer>

      <VictoryOverlay
        isOpen={showVictory}
        onClose={closeVictory}
      />

      <ProgressDetailsSheet
        isOpen={showProgressDetailsSheet}
        onClose={closeProgressDetailsSheet}
        count={count}
        target={currentTasbeeh?.target ?? 0}
      />
    </div>
  );
}
