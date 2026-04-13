import React from "react";
import { motion } from "framer-motion";
import { Text } from "./Text";
import { Button } from "./Button";

export interface EmptyStateProps {
  /** Optional icon to display at the top, usually a Lucide React component */
  icon?: React.ReactNode;
  /** Primary title of the empty state */
  title: string;
  /** Secondary explanatory text */
  description?: string;
  /** Label for the recovery/action button */
  actionLabel?: string;
  /** Callback when the action button is tapped */
  onAction?: () => void;
}

/**
 * EmptyState Primitive.
 * High-fidelity placeholder layouts for when arrays (like History or Custom Tasbeehs) are utterly empty.
 * Implements centralized orchestration, gentle entry motions, and prominent ambient icon glows.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center p-8 text-center w-full min-h-[300px]"
    >
      {icon && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.05 }}
          className="relative mb-6"
        >
          {/* Ambient Glow Aura */}
          <div className="absolute inset-0 bg-primary/20 dark:bg-primary/20 blur-2xl rounded-full scale-150 transform translate-y-2" />
          
          {/* Elevated Circular Icon Frame */}
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-base-100 border border-base-content/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] text-primary">
            {React.isValidElement(icon)
              // @ts-ignore
              ? React.cloneElement(icon, { className: "w-8 h-8 opacity-80", strokeWidth: 1.5 })
              : icon}
          </div>
        </motion.div>
      )}

      <Text variant="heading" className="text-[19px] mb-2 font-bold tracking-tight text-base-content">
        {title}
      </Text>

      {description && (
        <Text variant="body" color="subtle" className="max-w-[280px] text-[14.5px] leading-relaxed mb-6">
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Button variant="secondary" onClick={onAction} className="rounded-2xl px-6 h-12 shadow-sm font-semibold">
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
