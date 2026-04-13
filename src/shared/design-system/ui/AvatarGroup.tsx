import React, { useState } from "react";
import { motion } from "framer-motion";
import { Avatar } from "./Avatar";
import type { AvatarProps, AvatarSize } from "./Avatar";
import { Squircle } from "corner-smoothing";
import { TOKENS } from "../tokens";

interface AvatarGroupProps {
  avatars: AvatarProps[];
  max?: number;
  total?: number;
  size?: AvatarSize;
  shape?: "squircle" | "circle";
  ringColor?: string;
  className?: string;
}

const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

/**
 * Premium AvatarStack / AvatarGroup.
 * Handles negative spacing, overlap order, the counter badge,
 * and a press-and-hold peek interaction per avatar.
 */
export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 3,
  total,
  size = "md",
  shape = "squircle",
  ringColor = "var(--color-base-100)",
  className = "",
}) => {
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);
  const visibleAvatars = avatars.slice(0, max);
  const dimension = sizeMap[size];
  const remainingCount = total ? total - max : avatars.length - max;

  let spacingClass = "-space-x-2";
  if (size === "xs") spacingClass = "-space-x-1.5";
  if (size === "sm") spacingClass = "-space-x-2.5";
  if (size === "md") spacingClass = "-space-x-4";
  if (size === "lg") spacingClass = "-space-x-5";
  if (size === "xl") spacingClass = "-space-x-6";

  return (
    <div className={`flex items-end h-fit py-4 ${spacingClass} ${className}`}>
      {visibleAvatars.map((avatar, index) => {
        const isPressed = pressedIndex === index;
        return (
          <motion.div
            key={index}
            animate={{
              scale: isPressed ? 2.2 : 1,
              y: isPressed ? -dimension * 0.6 : 0,
              zIndex: isPressed ? 100 : 1,
            }}
            transition={TOKENS.motion.spring}
            style={{ 
              outline: isPressed ? "none" : `4px solid ${ringColor}`,
              borderRadius: shape === "circle" ? "50%" : undefined,
              position: "relative",
              cursor: "pointer",
            }}
            onPointerDown={() => setPressedIndex(index)}
            onPointerUp={() => setPressedIndex(null)}
            onPointerLeave={() => setPressedIndex(null)}
            onPointerCancel={() => setPressedIndex(null)}
            onContextMenu={() => setPressedIndex(null)}
          >
            <Avatar
              {...avatar}
              size={size}
              shape={shape}
              disableHover
            />
          </motion.div>
        );
      })}

      {remainingCount > 0 && (
        <div className="relative" style={{ zIndex: 50 }}>
          <div style={{ width: dimension, height: dimension, flexShrink: 0 }}>
            <Squircle
              cornerRadius={shape === "circle" ? dimension / 2 : dimension * 0.35}
              cornerSmoothing={shape === "circle" ? 1 : 0.8}
              className="bg-base-300 text-base-content/60 flex items-center justify-center font-bold w-full h-full"
              style={{
                fontSize: dimension * 0.3,
                outline: `4px solid ${ringColor}`,
              }}
            >
              +{remainingCount >= 1000
                ? `${(remainingCount / 1000).toFixed(0)}k`
                : remainingCount}
            </Squircle>
          </div>
        </div>
      )}
    </div>
  );
};
