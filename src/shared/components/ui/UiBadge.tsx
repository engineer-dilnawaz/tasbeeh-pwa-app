import { useResolvedPalette, type UiPalette } from "./palette";
import { SmoothSquircle } from "./SmoothSquircle";

export type UiBadgeProps = {
  label: string;
  color?: string;
  palette?: UiPalette;
};

export function UiBadge({ label, color, palette: paletteProp }: UiBadgeProps) {
  const palette = useResolvedPalette(paletteProp);
  const c = color ?? palette.accent;
  return (
    <SmoothSquircle
      cornerRadius={99}
      cornerSmoothing={1}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "4px 10px",
        background: `color-mix(in srgb, ${c} 20%, transparent)`,
        color: c,
        fontSize: "12px",
        fontWeight: 700,
      }}
    >
      {label}
    </SmoothSquircle>
  );
}
