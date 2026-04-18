import React from "react";
import { motion } from "framer-motion";
import { Squircle } from "@/shared/design-system/ui/Squircle";

interface AppLogoProps {
  size?: number;
  text?: string;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 80,
  text = "ذ",
  className = "",
}) => {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <Squircle
        cornerRadius={size * 0.3}
        cornerSmoothing={0.99}
        className="absolute inset-0 bg-[#5B6BF0] shadow-xl shadow-[#5B6BF0]/20"
        asChild
      >
        <div className="relative w-full h-full">
          {/* Abstract Bead Ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.15 }}
                className="absolute w-[8%] h-[8%] bg-white rounded-full"
                style={{
                  top: `${50 + 35 * Math.sin((i * 30 * Math.PI) / 180)}%`,
                  left: `${50 + 35 * Math.cos((i * 30 * Math.PI) / 180)}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
          </div>

          {/* Center Text container - Absolute inset-0 + Flex is usually enough, but let's be explicit */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-white font-bold leading-none select-none tracking-tight"
              style={{ fontSize: text.length > 1 ? size * 0.28 : size * 0.4 }}
            >
              {text}
            </span>
          </div>

          {/* Green Accent Dot - Aligned with the ring rhythm */}
          <div
            className="absolute w-[12%] h-[12%] bg-[#3DB88A] rounded-full border-2 border-[#5B6BF0] shadow-sm z-10"
            style={{
              top: `${50 + 35 * Math.sin((-60 * Math.PI) / 180)}%`,
              left: `${50 + 35 * Math.cos((-60 * Math.PI) / 180)}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      </Squircle>
    </div>
  );
};
