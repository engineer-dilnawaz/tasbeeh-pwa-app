import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Squircle } from "corner-smoothing";
import { TOKENS } from "../tokens";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  shape?: "squircle" | "circle";
  status?: "online" | "offline" | "away";
  className?: string;
  borderWidth?: number;
  disableHover?: boolean;
  style?: React.CSSProperties;
}

const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

const statusColors = {
  online: "bg-success",
  offline: "bg-base-content/30",
  away: "bg-warning",
};

/**
 * Premium Avatar Primitive.
 * Features Squircle geometry, initials fallback, and status indicator.
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = "md",
  shape = "squircle",
  status,
  className = "",
  disableHover = false,
  style,
}) => {
  const [hasError, setHasError] = useState(false);
  const dimension = sizeMap[size];
  const cornerRadius = shape === "circle" ? dimension / 2 : dimension * 0.35;
  
  // Extract initials from name
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="relative w-fit h-fit" style={style}>
      <motion.div
        whileHover={disableHover ? undefined : { scale: 1.05 }}
        whileTap={disableHover ? undefined : { scale: 0.95 }}
        transition={TOKENS.motion.spring}
        className={className}
        style={{
          width: dimension,
          height: dimension,
          flexShrink: 0,
          ...(disableHover ? { willChange: 'auto' } : {}),
        }}
      >
        <Squircle
          cornerRadius={cornerRadius}
          cornerSmoothing={shape === "circle" ? 1 : 0.8}
          className="bg-base-content/5 overflow-hidden flex items-center justify-center w-full h-full"
        >
          <AnimatePresence mode="wait">
            {src && !hasError ? (
              <motion.img
                key="image"
                src={src}
                alt={name}
                onError={() => setHasError(true)}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            ) : (
              <motion.div
                key="fallback"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-base-content/60"
                style={{ fontSize: dimension * 0.4 }}
              >
                {initials}
              </motion.div>
            )}
          </AnimatePresence>
        </Squircle>
      </motion.div>

      {/* Status indicator */}
      {status && (
        <div 
          className={`absolute bottom-0 right-0 rounded-full border-2 border-base-100 ${statusColors[status]}`}
          style={{ 
            width: Math.max(8, dimension * 0.25), 
            height: Math.max(8, dimension * 0.25) 
          }}
        />
      )}
    </div>
  );
};
