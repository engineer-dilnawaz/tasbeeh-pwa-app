import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Squircle } from "../ui/Squircle";
import { cn } from "@/shared/utils/cn";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  size?: AvatarSize;
  shape?: "squircle" | "circle";
  status?: "online" | "offline" | "away";
}

const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

const statusColors = {
  online: "bg-green-500",
  offline: "bg-ds-text-subtle",
  away: "bg-amber-500",
};

/**
 * Avatar — DAS compliant avatar with initials fallback and status indicator.
 */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, name, size = "md", shape = "squircle", status, className, ...props }, ref) => {
    const [hasError, setHasError] = useState(false);
    const dimension = sizeMap[size];
    const cornerRadius = shape === "circle" ? dimension / 2 : dimension * 0.3;

    const initials = name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "?";

    return (
      <div 
        ref={ref}
        className={cn("relative shrink-0", className)} 
        style={{ width: dimension, height: dimension }}
        {...props}
      >
        <Squircle
          cornerRadius={cornerRadius}
          cornerSmoothing={shape === "circle" ? 1 : 0.6}
          className="bg-ds-text-main/5 overflow-hidden flex items-center justify-center w-full h-full"
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
                className="font-bold text-ds-text-main/40 select-none"
                style={{ fontSize: dimension * 0.4 }}
              >
                {initials}
              </motion.div>
            )}
          </AnimatePresence>
        </Squircle>

        {status && (
          <div 
            className={cn(
              "absolute bottom-0 right-0 rounded-full",
              "ring-[3px] ring-ds-bg-page", // Using ring instead of border to create the "cutout" effect
              statusColors[status]
            )}
            style={{ 
              width: Math.max(8, dimension * 0.25), 
              height: Math.max(8, dimension * 0.25) 
            }}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
