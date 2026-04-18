import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Squircle } from "@/shared/design-system/ui/Squircle";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  title?: string;
  zIndexBase?: number;
}

/**
 * ⬅️ SideDrawer (Sidebar)
 * 
 * A premium navigation drawer that slides in from the left.
 * Features a glassmorphic backdrop and squircle-edged sheet.
 */
export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  children,
  title,
  zIndexBase = 100,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setMounted(false), 300);
      document.body.style.overflow = "";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted && !isOpen) return null;

  const drawer = (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
            style={{ zIndex: zIndexBase }}
          />
        )}
      </AnimatePresence>

      {/* Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-[85%] max-w-[320px] p-3 pointer-events-none"
            style={{ zIndex: zIndexBase + 10 }}
          >
            <Squircle cornerRadius={32} cornerSmoothing={0.99} asChild>
              <div className="h-full w-full bg-base-100 shadow-2xl flex flex-col pointer-events-auto border border-base-content/5">
                {/* Header Area */}
                <div className="flex items-center justify-between px-6 py-5 mt-2">
                  <span className="text-xl font-black tracking-tight text-base-content">
                    {title || "Menu"}
                  </span>
                  <button
                    onClick={onClose}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-base-200 text-base-content/60 active:scale-90 transition-transform"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content Slot */}
                <div className="flex-1 overflow-y-auto px-4 py-2 no-scrollbar">
                  {children}
                </div>

                {/* Footer / Version */}
                <div className="p-6 border-t border-base-content/5 text-center">
                  <span className="text-[10px] font-bold text-base-content/20 uppercase tracking-[0.2em]">
                    Tasbeeh Flow v2.0
                  </span>
                </div>
              </div>
            </Squircle>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return createPortal(drawer, document.body);
};
