import { useState } from "react";

interface UseDrawerReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * useDrawer — lightweight state hook for controlling a Drawer's open/close lifecycle.
 * Keeps the Drawer stateless so it can be driven from any parent.
 */
export function useDrawer(initialOpen = false): UseDrawerReturn {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return {
    isOpen,
    open:   () => setIsOpen(true),
    close:  () => setIsOpen(false),
    toggle: () => setIsOpen((v) => !v),
  };
}
