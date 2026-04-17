import { Squircle } from "corner-smoothing";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { Text } from "./Text";

export interface DialogProps {
  /** Controls visibility state */
  isOpen: boolean;
  /** Callback triggered to close the modal */
  onClose: () => void;
  /** Primary modal header */
  title: string;
  /** Optional subtext below the title */
  description?: string;
  /** Optional custom inline React Nodes */
  children?: React.ReactNode;
  /** Label for the primary action button */
  primaryActionLabel?: string;
  /** Action executed on primary button click (Closes dialog automatically after execution) */
  onPrimaryAction?: () => void;
  /** Visual variant of the primary action (Defaults to "primary", use "error" for destructive actions) */
  primaryVariant?: "primary" | "error" | "warning";
  /** Label for the optional secondary (cancel) button. Passing an empty string hides it. */
  secondaryActionLabel?: string;
  /** If true, tapping the blurred background closes the dialog */
  closeOnBackdrop?: boolean;
}

/**
 * Dialog Primitive.
 * High-fidelity centered alert modal tailored for destructive/confirmation actions.
 * Framer-motion driven layout wrapped strictly inside a React Portal.
 */
export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  primaryActionLabel,
  onPrimaryAction,
  primaryVariant = "primary",
  secondaryActionLabel = "Cancel",
  closeOnBackdrop = true,
}) => {
  // Isolate scroll-locking behind the open state hook
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (typeof document === "undefined") return null;

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 sm:p-4">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Centered Modal Content */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 350,
              mass: 0.8,
            }}
            className="relative w-full max-w-[320px] shrink-0"
            role="dialog"
            aria-modal="true"
          >
            <Squircle
              cornerRadius={32}
              cornerSmoothing={0.8}
              className="bg-base-100 shadow-2xl flex flex-col items-center text-center px-6 pt-8 pb-6 overflow-hidden"
            >
              <Text
                variant="heading"
                className="text-[19px] mb-2.5 font-bold leading-tight! text-base-content"
              >
                {title}
              </Text>

              {description && (
                <Text
                  variant="body"
                  color="subtle"
                  className="text-[14px] leading-relaxed mb-7 pb-1"
                >
                  {description}
                </Text>
              )}

              {children && (
                <div className="w-full mb-6 text-left">{children}</div>
              )}

              {/* Action Array */}
              <div className="w-full flex flex-col gap-2.5 mt-auto">
                {primaryActionLabel && (
                  <Button
                    variant={primaryVariant}
                    className="w-full rounded-[16px] h-13 font-bold text-[15px]"
                    onClick={() => {
                      onPrimaryAction?.();
                      onClose();
                    }}
                  >
                    {primaryActionLabel}
                  </Button>
                )}

                {secondaryActionLabel && (
                  <Button
                    variant="ghost"
                    className="w-full rounded-[16px] h-12 font-bold text-[15px] opacity-80"
                    onClick={onClose}
                  >
                    {secondaryActionLabel}
                  </Button>
                )}
              </div>
            </Squircle>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
};
