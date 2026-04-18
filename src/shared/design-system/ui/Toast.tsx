import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Squircle } from "corner-smoothing";
import { Check, AlertCircle, Info, AlertTriangle, X, Hash } from "lucide-react";
import {
  useToastStore,
  type ToastVariant,
  type ToastMessage,
} from "./useToast";

const variantIcons: Record<ToastVariant, React.FC<any>> = {
  default: Hash,
  info: Info,
  success: Check,
  warning: AlertTriangle,
  error: AlertCircle,
};

const variantColors: Record<ToastVariant, string> = {
  default: "text-base-content",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
};

/**
 * Isolated Toast item to handle individual countdown lifecycles.
 */
const ToastItem: React.FC<{
  toast: ToastMessage;
  onRemove: (id: string) => void;
}> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const Icon = variantIcons[toast.variant || "default"];
  const iconStyle = variantColors[toast.variant || "default"];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ type: "spring", damping: 25, stiffness: 350, mass: 0.8 }}
      className="pointer-events-auto"
    >
      <Squircle
        cornerRadius={18}
        cornerSmoothing={0.8}
        className="flex items-start gap-3 bg-base-100/98 dark:bg-base-200/95 backdrop-blur-xl px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-base-content/10 w-[340px] max-w-[90vw]"
      >
        <div className={`mt-[2px] shrink-0 ${iconStyle}`}>
          <Icon className="w-4 h-4 shadow-sm" />
        </div>
        <div className="flex flex-col flex-1 mr-2">
          <span className="text-[14px] font-semibold leading-tight text-base-content relative top-px">
            {toast.message}
          </span>
          {toast.description && (
            <span className="text-[13px] opacity-70 leading-snug mt-1 pt-0.5">
              {toast.description}
            </span>
          )}
        </div>

        <button
          onClick={() => onRemove(toast.id)}
          className="shrink-0 p-1 -mr-2 opacity-40 hover:opacity-100 transition-opacity active:scale-95"
        >
          <X className="w-4 h-4 text-base-content" />
        </button>
      </Squircle>
    </motion.div>
  );
};

/**
 * Toaster Layout Component.
 * Mount this once globally (e.g. inside AppLayout.tsx or TestScreen).
 * Rendered strictly into document.body to break out of specific screen bounds.
 */
export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToastStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed top-0 left-0 right-0 z-1000 flex flex-col items-center gap-3 p-4 sm:p-6 pointer-events-none overscroll-none pt-[calc(env(safe-area-inset-top)+1rem)]">
      {/* Dynamic Top-Edge Overlay */}
      {/* Sweeps a soft gradient down behind the Toasts to artificially distance them from busy background content */}
      <AnimatePresence>
        {toasts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 top-0 h-[240px] bg-linear-to-b from-black/20 dark:from-black/40 to-transparent pointer-events-none -z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
};
