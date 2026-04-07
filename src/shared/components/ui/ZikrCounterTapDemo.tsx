import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedDhikrCount } from "@/shared/components/AnimatedDhikrCount";
import { formatDhikrCount } from "@/shared/utils/formatDhikrCount";
import { useResolvedPalette, type UiPalette } from "./palette";
import { SmoothSquircle } from "./SmoothSquircle";

export type ZikrCounterTapDemoProps = {
  palette?: UiPalette;
  /** Default 33 — set for design lab parity. */
  target?: number;
  hint?: string;
};

export function ZikrCounterTapDemo({
  palette: paletteProp,
  target = 33,
  hint = "Tap the circle to increment.",
}: ZikrCounterTapDemoProps) {
  const palette = useResolvedPalette(paletteProp);
  const prefersReduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const complete = count >= target;

  return (
    <SmoothSquircle
      cornerRadius={24}
      cornerSmoothing={1}
      style={{
        width: "100%",
        maxWidth: 320,
        padding: "24px",
        background: palette.surfaceRaised,
        border: `1px solid ${palette.border}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: palette.textMuted,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        {hint}
      </p>
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => setCount((c) => (c >= target ? 0 : c + 1))}
        style={{
          width: 160,
          height: 160,
          borderRadius: "50%",
          border: `1px solid ${palette.border}`,
          background: palette.surface,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          padding: 0,
          fontFamily: "inherit",
          outline: "none",
        }}
      >
        <AnimatedDhikrCount
          value={count}
          minIntegerDigits={2}
          prefersReducedMotion={Boolean(prefersReduced)}
          style={{
            fontSize: 44,
            fontWeight: 900,
            color: complete ? palette.success : palette.textPrimary,
            lineHeight: 1,
          }}
        />
        <span
          style={{
            fontSize: 13,
            color: palette.textMuted,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          / {formatDhikrCount(target, { minIntegerDigits: 1 })}
        </span>
      </motion.button>
      <span style={{ fontSize: 12, color: palette.textSecondary }}>
        {complete
          ? "Tap to reset"
          : `${formatDhikrCount(target - count, { minIntegerDigits: 1 })} remaining`}
      </span>
    </SmoothSquircle>
  );
}
