import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// Individual Digit Component
// ─────────────────────────────────────────────────────────────────────────────

interface DigitProps {
  value: number;
  height: number;
}

const Digit: React.FC<DigitProps> = ({ value, height }) => {
  return (
    <div 
      className="relative overflow-hidden inline-flex" 
      style={{ height, width: "0.6em" }}
    >
      <motion.div
        animate={{ y: -value * height }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="flex flex-col items-center absolute top-0 left-0 right-0"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div 
            key={n} 
            className="flex items-center justify-center"
            style={{ height, width: "100%" }}
          >
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Counter Component
// ─────────────────────────────────────────────────────────────────────────────

export interface CounterProps {
  value: number;
  /** Size matches Typography variants */
  variant?: "counter" | "heading" | "display-arabic";
  className?: string;
}

const variantStyles = {
  counter: "text-5xl font-bold font-mono tracking-tighter",
  heading: "text-2xl font-bold tracking-tight",
  "display-arabic": "text-6xl font-arabic",
};

/**
 * Counter — an odometer-style rolling digit display.
 */
export const Counter: React.FC<CounterProps> = ({
  value,
  variant = "counter",
  className = "",
}) => {
  // Convert value to array of digits
  const digits = Math.abs(value).toString().split("").map(Number);
  
  // Measure standard character height for this variant (approximate)
  // We use a hidden span to get the line height of the current variant
  const [height, setHeight] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (containerRef.current) {
      // Create a temporary hidden character to measure height
      const measure = document.createElement("span");
      measure.innerText = "0";
      measure.className = variantStyles[variant];
      measure.style.visibility = "hidden";
      measure.style.position = "absolute";
      document.body.appendChild(measure);
      setHeight(measure.offsetHeight);
      document.body.removeChild(measure);
    }
  }, [variant]);

  return (
    <div 
      ref={containerRef}
      className={`${variantStyles[variant]} ${className} flex items-center tabular-nums`}
      aria-label={`Count: ${value}`}
    >
      <AnimatePresence mode="popLayout">
        {digits.map((digit, i) => (
          <Digit 
            key={`${digits.length - i}`} // Keys stable from right-to-left
            value={digit} 
            height={height || 48} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
