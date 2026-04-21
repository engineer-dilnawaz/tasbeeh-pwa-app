import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypingTextProps {
  text: string;
  className?: string;
  typingSpeed?: number;
  erasingSpeed?: number;
  pauseDuration?: number;
}

/**
 * TypingText — A premium typing animation component.
 * Features character-by-character appearance, a blinking cursor,
 * and a smooth backspace-style erasure before looping.
 */
export const TypingText: React.FC<TypingTextProps> = ({
  text,
  className = "",
  typingSpeed = 100,
  erasingSpeed = 50,
  pauseDuration = 2000,
}) => {
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTyping(!isTyping);
    }, isTyping ? (text.length * typingSpeed) + pauseDuration : 1500);

    return () => clearTimeout(timeout);
  }, [isTyping, text, typingSpeed, pauseDuration]);

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative flex items-center overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: isTyping ? "auto" : 0,
          }}
          transition={{
            duration: isTyping ? (text.length * typingSpeed) / 1000 : 0.8,
            ease: isTyping ? "linear" : "easeInOut",
          }}
          className="whitespace-nowrap overflow-hidden"
        >
          {text}
        </motion.div>
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="w-[2px] h-[1.2em] bg-primary ml-0.5 shrink-0"
        />
      </div>
    </div>
  );
};
