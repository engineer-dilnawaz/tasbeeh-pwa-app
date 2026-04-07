import { useResolvedPalette, type UiPalette } from "./palette";
import { SmoothSquircle } from "./SmoothSquircle";

export type UiAvatarProps = {
  size?: number;
  name?: string;
  src?: string;
  badge?: string;
  palette?: UiPalette;
};

export function UiAvatar({
  size = 40,
  name = "DK",
  src,
  badge,
  palette: paletteProp,
}: UiAvatarProps) {
  const palette = useResolvedPalette(paletteProp);
  const initial = name.trim().slice(0, 1).toUpperCase() || "?";

  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <SmoothSquircle
        cornerRadius={size * 0.3}
        cornerSmoothing={1}
        style={{
          width: size,
          height: size,
          background: palette.accentSubtle,
          boxShadow: `0 0 0 1px ${palette.borderStrong}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.36,
          fontWeight: 800,
          color: palette.accent,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {src ? (
          <img
            src={src}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          initial
        )}
      </SmoothSquircle>
      {badge ? (
        <div
          style={{
            position: "absolute",
            bottom: -3,
            right: -3,
            width: 16,
            height: 16,
            background: palette.success,
            borderRadius: "50%",
            border: `2px solid ${palette.bg}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "8px",
          }}
        >
          {badge}
        </div>
      ) : null}
    </div>
  );
}
