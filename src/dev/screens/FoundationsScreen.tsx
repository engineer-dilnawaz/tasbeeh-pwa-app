import { Squircle } from "corner-smoothing";
import { DualModeLayout, Section } from "../DesignLab";
import type { PurpleTheme } from "../theme/purple";
import { dark, light } from "../theme/purple";

// ─── Token Display Atom ──────────────────────────────────────────────────────

function ColorSwatch({ color, label, sub }: { color: string; label: string; sub?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      <div style={{
        width: "56px", height: "56px", borderRadius: "16px",
        background: color,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }} />
      <span style={{ fontSize: "11px", fontWeight: 700, color: "#888", textAlign: "center" }}>{label}</span>
      {sub && <span style={{ fontSize: "9px", color: "#555", textAlign: "center" }}>{sub}</span>}
    </div>
  );
}

function TypeSample({ label, style, theme }: { label: string; style: React.CSSProperties; theme: PurpleTheme }) {
  return (
    <div style={{
      width: "100%", padding: "16px 20px",
      background: theme.surface, borderRadius: "16px",
      border: `1px solid ${theme.border}`,
      display: "flex", alignItems: "baseline", justifyContent: "space-between",
      gap: "16px",
    }}>
      <span style={{ ...style, color: theme.textPrimary, fontFamily: "'Inter', system-ui" }}>
        Aa — {label}
      </span>
      <span style={{ fontSize: "11px", color: theme.textMuted, fontWeight: 600, flexShrink: 0 }}>
        {(style.fontSize as string) || ""} · {(style.fontWeight as string) || "400"}
      </span>
    </div>
  );
}

function RadiusSample({ r, rNum, label, theme }: { r: string; rNum: number; label: string; theme: PurpleTheme }) {
  const sharedStyle: React.CSSProperties = {
    width: "96px",
    height: "80px",
    background: theme.accentSubtle,
    border: `2px solid ${theme.accent}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: 700,
    color: theme.accent,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      {/* Side by side: CSS vs Squircle */}
      <div style={{ display: "flex", gap: "8px" }}>
        {/* Standard CSS */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <div style={{ ...sharedStyle, borderRadius: r }} />
          <span style={{ fontSize: "9px", color: theme.textMuted }}>CSS</span>
        </div>
        {/* Squircle */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <Squircle
            cornerRadius={rNum}
            cornerSmoothing={1}
            style={{
              ...sharedStyle,
              border: "none",
              backgroundColor: theme.accentSubtle,
              // clip-path from corner-smoothing clips content to the squircle shape
              // Use a box-shadow ring instead of border (border gets clipped away)
              boxShadow: `0 0 0 2px ${theme.accent}`,
            }}
          >{""}</Squircle>
          <span style={{ fontSize: "9px", color: theme.accent, fontWeight: 800 }}>Squircle</span>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "12px", fontWeight: 800, color: theme.textPrimary }}>{label}</div>
        <div style={{ fontSize: "10px", color: theme.textMuted, marginTop: "2px" }}>{r}</div>
      </div>
    </div>
  );
}

// ─── Foundations Screen ──────────────────────────────────────────────────────

export default function FoundationsScreen() {
  return (
    <DualModeLayout>
      {(theme, isDark) => (
        <div style={{ fontFamily: "'Inter', system-ui", maxWidth: "640px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 900, color: theme.textPrimary, margin: "0 0 32px" }}>
            Foundations
          </h2>

          {/* ── Colors ── */}
          <Section title="Color Palette" theme={theme}>
            {Object.entries(isDark ? dark : light)
              .filter(([_k, v]) => typeof v === "string" && (v.startsWith("#") || v.startsWith("rgb")))
              .filter(([_k]) => !["mode", "textOnAccent"].includes(_k))
              .map(([key, val]) => (
                <ColorSwatch key={key} color={val as string} label={key} sub={val as string} />
              ))}
          </Section>

          {/* ── Typography ── */}
          <Section title="Typography Scale" theme={theme}>
            {[
              { label: "Display", style: { fontSize: "32px", fontWeight: 900 } },
              { label: "H1", style: { fontSize: "24px", fontWeight: 800 } },
              { label: "H2", style: { fontSize: "20px", fontWeight: 700 } },
              { label: "H3", style: { fontSize: "17px", fontWeight: 700 } },
              { label: "Body", style: { fontSize: "15px", fontWeight: 400 } },
              { label: "Caption", style: { fontSize: "13px", fontWeight: 500 } },
              { label: "Label", style: { fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const } },
            ].map((t) => (
              <TypeSample key={t.label} label={t.label} style={t.style} theme={theme} />
            ))}
          </Section>

          {/* ── Arabic Typography ── */}
          <Section title="Arabic Typography" theme={theme}>
            {[
              { label: "Display Arabic", text: "سُبْحَانَ اللّٰهِ", size: "52px" },
              { label: "Heading Arabic", text: "الرَّحْمٰنُ", size: "38px" },
              { label: "Body Arabic", text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", size: "22px" },
            ].map((s) => (
              <div key={s.label} style={{
                width: "100%", padding: "20px 24px",
                background: theme.surface, borderRadius: "16px",
                border: `1px solid ${theme.border}`,
                textAlign: "center",
              }}>
                <div style={{
                  fontSize: s.size,
                  fontFamily: "'Amiri', serif",
                  color: theme.arabic,
                  direction: "rtl",
                  lineHeight: 1.4,
                  marginBottom: "8px",
                }}>{s.text}</div>
                <div style={{ fontSize: "12px", color: theme.textMuted }}>{s.label} · {s.size}</div>
              </div>
            ))}
          </Section>

          {/* ── Border Radius ── */}
          <Section title="Border Radius" theme={theme}>
            {[
              { r: "4px",    rNum: 4,  label: "XS" },
              { r: "8px",    rNum: 8,  label: "SM" },
              { r: "12px",   rNum: 12, label: "MD" },
              { r: "16px",   rNum: 16, label: "LG" },
              { r: "20px",   rNum: 20, label: "XL" },
              { r: "28px",   rNum: 28, label: "2XL" },
              { r: "9999px", rNum: 80, label: "Full" },
            ].map((item) => (
              <RadiusSample key={item.label} r={item.r} rNum={item.rNum} label={item.label} theme={theme} />
            ))}
          </Section>

          {/* ── Spacing ── */}
          <Section title="Spacing Scale" theme={theme}>
            {[4, 8, 12, 16, 20, 24, 32, 40, 48, 64].map((s) => (
              <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <div style={{
                  width: `${Math.min(s * 2, 80)}px`, height: "8px",
                  background: theme.accent, borderRadius: "4px",
                }} />
                <span style={{ fontSize: "10px", color: theme.textMuted }}>{s}px</span>
              </div>
            ))}
          </Section>
        </div>
      )}
    </DualModeLayout>
  );
}
