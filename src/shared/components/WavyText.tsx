import React from "react";
import { motion } from "framer-motion";

interface WavyTextProps {
  text: string;
  className?: string;
  baseDelay?: number;
  waveHeight?: number;
  loop?: boolean;
}

/**
 * WavyText — A reusable component that animates text with a staggered, wavy effect.
 * Features a springy bubble entrance and an optional infinite floating loop.
 */
export const WavyText: React.FC<WavyTextProps> = ({ 
  text, 
  className = "", 
  baseDelay = 0.3,
  waveHeight = -8,
  loop = true
}) => {
  const letters = text.split("");

  return (
    <div className={`flex overflow-hidden ${className}`}>
      {letters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0, scale: 0.5 }}
          animate={{ 
            y: loop ? [0, waveHeight, 0] : 0, 
            opacity: 1, 
            scale: 1,
          }}
          transition={{
            y: loop ? {
              duration: 2,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: baseDelay + 0.2 + (index * 0.1)
            } : {
              type: "spring",
              damping: 10,
              stiffness: 150,
              delay: baseDelay + (index * 0.05)
            },
            opacity: { duration: 0.4, delay: baseDelay + (index * 0.05) },
            scale: { 
              type: "spring", 
              damping: 10, 
              stiffness: 150, 
              delay: baseDelay + (index * 0.05) 
            }
          }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};
