import React from "react";
import { motion } from "framer-motion";
import { LibraryBig } from "lucide-react";

import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Text } from "@/shared/design-system/ui/Text";

/** Extend when you add more error surfaces. */
export type ErrorStateCase = "collections";

export interface ErrorStateProps {
  case: ErrorStateCase;
  /** Technical detail (e.g. `error.message`) shown below the friendly copy. */
  message?: string;
  className?: string;
}

function assertNever(value: never): never {
  throw new Error(`Unhandled ErrorState case: ${String(value)}`);
}

function CollectionsErrorIcon() {
  return (
    <motion.div
      className="relative mb-4"
      initial={{ scale: 0.88, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        damping: 18,
        stiffness: 300,
        delay: 0.04,
      }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 scale-[1.35] translate-y-1 rounded-full bg-error/20 blur-xl"
        animate={{ opacity: [0.28, 0.45, 0.28] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="relative flex h-16 w-16 items-center justify-center rounded-full border border-error/25 bg-base-100 text-error"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <LibraryBig
          className="h-8 w-8 shrink-0 opacity-95"
          strokeWidth={1.5}
          aria-hidden
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * Central registry for inline error cards (Squircle + icon + title + copy).
 * New flows: add a `case` branch and extend `ErrorStateCase`.
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  case: errorCase,
  message,
  className = "",
}) => {
  switch (errorCase) {
    case "collections": {
      const detail = message?.trim();
      return (
        <Squircle
          cornerRadius={30}
          cornerSmoothing={0.99}
          className={`surface-card flex w-full flex-col items-center p-5 text-center ${className}`.trim()}
        >
          <div role="alert" className="flex min-w-0 w-full flex-col items-center">
            <motion.div
              className="flex w-full flex-col items-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              <CollectionsErrorIcon />
              <Text
                variant="heading"
                weight="semibold"
                color="error"
                className="w-full"
              >
                Could not load collections
              </Text>
              <Text
                variant="body"
                color="subtle"
                className="mt-2 w-full leading-relaxed"
              >
                Your lists are stored on this device first. Something blocked us
                from reading them—often another tab using too much memory,
                private browsing, or storage permissions for this site.
              </Text>
              <Text
                variant="body"
                color="subtle"
                className="mt-2 w-full leading-relaxed"
              >
                Try refreshing the page. If it still fails, allow storage for
                this app in your browser settings and open Tasbeeh Flow again.
              </Text>
              {detail ? (
                <Text
                  variant="body"
                  color="subtle"
                  className="mt-4 w-full max-w-full wrap-break-word text-left font-mono text-[11px] leading-snug text-base-content/55"
                >
                  {detail}
                </Text>
              ) : null}
            </motion.div>
          </div>
        </Squircle>
      );
    }
    default:
      return assertNever(errorCase);
  }
};
