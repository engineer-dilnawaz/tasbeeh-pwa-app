import { useState, type ComponentType, type CSSProperties } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Home, BookHeart, BarChart3, Settings, Plus } from "lucide-react";
import { Sheet } from "react-modal-sheet";
import { DualModeLayout, Section } from "../DesignLab";
import type { PurpleTheme } from "../theme/purple";
import { Squircle as CornerSquircle } from "corner-smoothing";
import { AnimatedDhikrCount } from "@/shared/components/AnimatedDhikrCount";
import { formatDhikrCount } from "@/shared/utils/formatDhikrCount";

const Squircle = CornerSquircle as unknown as ComponentType<
  Record<string, unknown>
>;

// ─── Counter Pattern ────────────────────────────────────

function CounterPattern({ theme }: { theme: PurpleTheme }) {
  const prefersReduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const target = 33;
  const progress = Math.min(count / target, 1);
  const circumference = 2 * Math.PI * 68;
  const isComplete = count >= target;

  const handleTap = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isComplete) {
      setCount(0);
      return;
    }
    setCount((c) => c + 1);
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [
      ...r,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 600);
    if ("vibrate" in navigator) navigator.vibrate(10);
  };

  return (
    <Squircle
      cornerRadius={32}
      cornerSmoothing={1}
      style={{
        background: theme.surface,
        boxShadow: `0 0 0 1px ${theme.border}`,
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        width: "100%",
      }}
    >
      <div
        style={{
          fontSize: "17px",
          fontFamily: "'Amiri', serif",
          color: theme.arabic,
          direction: "rtl",
        }}
      >
        سُبْحَانَ اللّٰهِ
      </div>
      <div
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: theme.textSecondary,
        }}
      >
        SubhanAllah
      </div>

      <button
        onClick={handleTap}
        style={{
          position: "relative",
          width: "190px",
          height: "190px",
          borderRadius: "50%",
          background: theme.surfaceRaised,
          border: `1px solid ${theme.border}`,
          cursor: "pointer",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          outline: "none",
        }}
      >
        {/* Progress ring */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotate(-90deg)",
          }}
          width="190"
          height="190"
        >
          <circle
            cx="95"
            cy="95"
            r="68"
            fill="none"
            stroke={theme.accentSubtle}
            strokeWidth="8"
          />
          <circle
            cx="95"
            cy="95"
            r="68"
            fill="none"
            stroke={isComplete ? theme.success : theme.accent}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.3s ease, stroke 0.4s ease",
            }}
          />
        </svg>

        {/* Ripples */}
        <AnimatePresence>
          {ripples.map((rp) => (
            <motion.div
              key={rp.id}
              initial={{
                width: 0,
                height: 0,
                opacity: 0.35,
                x: rp.x,
                y: rp.y,
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={{ width: 250, height: 250, opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              style={{
                position: "absolute",
                borderRadius: "50%",
                background: isComplete ? theme.success : theme.accent,
                pointerEvents: "none",
              }}
            />
          ))}
        </AnimatePresence>

        <div style={{ textAlign: "center", zIndex: 1 }}>
          <AnimatedDhikrCount
            value={count}
            minIntegerDigits={2}
            prefersReducedMotion={Boolean(prefersReduced)}
            style={{
              fontSize: "60px",
              fontWeight: 900,
              color: isComplete ? theme.success : theme.textPrimary,
              lineHeight: 1,
              display: "block",
            }}
          />
          <div
            style={{
              fontSize: "13px",
              color: theme.textMuted,
              marginTop: "4px",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            / {formatDhikrCount(target, { minIntegerDigits: 1 })}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              fontSize: "32px",
              fontFamily: "'Amiri', serif",
              color: theme.arabic,
              textAlign: "center",
            }}
          >
            الْحَمْدُ لِلّٰهِ
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          fontSize: "12px",
          color: theme.textMuted,
          textAlign: "center",
        }}
      >
        {isComplete
          ? "Tap to reset"
          : `${formatDhikrCount(target - count, { minIntegerDigits: 1 })} remaining`}
      </div>
    </Squircle>
  );
}

// ─── Animated dhikr counter (core) ──────────────────────

function AnimatedDhikrCounterCorePattern({ theme }: { theme: PurpleTheme }) {
  const prefersReduced = useReducedMotion();
  const [n, setN] = useState(9);

  const bump = (d: number) =>
    setN((v) => Math.max(0, Math.min(999_999, v + d)));

  const chip = (label: string, delta: number) => (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={() => bump(delta)}
      style={{
        padding: "10px 14px",
        borderRadius: 12,
        border: `1px solid ${theme.border}`,
        background: theme.surfaceRaised,
        color: theme.textPrimary,
        fontWeight: 700,
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {label}
    </motion.button>
  );

  return (
    <Squircle
      cornerRadius={28}
      cornerSmoothing={1}
      style={{
        background: theme.surface,
        boxShadow: `0 0 0 1px ${theme.border}`,
        padding: "28px",
        width: "100%",
        maxWidth: 400,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        alignItems: "stretch",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: theme.textMuted,
            marginBottom: 8,
          }}
        >
          Core component
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: theme.textSecondary,
            lineHeight: 1.5,
          }}
        >
          Spring-interpolated count with{" "}
          <code style={{ fontSize: 12 }}>en-US</code> grouping (10,000) and
          minimum width for small values (09). Uses{" "}
          <code style={{ fontSize: 12 }}>tabular-nums</code> to avoid jitter.
        </p>
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "24px 12px",
          background: theme.surfaceRaised,
          borderRadius: 20,
          border: `1px solid ${theme.border}`,
        }}
      >
        <AnimatedDhikrCount
          value={n}
          minIntegerDigits={2}
          prefersReducedMotion={Boolean(prefersReduced)}
          style={{
            fontSize: "clamp(44px, 12vw, 64px)",
            fontWeight: 900,
            color: theme.textPrimary,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        />
        <div
          style={{
            marginTop: 10,
            fontSize: 12,
            color: theme.textMuted,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          Raw: {n} → formatted: {formatDhikrCount(n, { minIntegerDigits: 2 })}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "center",
        }}
      >
        {chip("−100", -100)}
        {chip("−10", -10)}
        {chip("−1", -1)}
        {chip("+1", 1)}
        {chip("+10", 10)}
        {chip("+1,000", 1000)}
        {chip("10,000", 10_000 - n)}
        {chip("Reset", -n)}
      </div>
    </Squircle>
  );
}

// ─── Name Card Pattern ──────────────────────────────────

const sampleNames = [
  {
    n: 1,
    ar: "الرَّحْمٰنُ",
    tr: "Ar-Rahman",
    en: "The Most Gracious",
    meaning: "He who extends mercy to all creation without exception",
  },
  {
    n: 2,
    ar: "الرَّحِيمُ",
    tr: "Ar-Raheem",
    en: "The Most Merciful",
    meaning: "He whose mercy is specific and eternal for the believers",
  },
  {
    n: 3,
    ar: "الْمَلِكُ",
    tr: "Al-Malik",
    en: "The King",
    meaning: "He who is sovereign over all existence",
  },
];

function NameCardPattern({ theme }: { theme: PurpleTheme }) {
  const [idx, setIdx] = useState(0);
  const [fav, setFav] = useState<number[]>([]);
  const name = sampleNames[idx];
  const isFav = fav.includes(name.n);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          style={{ width: "100%" }}
        >
          <Squircle
            cornerRadius={32}
            cornerSmoothing={1}
            style={{
              background: theme.surface,
              boxShadow: `0 0 0 1px ${theme.border}`,
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Squircle
                cornerRadius={12}
                cornerSmoothing={1}
                style={{
                  width: "40px",
                  height: "40px",
                  background: theme.accentSubtle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "15px",
                  fontWeight: 900,
                  color: theme.accent,
                }}
              >
                {name.n}
              </Squircle>
              <motion.button
                whileTap={{ scale: 1.3 }}
                onClick={() =>
                  setFav((f) =>
                    isFav ? f.filter((x) => x !== name.n) : [...f, name.n],
                  )
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={isFav ? "#ff453a" : "none"}
                  stroke={isFav ? "#ff453a" : theme.textMuted}
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </motion.button>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "64px",
                  lineHeight: 1.2,
                  fontFamily: "'Amiri', serif",
                  color: theme.arabic,
                  direction: "rtl",
                  marginBottom: "12px",
                }}
              >
                {name.ar}
              </div>
              <div
                style={{
                  fontSize: "19px",
                  fontWeight: 800,
                  color: theme.textPrimary,
                }}
              >
                {name.tr}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: theme.textSecondary,
                  marginTop: "4px",
                }}
              >
                {name.en}
              </div>
            </div>

            <div
              style={{
                fontSize: "13px",
                color: theme.textMuted,
                fontStyle: "italic",
                textAlign: "center",
                lineHeight: "1.6",
              }}
            >
              "{name.meaning}"
            </div>
          </Squircle>
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      <div style={{ display: "flex", gap: "10px" }}>
        <motion.div
          whileTap={{ scale: 0.95 }}
          style={{
            flex: 1,
            cursor: idx === 0 ? "not-allowed" : "pointer",
            opacity: idx === 0 ? 0.4 : 1,
          }}
        >
          <Squircle
            as="button"
            cornerRadius={16}
            cornerSmoothing={1}
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
            style={{
              width: "100%",
              padding: "12px",
              background: theme.surface,
              boxShadow: `0 0 0 1px ${theme.border}`,
              color: theme.textPrimary,
              fontWeight: 700,
              fontSize: "14px",
              border: "none",
              fontFamily: "inherit",
            }}
          >
            ← Prev
          </Squircle>
        </motion.div>
        <motion.div
          whileTap={{ scale: 0.95 }}
          style={{
            flex: 1,
            cursor: idx === sampleNames.length - 1 ? "not-allowed" : "pointer",
            opacity: idx === sampleNames.length - 1 ? 0.4 : 1,
          }}
        >
          <Squircle
            as="button"
            cornerRadius={16}
            cornerSmoothing={1}
            onClick={() =>
              setIdx((i) => Math.min(sampleNames.length - 1, i + 1))
            }
            disabled={idx === sampleNames.length - 1}
            style={{
              width: "100%",
              padding: "12px",
              background: theme.accent,
              border: "none",
              color: theme.textOnAccent,
              fontWeight: 700,
              fontSize: "14px",
              fontFamily: "inherit",
            }}
          >
            Next →
          </Squircle>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Bottom Nav Pattern (CDD — Design Lab only) ────────────────────
/**
 * Component-driven draft for the mobile tab shell. Iterate here first; when the
 * pattern is signed off, port to `app/layout/BottomNav.tsx` by swapping `PurpleTheme`
 * fields for `var(--*)` tokens and `button`/`setActive` for `NavLink` + `useLocation`.
 *
 * Plug-and-play shape: pass `theme` + optionally lift `items` / handlers as props later.
 */
type BottomNavPatternItem =
  | { id: string; icon: typeof Home; label: string }
  | { id: string; isAction: true };

const BOTTOM_NAV_PATTERN_SPRING = {
  stiffness: 480,
  damping: 34,
  mass: 0.48,
} as const;

function BottomNavPattern({ theme }: { theme: PurpleTheme }) {
  const [active, setActive] = useState("home");
  const prefersReduced = useReducedMotion();

  const transition = prefersReduced
    ? { type: "tween" as const, duration: 0.16, ease: "easeOut" as const }
    : {
        type: "spring" as const,
        ...BOTTOM_NAV_PATTERN_SPRING,
      };

  const items: BottomNavPatternItem[] = [
    { id: "home", icon: Home, label: "Home" },
    { id: "names", icon: BookHeart, label: "Names" },
    { id: "action", isAction: true },
    { id: "stats", icon: BarChart3, label: "Stats" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const dockGlass: CSSProperties = {
    position: "relative",
    zIndex: 0,
    width: "100%",
    minHeight: 72,
    padding: "14px 6px 12px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    borderRadius: 24,
    border: `1px solid ${theme.border}`,
    background: theme.surfaceOverlay,
    backdropFilter: "blur(20px) saturate(1.35)",
    WebkitBackdropFilter: "blur(20px) saturate(1.35)",
    boxShadow:
      theme.mode === "dark"
        ? "0 10px 32px rgba(0,0,0,0.38)"
        : "0 8px 28px rgba(0,0,0,0.1)",
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: 132,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        padding: "8px 8px 20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ position: "relative", width: "min(100%, 392px)" }}>
        {/* Primary action — in app: NavLink to /add.
            Center with calc(), not transform — Framer would overwrite translate(-50%) on the same node. */}
        <button
          type="button"
          aria-label="Add"
          style={{
            position: "absolute",
            left: "calc(50% - 29px)",
            top: -28,
            zIndex: 4,
            width: 58,
            height: 58,
            border: "none",
            padding: 0,
            margin: 0,
            background: "none",
            cursor: "pointer",
            filter: `drop-shadow(0 12px 26px ${theme.accent}45)`,
          }}
        >
          <motion.div
            whileHover={prefersReduced ? undefined : { y: -4 }}
            whileTap={{ scale: 0.88, y: 2 }}
            transition={transition}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Squircle
              cornerRadius={30}
              cornerSmoothing={1}
              style={{
                width: 58,
                height: 58,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(155deg, ${theme.accent}, ${theme.accentHover})`,
                color: theme.textOnAccent,
                boxShadow: `
                  inset 0 2px 4px rgba(255,255,255,0.22),
                  inset 0 -2px 6px rgba(0,0,0,0.18),
                  0 0 0 4px ${theme.surfaceOverlay}
                `,
              }}
            >
              <Plus size={28} strokeWidth={2.75} />
            </Squircle>
          </motion.div>
        </button>

        <div style={dockGlass}>
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {items.map((item) => {
              if (!("icon" in item)) {
                return (
                  <div
                    key={item.id}
                    style={{
                      width: 56,
                      minWidth: 56,
                      flexShrink: 0,
                      pointerEvents: "none",
                    }}
                    aria-hidden
                  />
                );
              }

              const isActive = active === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item.id)}
                  style={{
                    position: "relative",
                    flex: 1,
                    minWidth: 0,
                    minHeight: 56,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: "6px 2px",
                    borderRadius: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  {isActive ? (
                    <motion.div
                      layoutId="patternBottomNavPill"
                      transition={transition}
                      style={{
                        position: "absolute",
                        inset: "0 2px",
                        pointerEvents: "none",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          minHeight: 52,
                          borderRadius: 20,
                          background: theme.accentSubtle,
                          boxShadow: `0 6px 18px -6px ${theme.accent}40`,
                        }}
                      />
                    </motion.div>
                  ) : null}

                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <motion.div
                      animate={{
                        y: isActive ? -2 : 0,
                        scale: isActive ? 1.1 : 1,
                      }}
                      transition={transition}
                      style={{
                        color: isActive ? theme.accent : theme.textSecondary,
                      }}
                    >
                      <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                    </motion.div>
                    <motion.span
                      animate={{
                        opacity: isActive ? 1 : 0.48,
                        scale: isActive ? 1 : 0.88,
                      }}
                      transition={transition}
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: isActive ? theme.accent : theme.textSecondary,
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.label}
                    </motion.span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Bottom sheet pattern (`react-modal-sheet` + corner-smoothing) ─────────
/**
 * Uses [react-modal-sheet](https://www.npmjs.com/package/react-modal-sheet) (Motion).
 * Horizontal inset on `Sheet.Container` so top squircle arcs aren’t clipped by the viewport.
 */
const SHEET_SIDE_INSET = 14;
const SHEET_TOP_SQUIRCLE = 28;

function BottomSheetPattern({ theme }: { theme: PurpleTheme }) {
  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(true)}
        style={{
          width: "100%",
          padding: "14px 18px",
          borderRadius: 16,
          border: `1px solid ${theme.border}`,
          background: theme.surface,
          color: theme.textPrimary,
          fontWeight: 800,
          fontSize: 15,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Open bottom sheet
      </motion.button>

      <p
        style={{
          margin: "12px 0 0",
          fontSize: 12,
          color: theme.textMuted,
          lineHeight: 1.5,
        }}
      >
        <code style={{ fontSize: 11 }}>react-modal-sheet</code> + Motion. Side
        inset ({SHEET_SIDE_INSET}px) keeps the smoothed top corners fully
        visible. Tap the scrim or drag the handle to dismiss.
      </p>

      <Sheet
        isOpen={open}
        onClose={() => setOpen(false)}
        detent="content"
        prefersReducedMotion={Boolean(prefersReduced)}
      >
        <Sheet.Container
          unstyled
          style={{
            left: SHEET_SIDE_INSET,
            right: SHEET_SIDE_INSET,
            width: "auto",
            bottom: 0,
            paddingBottom: "max(10px, env(safe-area-inset-bottom, 0px))",
            display: "flex",
            flexDirection: "column",
            maxHeight: "min(88dvh, 620px)",
            boxShadow:
              theme.mode === "dark"
                ? "0 -8px 40px rgba(0,0,0,0.4)"
                : "0 -8px 32px rgba(0,0,0,0.1)",
          }}
        >
          {/*
            Header must stay a direct child of Container (not inside Squircle):
            corner-smoothing uses clip-path on Squircle, which breaks sheet drag hit-testing.
            Drag handle uses default layout (centered indicator). Top radii: CSS; body: squircle bottom.
          */}
          <Sheet.Header
            style={{
              width: "100%",
              flexShrink: 0,
              background: theme.surfaceOverlay,
              backdropFilter: "blur(24px) saturate(1.35)",
              WebkitBackdropFilter: "blur(24px) saturate(1.35)",
              borderTop: `1px solid ${theme.border}`,
              borderLeft: `1px solid ${theme.border}`,
              borderRight: `1px solid ${theme.border}`,
              borderTopLeftRadius: SHEET_TOP_SQUIRCLE + 4,
              borderTopRightRadius: SHEET_TOP_SQUIRCLE + 4,
            }}
          />
          <Squircle
            topLeftCornerRadius={0}
            topRightCornerRadius={0}
            bottomLeftCornerRadius={14}
            bottomRightCornerRadius={14}
            cornerSmoothing={1}
            style={{
              flex: 1,
              minHeight: 180,
              width: "100%",
              minWidth: 0,
              boxSizing: "border-box",
              background: theme.surfaceOverlay,
              backdropFilter: "blur(24px) saturate(1.35)",
              WebkitBackdropFilter: "blur(24px) saturate(1.35)",
              borderLeft: `1px solid ${theme.border}`,
              borderRight: `1px solid ${theme.border}`,
              borderBottom: `1px solid ${theme.border}`,
              borderTop: `1px solid ${theme.border}`,
              marginTop: -1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Sheet.Content
              disableDrag
              style={{
                padding: "8px 20px 20px",
                flex: 1,
                minHeight: 0,
                background: "transparent",
              }}
            >
              <div
                id="pattern-sheet-title"
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: theme.textPrimary,
                  marginBottom: 16,
                }}
              >
                Quick actions
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {["Resume last dhikr", "Start new session", "Browse names"].map(
                  (label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setOpen(false)}
                      style={{
                        textAlign: "left",
                        padding: "14px 16px",
                        borderRadius: 14,
                        border: `1px solid ${theme.border}`,
                        background: theme.surface,
                        color: theme.textPrimary,
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {label}
                    </button>
                  ),
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  marginTop: 16,
                  width: "100%",
                  padding: "12px",
                  borderRadius: 14,
                  border: "none",
                  background: theme.accentSubtle,
                  color: theme.accent,
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Close
              </button>
            </Sheet.Content>
          </Squircle>
        </Sheet.Container>
        <Sheet.Backdrop
          unstyled
          style={{
            background:
              theme.mode === "dark" ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.28)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
          onTap={() => setOpen(false)}
        />
      </Sheet>
    </div>
  );
}

// ─── Streak Pattern ─────────────────────────────────────

function StreakPattern({ theme }: { theme: PurpleTheme }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const done = [true, true, true, true, false, false, false];
  return (
    <Squircle
      cornerRadius={24}
      cornerSmoothing={1}
      style={{
        background: theme.surface,
        boxShadow: `0 0 0 1px ${theme.border}`,
        padding: "20px",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 800,
              color: theme.textPrimary,
            }}
          >
            Daily Streak
          </div>
          <div style={{ fontSize: "13px", color: theme.textSecondary }}>
            4 days in a row 🔥
          </div>
        </div>
        <Squircle
          cornerRadius={14}
          cornerSmoothing={1}
          style={{
            fontSize: "28px",
            fontWeight: 900,
            color: theme.accent,
            background: theme.accentSubtle,
            padding: "8px 16px",
          }}
        >
          4
        </Squircle>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        {days.map((d, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Squircle
              cornerRadius={10}
              cornerSmoothing={1}
              style={{
                width: "100%",
                aspectRatio: "1",
                background: done[i] ? theme.accent : theme.surfaceRaised,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                color: "#fff",
              }}
            >
              {done[i] ? "✓" : ""}
            </Squircle>
            <span
              style={{
                fontSize: "10px",
                color: theme.textMuted,
                fontWeight: 700,
              }}
            >
              {d}
            </span>
          </div>
        ))}
      </div>
    </Squircle>
  );
}

// ─── Patterns Screen ────────────────────────────────────

export default function PatternsScreen() {
  return (
    <DualModeLayout>
      {(theme) => (
        <div style={{ fontFamily: "'Inter', system-ui", maxWidth: "640px" }}>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 900,
              color: theme.textPrimary,
              margin: "0 0 32px",
            }}
          >
            Patterns
          </h2>
          <Section title="Animated dhikr counter" theme={theme}>
            <AnimatedDhikrCounterCorePattern theme={theme} />
          </Section>
          <Section title="Zikr Counter" theme={theme}>
            <CounterPattern theme={theme} />
          </Section>
          <Section title="Name Card (Asma ul Husna)" theme={theme}>
            <NameCardPattern theme={theme} />
          </Section>
          <Section title="Streak Tracker" theme={theme}>
            <StreakPattern theme={theme} />
          </Section>
          <Section title="Bottom Navigation" theme={theme}>
            <BottomNavPattern theme={theme} />
          </Section>
          <Section title="Bottom sheet" theme={theme}>
            <BottomSheetPattern theme={theme} />
          </Section>
        </div>
      )}
    </DualModeLayout>
  );
}
