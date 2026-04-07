import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useResolvedPalette, type UiPalette } from "./palette";
import { SmoothSquircle } from "./SmoothSquircle";

export type UiSelectProps = {
  options: string[];
  palette?: UiPalette;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export function UiSelect({
  options,
  palette: paletteProp,
  value: controlled,
  defaultValue,
  onValueChange,
}: UiSelectProps) {
  const palette = useResolvedPalette(paletteProp);
  const [open, setOpen] = useState(false);
  const first = options[0] ?? "";
  const [inner, setInner] = useState(defaultValue ?? first);
  const selected = controlled !== undefined ? controlled : inner;

  const pick = (opt: string) => {
    if (controlled === undefined) setInner(opt);
    onValueChange?.(opt);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer", width: "100%" }}
      >
        <SmoothSquircle
          cornerRadius={14}
          cornerSmoothing={1}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            background: palette.surface,
            boxShadow: `0 0 0 1px ${open ? palette.accent : palette.border}`,
          }}
        >
          <span
            style={{
              fontSize: "15px",
              color: palette.textPrimary,
              fontWeight: 600,
            }}
          >
            {selected}
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            style={{ color: palette.textMuted, lineHeight: 1 }}
          >
            ⌄
          </motion.span>
        </SmoothSquircle>
      </motion.div>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              zIndex: 50,
              background: palette.surfaceRaised,
              borderRadius: "16px",
              border: `1px solid ${palette.border}`,
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => pick(opt)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  color: opt === selected ? palette.accent : palette.textPrimary,
                  fontWeight: opt === selected ? 700 : 500,
                  fontSize: "15px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "transparent",
                  border: "none",
                  fontFamily: "inherit",
                }}
              >
                {opt}
                {opt === selected ? (
                  <span style={{ color: palette.accent }}>✓</span>
                ) : null}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
