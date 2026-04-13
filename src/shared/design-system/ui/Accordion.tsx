import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Squircle } from "corner-smoothing";
import { Text } from "./Text";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
  className?: string;
}

/**
 * Accordion Primitive.
 * Smooth, animated expandable panels for organizing dense information like Settings or FAQs.
 * Leverages framer-motion for height transitions and corner-smoothing for premium aesthetics.
 */
export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
  className = "",
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemIdx) => itemIdx !== id);
      } else {
        return allowMultiple ? [...prev, id] : [id];
      }
    });
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);

        return (
          <div key={item.id} className="w-full">
            <Squircle
              cornerRadius={20}
              cornerSmoothing={0.8}
              className={`border border-base-content/5 bg-base-100 transition-colors ${
                isOpen ? "bg-base-content/2" : "hover:bg-base-content/1"
              }`}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="flex items-center justify-between w-full px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  {item.icon && (
                    <div className="text-primary opacity-80">{item.icon}</div>
                  )}
                  <Text variant="body" weight="semibold">
                    {item.title}
                  </Text>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-base-content/40"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.04, 0.62, 0.23, 0.98],
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1">
                      <div className="h-px bg-base-content/5 mb-4" />
                      <Text
                        variant="body"
                        color="subtle"
                        className="text-[14px] leading-relaxed"
                      >
                        {item.content}
                      </Text>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Squircle>
          </div>
        );
      })}
    </div>
  );
};
