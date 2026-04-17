import React from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Text } from "@/shared/design-system/ui/Text";

/** Add new keys here as you introduce more zero states. */
export type ZeroStateCase = "collections";

export interface ZeroStateProps {
  case: ZeroStateCase;
  className?: string;
}

function assertNever(value: never): never {
  throw new Error(`Unhandled ZeroState case: ${String(value)}`);
}

function CollectionsZeroIcon() {
  return (
    <motion.div
      className="relative mb-4"
      initial={{ scale: 0.88, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        damping: 17,
        stiffness: 280,
        delay: 0.05,
      }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 scale-[1.4] translate-y-1 rounded-full bg-primary/25 blur-xl"
        animate={{ opacity: [0.32, 0.52, 0.32] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="relative flex h-16 w-16 items-center justify-center rounded-full border border-base-content/10 bg-base-100 text-primary"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <BookOpen className="h-8 w-8 shrink-0 opacity-90" strokeWidth={1.5} aria-hidden />
      </motion.div>
    </motion.div>
  );
}

/**
 * Central registry for empty / zero-data surfaces (Squircle card shell + copy).
 * New screens: add a `case` branch and extend `ZeroStateCase`.
 */
export const ZeroState: React.FC<ZeroStateProps> = ({
  case: zeroCase,
  className = "",
}) => {
  switch (zeroCase) {
    case "collections":
      return (
        <Squircle
          cornerRadius={30}
          cornerSmoothing={0.99}
          className={`surface-card flex w-full flex-col items-center p-5 text-center ${className}`.trim()}
        >
          <motion.div
            className="flex w-full flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <CollectionsZeroIcon />
            <Text variant="heading" weight="semibold" className="w-full">
              No collections yet
            </Text>
            <Text variant="body" color="subtle" className="mt-2 w-full leading-relaxed">
              Organize phrases into collections for different times of day or
              moods. Each collection keeps its own order and targets so you can
              switch dhikr without losing your place.
            </Text>
            <Text variant="caption" color="subtle" className="mt-3 w-full leading-relaxed">
              Tap the + button below to create your first collection. Everything
              is saved on this device first; you can sync when you are ready.
            </Text>
          </motion.div>
        </Squircle>
      );
    default:
      return assertNever(zeroCase);
  }
};
