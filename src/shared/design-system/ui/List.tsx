import React from "react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// ListItem
// ─────────────────────────────────────────────────────────────────────────────

export interface ListItemProps {
  /** Leading element (icon, avatar, checkbox) */
  leading?: React.ReactNode;
  /** Main title text */
  title: React.ReactNode;
  /** Optional secondary descriptive text */
  description?: React.ReactNode;
  /** Trailing element (badge, button, chevron) */
  trailing?: React.ReactNode;
  /** Click handler—enables tap animation if provided */
  onClick?: () => void;
  /** Style variant */
  variant?: "plain" | "surface";
  /** If true, removes padding constraints */
  flush?: boolean;
  className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
  leading,
  title,
  description,
  trailing,
  onClick,
  variant = "plain",
  flush = false,
  className = "",
}) => {
  const isPressable = !!onClick;

  const content = (
    <div className={`
      flex items-center w-full gap-4
      ${variant === "surface" ? "bg-base-100/50 rounded-2xl border border-base-content/5 p-4" : !flush ? "py-4 px-2" : ""}
      ${className}
    `}>
      {leading && (
        <div className="flex-none flex items-center justify-center min-w-[24px]">
          {leading}
        </div>
      )}
      
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="text-base font-semibold text-base-content leading-tight truncate">
          {title}
        </div>
        {description && (
          <div className="text-sm text-base-content/60 leading-normal mt-0.5">
            {description}
          </div>
        )}
      </div>

      {trailing && (
        <div className="flex-none flex items-center justify-center ml-auto">
          {trailing}
        </div>
      )}
    </div>
  );

  if (isPressable) {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="w-full text-left bg-transparent border-none p-0 appearance-none focus:outline-none group"
      >
        {content}
      </motion.button>
    );
  }

  return content;
};

// ─────────────────────────────────────────────────────────────────────────────
// List (Container)
// ─────────────────────────────────────────────────────────────────────────────

interface ListProps {
  children: React.ReactNode;
  /** 
   * "spaced"  — items have gaps between them
   * "divided" — items are stacked with hair-line dividers
   */
  variant?: "spaced" | "divided";
  gap?: number;
  className?: string;
}

export const List: React.FC<ListProps> = ({
  children,
  variant = "spaced",
  gap = 4,
  className = "",
}) => {
  if (variant === "divided") {
    return (
      <div className={`flex flex-col w-full bg-base-100/50 rounded-3xl border border-base-content/5 overflow-hidden ${className}`}>
        {React.Children.map(children, (child, index) => (
          <React.Fragment key={index}>
            {child}
            {index < React.Children.count(children) - 1 && (
              <div className="mx-4 h-px bg-base-content/5" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div 
      className={`flex flex-col w-full ${className}`}
      style={{ gap: `${gap * 4}px` }}
    >
      {children}
    </div>
  );
};
