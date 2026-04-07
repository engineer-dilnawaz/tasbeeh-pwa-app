import { useResolvedPalette, type UiPalette } from "./palette";
import { SmoothSquircle } from "./SmoothSquircle";

export type UiToastTone = "success" | "error" | "info";

export type UiToastProps = {
  type: UiToastTone;
  message: string;
  palette?: UiPalette;
};

export function UiToast({ type, message, palette: paletteProp }: UiToastProps) {
  const palette = useResolvedPalette(paletteProp);
  const configs = {
    success: { icon: "✓", color: palette.success },
    error: { icon: "✕", color: palette.danger },
    info: { icon: "ℹ", color: palette.accent },
  } as const;
  const { icon, color } = configs[type];

  return (
    <SmoothSquircle
      cornerRadius={18}
      cornerSmoothing={1}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 16px",
        background: palette.surfaceRaised,
        boxShadow: `0 0 0 1px color-mix(in srgb, ${color} 25%, transparent)`,
        width: "100%",
      }}
    >
      <SmoothSquircle
        cornerRadius={8}
        cornerSmoothing={1}
        style={{
          width: "28px",
          height: "28px",
          background: `color-mix(in srgb, ${color} 20%, transparent)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          fontSize: "14px",
          fontWeight: 900,
          flexShrink: 0,
        }}
      >
        {icon}
      </SmoothSquircle>
      <span
        style={{
          fontSize: "14px",
          color: palette.textPrimary,
          fontWeight: 600,
        }}
      >
        {message}
      </span>
    </SmoothSquircle>
  );
}
