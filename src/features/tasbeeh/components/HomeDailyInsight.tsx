import React from "react";
import { Quote } from "lucide-react";
import { Squircle } from "@/shared/design-system/ui/Squircle";

export const HomeDailyInsight: React.FC = () => {
  return (
    <div className="w-full flex justify-center px-4">
      <Squircle
        cornerRadius={24}
        cornerSmoothing={0.99}
        className="w-full max-w-[400px] bg-white/50 backdrop-blur-sm border border-white p-4 flex items-start gap-3 shadow-sm"
      >
        <div className="p-2 rounded-xl bg-[#5B6BF0]/10 text-[#5B6BF0]">
          <Quote size={16} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-[#5B6BF0] tracking-widest">
            Ayat of the Day
          </span>
          <p className="text-[13px] text-[#2C2C2C] leading-relaxed font-medium">
            "So remember Me; I will remember you." — 2:152
          </p>
        </div>
      </Squircle>
    </div>
  );
};
