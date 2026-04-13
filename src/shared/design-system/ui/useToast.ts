import { create } from "zustand";

export type ToastVariant = "info" | "success" | "warning" | "error" | "default";

export interface ToastMessage {
  id: string;
  message: string;
  description?: string;
  variant?: ToastVariant;
  /** Auto-dismiss duration in milliseconds. Defaults to 4000ms. */
  duration?: number;
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

/** 
 * Headless Zustand store for managing active Toasts securely across all components.
 */
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    set((state) => ({ 
      // Keep max 3 toasts visible to prevent spam layout shifting
      toasts: [...state.toasts, { ...toast, id }].slice(-3) 
    }));
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

/**
 * Global functional trigger hook.
 * `toast("Saved!", { variant: "success" })`
 */
export const toast = (message: string, options?: Omit<ToastMessage, "id" | "message">) => {
  useToastStore.getState().addToast({ message, ...options });
};
