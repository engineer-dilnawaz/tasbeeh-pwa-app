import React from "react";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import type { TasbeehItem } from "@/features/tasbeeh/types";

interface HomeStepperProps {
  library: TasbeehItem[];
  currentIndex: number;
  onStepClick: (item: TasbeehItem) => void;
}

export const HomeStepper: React.FC<HomeStepperProps> = ({
  library,
  currentIndex,
  onStepClick,
}) => {
  return (
    <Squircle cornerRadius={24} cornerSmoothing={0.99} asChild>
      <div className="w-full bg-white dark:bg-black px-4 py-3">
        <div className="w-full overflow-x-auto no-scrollbar">
          <ul className="steps w-full">
            {library.map((item, index) => {
              const status =
                index < currentIndex
                  ? "completed"
                  : index === currentIndex
                    ? "current"
                    : "upcoming";

              return (
                <li
                  key={item.id}
                  onClick={() => onStepClick(item)}
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
  );
};
