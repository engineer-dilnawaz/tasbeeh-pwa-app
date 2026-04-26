/**
 * Global application constants.
 */

/**
 * Standard variants for the Toast notification system.
 */
export const TOAST_VARIANTS = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  DEFAULT: "default",
} as const;

/**
 * Type derived from TOAST_VARIANTS values.
 */
export type ToastVariantValue = typeof TOAST_VARIANTS[keyof typeof TOAST_VARIANTS];
