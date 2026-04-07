import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useResolvedPalette, type UiPalette } from "./palette";
import { SmoothSquircle } from "./SmoothSquircle";

export type UiListRowProps = {
  icon?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  palette?: UiPalette;
  onClick?: () => void;
};

export function UiListRow({
  icon,
  title,
  subtitle,
  right,
  palette: paletteProp,
  onClick,
}: UiListRowProps) {
  const palette = useResolvedPalette(paletteProp);
  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      style={{ width: "100%", cursor: onClick ? "pointer" : "default" }}
    >
      <SmoothSquircle
        cornerRadius={18}
        cornerSmoothing={1}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "14px 16px",
          background: palette.surface,
          boxShadow: `0 0 0 1px ${palette.border}`,
          width: "100%",
        }}
      >
        {icon ? (
          <SmoothSquircle
            cornerRadius={10}
            cornerSmoothing={1}
            style={{
              width: "40px",
              height: "40px",
              background: palette.accentSubtle,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              flexShrink: 0,
            }}
          >
            {icon}
          </SmoothSquircle>
        ) : null}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: palette.textPrimary,
              marginBottom: "2px",
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                fontSize: "13px",
                color: palette.textSecondary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
        {right ??
          (onClick ? (
            <span style={{ color: palette.textMuted, fontSize: "18px" }}>›</span>
          ) : null)}
      </SmoothSquircle>
    </motion.div>
  );
}
