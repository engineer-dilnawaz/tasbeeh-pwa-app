import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/utils/cn";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Switch — A premium animated toggle.
 * Pure Tailwind + Framer Motion.
 */
export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = "md",
  className,
}) => {
  const isSm = size === "sm";
  
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out",
        isSm ? "h-5 w-9" : "h-6 w-11",
        checked ? "bg-ds-primary" : "bg-ds-text-main/10",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
    >
      <motion.span
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
        className={cn(
          "pointer-events-none inline-block transform rounded-full bg-white shadow-lg ring-0",
          isSm ? "h-4 w-4 m-0.5" : "h-5 w-5 m-0.5",
          checked ? (isSm ? "translate-x-4" : "translate-x-5") : "translate-x-0"
        )}
      />
    </button>
  );
};

Switch.displayName = "Switch";
