import React from "react";
import { motion } from "framer-motion";
import { Squircle } from "./Squircle";

interface TabOption<T extends string> {
  id: T;
  label: string;
}

interface PillTabsProps<T extends string> {
  options: TabOption<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  className?: string;
}

/**
 * Reusable Pill-shaped Tabs component.
 * Features smooth Framer Motion selection animation.
 */
export function PillTabs<T extends string>({
  options,
  activeTab,
  onChange,
  className = "",
}: PillTabsProps<T>) {
  return (
    <div className={`p-1.5 bg-white border border-base-content/5 rounded-full flex items-center gap-1 ${className}`}>
      {options.map((option) => {
        const isActive = activeTab === option.id;
        
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`relative flex-1 py-3 px-6 rounded-full text-sm font-semibold transition-colors duration-200 z-10 ${
              isActive ? "text-primary-content" : "text-base-content/50 hover:text-base-content/80"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-primary rounded-full -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
