import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { dark, light } from "./theme/purple";
import type { PurpleTheme } from "./theme/purple";

// ─── Shared DualMode wrapper used by all sub-screens ────────────────────────

export function DualModeLayout({ children }: { children: (t: PurpleTheme, isDark: boolean) => React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? dark : light;

  return (
    <div style={{ minHeight: "100dvh", background: isDark ? "#030303" : "#e5e5ea", display: "flex", flexDirection: "column" }}>
      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px",
        background: isDark ? "#0d0d0d" : "#ffffff",
        borderBottom: `1px solid ${theme.border}`,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <BackButton isDark={isDark} />
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: isDark ? "#1e1e1e" : "#f2f2f7",
          padding: "6px", borderRadius: "12px",
        }}>
          {["Dark", "Light"].map((label) => (
            <button
              key={label}
              onClick={() => setIsDark(label === "Dark")}
              style={{
                padding: "6px 16px", borderRadius: "8px", border: "none",
                background: (label === "Dark") === isDark ? theme.accent : "transparent",
                color: (label === "Dark") === isDark ? theme.textOnAccent : theme.textSecondary,
                fontWeight: 700, fontSize: "13px", cursor: "pointer",
                transition: "all 0.2s",
              }}
            >{label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "24px 20px 60px" }}>
        {children(theme, isDark)}
      </div>
    </div>
  );
}

function BackButton({ isDark }: { isDark: boolean }) {
  const navigate = useNavigate();
  const theme = isDark ? dark : light;
  return (
    <button
      onClick={() => navigate("/design-lab")}
      style={{
        background: "transparent", border: "none",
        color: theme.accent, fontWeight: 700,
        fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
      }}
    >← Lab</button>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

export function Section({ title, children, theme }: { title: string; children: React.ReactNode; theme: PurpleTheme }) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <div style={{
        fontSize: "11px", fontWeight: 900, letterSpacing: "0.12em",
        textTransform: "uppercase", color: theme.textMuted, marginBottom: "16px",
      }}>{title}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-start" }}>
        {children}
      </div>
    </div>
  );
}

// ─── Design Lab HUB ─────────────────────────────────────────────────────────

const categories = [
  {
    path: "/design-lab/foundations",
    emoji: "🎨",
    label: "Foundations",
    desc: "Colors · Typography · Spacing · Radius",
    color: "#7c6cf0",
  },
  {
    path: "/design-lab/components",
    emoji: "🧩",
    label: "Components",
    desc: "Buttons · Inputs · Cards · Dropdowns · Avatars · Lists",
    color: "#e85eac",
  },
  {
    path: "/design-lab/patterns",
    emoji: "🕌",
    label: "Patterns",
    desc: "Counter · Name Card · Navigation · Streaks",
    color: "#32d74b",
  },
  {
    path: "/design-lab/experiments",
    emoji: "🧪",
    label: "Experiments",
    desc: "Firestore seed · Dev utilities",
    color: "#f59e0b",
  },
];

export default function DesignLab() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100dvh", background: "#080808",
      fontFamily: "'Inter', system-ui, sans-serif",
      color: "#f5f5f7",
    }}>
      {/* Header */}
      <div style={{ padding: "48px 24px 32px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: dark.accentSubtle, borderRadius: "20px",
          padding: "6px 14px", marginBottom: "20px",
        }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: dark.accent }} />
          <span style={{ fontSize: "12px", fontWeight: 700, color: dark.accent, letterSpacing: "0.06em" }}>DEV ONLY</span>
        </div>
        <h1 style={{ fontSize: "36px", fontWeight: 900, margin: "0 0 8px", lineHeight: 1.1 }}>
          Design Lab
        </h1>
        <p style={{ fontSize: "15px", color: dark.textSecondary, margin: 0 }}>
          Purple theme · Light & Dark · Component-driven
        </p>
      </div>

      {/* Palette preview strip */}
      <div style={{ display: "flex", gap: "4px", padding: "0 24px", marginBottom: "40px" }}>
        {[dark.bg, dark.surface, dark.surfaceRaised, dark.accent, dark.textPrimary, dark.textSecondary, dark.textMuted].map((c, i) => (
          <div key={i} style={{
            flex: 1, height: "8px", background: c, borderRadius: "4px",
          }} />
        ))}
      </div>

      {/* Category cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "0 24px 60px" }}>
        {categories.map((cat) => (
          <motion.button
            key={cat.path}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(cat.path)}
            style={{
              background: dark.surface,
              border: `1px solid ${dark.border}`,
              borderRadius: "20px",
              padding: "24px",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              width: "100%",
            }}
          >
            <div style={{
              width: "56px", height: "56px", borderRadius: "16px", flexShrink: 0,
              background: cat.color + "20",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px",
            }}>{cat.emoji}</div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: "18px", fontWeight: 800, color: dark.textPrimary, marginBottom: "4px" }}>
                {cat.label}
              </div>
              <div style={{ fontSize: "13px", color: dark.textSecondary }}>{cat.desc}</div>
            </div>
            <div style={{ color: dark.textMuted, fontSize: "18px" }}>›</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
