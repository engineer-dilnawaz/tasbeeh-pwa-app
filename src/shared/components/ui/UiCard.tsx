import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useResolvedPalette, type UiPalette } from "./palette";
import { SmoothSquircle } from "./SmoothSquircle";

export type UiCardProps = {
  children: ReactNode;
  palette?: UiPalette;
  onClick?: () => void;
  elevated?: boolean;
};

export function UiCard({
  children,
  palette: paletteProp,
  onClick,
  elevated,
}: UiCardProps) {
  const palette = useResolvedPalette(paletteProp);
  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      style={{ width: "100%", cursor: onClick ? "pointer" : "default" }}
    >
      <SmoothSquircle
        cornerRadius={24}
        cornerSmoothing={1}
        style={{
          background: elevated ? palette.surfaceRaised : palette.surface,
          boxShadow: `0 0 0 1px ${palette.border}`,
          padding: "20px",
          width: "100%",
        }}
      >
        {children}
      </SmoothSquircle>
    </motion.div>
  );
}
