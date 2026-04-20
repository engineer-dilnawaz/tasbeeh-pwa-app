import React, { useState } from "react";
import { Drawer } from "@/shared/design-system/ui/Drawer";
import { motion, AnimatePresence } from "framer-motion";
import { calculateSetState } from "../utils/counterEngine";

interface ProgressDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  count: number;
  target: number;
}

export const ProgressDetailsSheet: React.FC<ProgressDetailsSheetProps> = ({
  isOpen,
  onClose,
  count,
  target,
}) => {
  const [activeTab, setActiveTab] = useState<"visual" | "list">("visual");
  const [activeTooltipId, setActiveTooltipId] = useState<number | null>(null);

  const { totalSets, currentSetIndex, setProgress, overallProgress } =
    calculateSetState(count, target);

  // Close tooltip when clicking background
  const handleContainerClick = () => setActiveTooltipId(null);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={["70%"]}
      presentation="height"
    >
      <div
        className="flex flex-col h-[550px] w-full px-6 pt-2 pb-8 overflow-hidden bg-base-100"
        onClick={handleContainerClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 w-full">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-[20px] font-black text-base-content truncate">
              Progress Insights
            </h2>
            <p className="text-[12px] opacity-40 uppercase tracking-widest font-bold truncate">
              {count.toLocaleString()} / {target.toLocaleString()} Total
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex shrink-0 bg-base-200 p-1 rounded-full relative">
            {["visual", "list"].map((tab) => (
              <button
                key={tab}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab(tab as any);
                  setActiveTooltipId(null);
                }}
                className={`relative px-4 py-1.5 text-[10px] font-black uppercase tracking-wider z-10 transition-colors duration-300 ${
                  activeTab === tab
                    ? "text-primary-content"
                    : "text-base-content/40"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabProgress"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area - STRICT VERTICAL SCROLL, HIDDEN SCROLLBAR */}
        <div
          onTouchMove={() => setActiveTooltipId(null)}
          onWheel={() => setActiveTooltipId(null)}
          className="flex-1 overflow-x-hidden overflow-y-auto w-full scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <AnimatePresence mode="wait">
            {activeTab === "visual" ? (
              <motion.div
                key="visual"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8 w-full"
              >
                {/* 1. Overall Gauge */}
                <div className="bg-base-200/50 p-6 rounded-[24px] space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-black opacity-30 uppercase tracking-widest">
                      Global Completion
                    </span>
                    <span className="text-[24px] font-black text-primary font-display">
                      {Math.round(overallProgress)}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-base-300 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${overallProgress}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>

                {/* 2. Generation Stacks Grid */}
                <div className="space-y-4 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black opacity-30 uppercase tracking-widest">
                      Rotation Stacks
                    </span>
                    <span className="text-[10px] opacity-40 font-bold italic">
                      Tap to focus
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pb-32">
                    {Array.from({ length: totalSets }).map((_, idx) => {
                      const isCompleted = idx < currentSetIndex;
                      const isCurrent = idx === currentSetIndex;
                      const isActive = activeTooltipId === idx;

                      // Calculate beads for this set for the tooltip
                      const startOfSet = idx * 33;
                      const isLast = idx === totalSets - 1;
                      const beadsInSet = isLast ? target - startOfSet : 33;
                      const completedInSet = isCompleted
                        ? beadsInSet
                        : isCurrent
                          ? count - startOfSet
                          : 0;

                      // Edge Detection
                      const isLeftEdge = idx % 4 === 0;
                      const isRightEdge = (idx + 1) % 4 === 0;
                      const isLeftEdgeSm = idx % 6 === 0;
                      const isRightEdgeSm = (idx + 1) % 6 === 0;

                      return (
                        <div
                          key={idx}
                          // CRITICAL: Elevate the entire container when active to prevent overlap/transparency
                          className={`relative transition-all duration-300 ${isActive ? "z-[100]" : "z-0"}`}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const isOpening = activeTooltipId !== idx;
                              setActiveTooltipId(isOpening ? idx : null);

                              // Imperative Auto-Scroll: Bring the selected item to center to prevent cropping
                              if (isOpening) {
                                e.currentTarget.scrollIntoView({
                                  behavior: "smooth",
                                  block: "center",
                                  inline: "nearest",
                                });
                              }
                            }}
                            className={`w-full h-16 rounded-xl border-2 transition-all duration-500 flex flex-col items-center justify-center gap-1 ${
                              isCompleted
                                ? "bg-primary/5 border-primary/20"
                                : isCurrent
                                  ? "bg-base-100 border-primary"
                                  : "bg-base-200/50 border-transparent opacity-60"
                            } ${isActive ? "scale-105 border-primary" : "scale-100"}`}
                          >
                            <span
                              className={`text-[10px] font-black ${isCurrent ? "text-primary" : "opacity-30"}`}
                            >
                              #{idx + 1}
                            </span>

                            {isCurrent && (
                              <div className="w-6 h-1 bg-primary/20 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-primary"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${setProgress}%` }}
                                />
                              </div>
                            )}

                            {isCompleted && (
                              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                            )}
                          </button>

                          {/* Custom Elevated Tooltip - STATIC POP (Fade/Scale Only) */}
                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className={`absolute bottom-full mb-4 z-100 w-32 pointer-events-none
                                  ${isLeftEdge ? "left-0" : isRightEdge ? "right-0" : "left-1/2 -translate-x-1/2"}
                                  sm:${isLeftEdgeSm ? "sm:left-0 sm:translate-x-0" : isRightEdgeSm ? "sm:right-0 sm:translate-x-0" : "sm:left-1/2 sm:-translate-x-1/2"}
                                `}
                              >
                                <div className="bg-base-content text-base-100 p-3 rounded-2xl relative border border-base-100/10">
                                  <div className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-0.5">
                                    Rotation {idx + 1}
                                  </div>
                                  <div className="text-[12px] font-bold leading-tight mb-1">
                                    {isCompleted
                                      ? "Completed"
                                      : isCurrent
                                        ? "Active Circle"
                                        : "Locked Goal"}
                                  </div>
                                  <div className="text-[10px] font-medium opacity-80">
                                    {completedInSet} / {beadsInSet} Beads
                                  </div>

                                  {/* Triangle Arrow */}
                                  <div
                                    className={`absolute -bottom-1 w-3 h-3 bg-base-content rotate-45
                                    ${isLeftEdge ? "left-5" : isRightEdge ? "right-5" : "left-1/2 -translate-x-1/2"}
                                    sm:${isLeftEdgeSm ? "sm:left-5 sm:translate-x-0" : isRightEdgeSm ? "sm:right-5 sm:translate-x-0" : "sm:left-1/2 sm:-translate-x-1/2"}
                                  `}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3 pb-8 w-full"
              >
                {Array.from({ length: totalSets }).map((_, idx) => {
                  const isCompleted = idx < currentSetIndex;
                  const isCurrent = idx === currentSetIndex;

                  // Calculate beads for this set
                  const startOfSet = idx * 33;
                  const isLast = idx === totalSets - 1;
                  const beadsInSet = isLast ? target - startOfSet : 33;
                  const completedInSet = isCompleted
                    ? beadsInSet
                    : isCurrent
                      ? count - startOfSet
                      : 0;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-4 rounded-[22px] transition-all duration-300 w-full ${
                        isCurrent
                          ? "bg-primary/5 border border-primary/20 ring-4 ring-primary/5"
                          : "bg-base-200/30 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black ${
                            isCompleted
                              ? "bg-success/10 text-success"
                              : isCurrent
                                ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
                                : "bg-base-300/50 text-base-content/20"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-[14px] font-bold truncate ${isCurrent ? "text-primary" : "text-base-content"}`}
                          >
                            Circle Rotation {idx + 1}
                          </p>
                          <p className="text-[11px] opacity-40 font-medium">
                            {completedInSet} / {beadsInSet} Beads
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                            isCompleted
                              ? "bg-success/10 text-success"
                              : isCurrent
                                ? "bg-primary/10 text-primary"
                                : "bg-base-200 text-base-content/20"
                          }`}
                        >
                          {isCompleted
                            ? "Done"
                            : isCurrent
                              ? "Active"
                              : "Locked"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Drawer>
  );
};
