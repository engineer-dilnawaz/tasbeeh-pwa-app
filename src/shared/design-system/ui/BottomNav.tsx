import React, {
  useRef,
  useMemo,
  useLayoutEffect,
  useCallback,
  type CSSProperties,
} from "react";
import { motion, useMotionValue, animate, useReducedMotion } from "framer-motion";
import { Squircle } from "./Squircle";

// ─────────────────────────────────────────────────────────────────────────────
// Shared types
// ─────────────────────────────────────────────────────────────────────────────

export interface TabItem {
  id: string;
  icon: React.ReactNode;
  /** Alternate icon shown when this tab is active (e.g. filled vs outline) */
  activeIcon?: React.ReactNode;
  label?: string;
  badge?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// BottomNav props
// ─────────────────────────────────────────────────────────────────────────────

interface BottomNavProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  /**
   * "bar"        — full-width frosted bar with animated pill highlight (default)
   * "glass-dock" — floating squircle glass dock with morphing dot→line indicator
   */
  variant?: "bar" | "glass-dock";
  /**
   * Optional FAB element rendered in the centre of the bar variant.
   * (Ignored for glass-dock — that variant is icon-only.)
   */
  fab?: React.ReactNode;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const SPRING = { type: "spring", damping: 26, stiffness: 380 } as const;
const DOT = 6; // rest diameter of the morphing indicator (px)
const BAR_SQUIRCLE_RADIUS = 24;

// ─────────────────────────────────────────────────────────────────────────────
// Utility — measure tab-centre positions relative to the track div
// ─────────────────────────────────────────────────────────────────────────────

function measureCenters(
  track: HTMLElement,
  slots: readonly (HTMLElement | null)[],
): number[] {
  const tr = track.getBoundingClientRect();
  return slots.map((el) => {
    if (!el) return NaN;
    const r = el.getBoundingClientRect();
    return r.left + r.width / 2 - tr.left;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// BAR variant — full-width frosted bar with layout-animated pill
// ─────────────────────────────────────────────────────────────────────────────

function BarNav({
  tabs,
  activeTab,
  onTabChange,
  fab,
  className = "",
}: Omit<BottomNavProps, "variant">) {
  const hasFab = !!fab;
  const half = hasFab ? Math.floor(tabs.length / 2) : 0;
  const leftTabs  = hasFab ? tabs.slice(0, half) : tabs;
  const rightTabs = hasFab ? tabs.slice(half)    : [];

  const renderTab = (tab: TabItem) => {
    const isActive = tab.id === activeTab;
    return (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className="relative flex-1 flex flex-col items-center justify-center py-2 min-w-0"
        aria-label={tab.label ?? tab.id}
        aria-current={isActive ? "page" : undefined}
      >
        {isActive && (
          <motion.div
            layoutId="bottomnav-bar-indicator"
            transition={SPRING}
            className="absolute inset-x-2 top-1 rounded-xl bg-primary/10"
            style={{ height: "calc(100% - 4px)" }}
          />
        )}

        {tab.badge != null && tab.badge > 0 && (
          <span className="absolute top-1.5 right-1/2 translate-x-3 z-20 min-w-[16px] h-4 px-1 rounded-full bg-error text-white text-[9px] font-bold flex items-center justify-center">
            {tab.badge > 99 ? "99+" : tab.badge}
          </span>
        )}

        <motion.span
          animate={{
            color: isActive ? "var(--color-primary)" : "var(--color-base-content)",
            opacity: isActive ? 1 : 0.45,
            scale:   isActive ? 1.1 : 1,
          }}
          transition={SPRING}
          className="relative z-10 flex items-center justify-center"
        >
          {isActive ? (tab.activeIcon ?? tab.icon) : tab.icon}
        </motion.span>

        {tab.label && (
          <motion.span
            animate={{
              opacity:    isActive ? 1 : 0.45,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "var(--color-primary)" : "var(--color-base-content)",
            }}
            transition={SPRING}
            className="relative z-10 text-[10px] mt-0.5 leading-none tracking-tight"
          >
            {tab.label}
          </motion.span>
        )}
      </button>
    );
  };

  return (
    <nav
      className={[
        "fixed bottom-0 left-1/2 -translate-x-1/2",
        "w-full max-w-[480px]",
        "flex items-stretch",
        "bg-base-100/90 backdrop-blur-xl",
        "border-t border-base-content/[0.07]",
        "h-16",
        className,
      ].filter(Boolean).join(" ")}
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        zIndex: 60,
      }}
    >
      {leftTabs.map(renderTab)}
      {hasFab && (
        <div className="flex-none w-16 flex items-center justify-center relative">
          <div className="absolute -top-5">{fab}</div>
        </div>
      )}
      {rightTabs.map(renderTab)}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GLASS-DOCK variant — floating squircle with morphing dot→line indicator
// ─────────────────────────────────────────────────────────────────────────────

function GlassDockNav({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: Omit<BottomNavProps, "variant" | "fab">) {
  const prefersReducedMotion = useReducedMotion();
  const trackRef   = useRef<HTMLDivElement>(null);
  const slotRefs   = useRef<(HTMLElement | null)[]>(tabs.map(() => null));
  const prevSlotRef    = useRef<number | null>(null);
  const isMorphingRef  = useRef(false);

  const leftMv    = useMotionValue(0);
  const widthMv   = useMotionValue(DOT);
  const opacityMv = useMotionValue(0);

  // Stable callback refs for each slot
  const slotCallbackRefs = useMemo(
    () =>
      tabs.map((_, i) => (el: HTMLElement | null) => {
        slotRefs.current[i] = el;
      }),
    // tabs.length change would need new refs — acceptable tradeoff for gallery use
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tabs.length],
  );

  const runIndicatorAnimation = useCallback(
    async (nextSlot: number | null, centers: number[]) => {
      if (nextSlot === null) {
        await animate(opacityMv, 0, { duration: 0.18, ease: "easeOut" });
        prevSlotRef.current = null;
        return;
      }

      const c1 = centers[nextSlot];
      if (!Number.isFinite(c1)) return;

      void animate(opacityMv, 1, { duration: 0.12, ease: "easeOut" });

      const reduced = !!prefersReducedMotion;
      const prev = prevSlotRef.current;

      if (prev === null || prev === nextSlot || reduced) {
        widthMv.set(DOT);
        await Promise.all([
          animate(leftMv,  c1 - DOT / 2, { duration: reduced ? 0 : 0.2 }),
          animate(widthMv, DOT,           { duration: reduced ? 0 : 0.14 }),
        ]);
        prevSlotRef.current = nextSlot;
        return;
      }

      const c0 = centers[prev];
      if (!Number.isFinite(c0)) {
        widthMv.set(DOT);
        await Promise.all([
          animate(leftMv,  c1 - DOT / 2, { duration: 0.2  }),
          animate(widthMv, DOT,           { duration: 0.14 }),
        ]);
        prevSlotRef.current = nextSlot;
        return;
      }

      isMorphingRef.current = true;
      try {
        if (c1 > c0) {
          // Moving right: expand right edge → slide left edge
          const lineW = c1 - c0 + DOT;
          await Promise.all([
            animate(leftMv,  c0 - DOT / 2, { duration: 0 }),
            animate(widthMv, DOT,           { duration: 0 }),
          ]);
          await animate(widthMv, lineW, { duration: 0.28, ease: [0.33, 0, 0.2, 1] });
          await Promise.all([
            animate(leftMv,  c1 - DOT / 2, { duration: 0.32, ease: [0.34, 1.15, 0.64, 1] }),
            animate(widthMv, DOT,           { duration: 0.32, ease: [0.34, 1.15, 0.64, 1] }),
          ]);
        } else if (c1 < c0) {
          // Moving left: stretch left + expand simultaneously → collapse
          const lineW = c0 - c1 + DOT;
          await Promise.all([
            animate(leftMv,  c0 - DOT / 2, { duration: 0 }),
            animate(widthMv, DOT,           { duration: 0 }),
          ]);
          await Promise.all([
            animate(widthMv, lineW,         { duration: 0.28, ease: [0.33, 0, 0.2, 1] }),
            animate(leftMv,  c1 - DOT / 2, { duration: 0.28, ease: [0.33, 0, 0.2, 1] }),
          ]);
          await animate(widthMv, DOT, { duration: 0.32, ease: [0.34, 1.15, 0.64, 1] });
        } else {
          widthMv.set(DOT);
          await animate(leftMv, c1 - DOT / 2, { duration: 0.16 });
        }
        prevSlotRef.current = nextSlot;
      } finally {
        isMorphingRef.current = false;
      }
    },
    [leftMv, widthMv, opacityMv, prefersReducedMotion],
  );

  const measureAndSync = useCallback(() => {
    if (isMorphingRef.current) return;
    const track = trackRef.current;
    if (!track) return;
    const centers = measureCenters(track, slotRefs.current);
    if (centers.some((x) => !Number.isFinite(x))) return;

    const slot = tabs.findIndex((t) => t.id === activeTab);
    const nextSlot = slot === -1 ? null : slot;

    if (nextSlot === null) {
      void animate(opacityMv, 0, { duration: 0.1 });
      prevSlotRef.current = null;
      return;
    }

    void animate(opacityMv, 1, { duration: 0.1 });
    leftMv.set(centers[nextSlot] - DOT / 2);
    widthMv.set(DOT);
    prevSlotRef.current = nextSlot;
  }, [activeTab, tabs, leftMv, widthMv, opacityMv]);

  // Animate indicator when active tab changes
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const centers = measureCenters(track, slotRefs.current);
    if (centers.some((x) => !Number.isFinite(x))) return;
    const nextSlot = tabs.findIndex((t) => t.id === activeTab);
    void runIndicatorAnimation(nextSlot === -1 ? null : nextSlot, centers);
  }, [activeTab, tabs, runIndicatorAnimation]);

  // Re-sync on resize
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const ro = new ResizeObserver(() => requestAnimationFrame(() => measureAndSync()));
    ro.observe(track);
    return () => ro.disconnect();
  }, [measureAndSync]);

  return (
    <nav
      aria-label="Main navigation"
      className={["fixed bottom-0 left-0 right-0 z-60 flex flex-col justify-end items-stretch pointer-events-none", className].join(" ")}
      style={{
        padding: `0 max(12px, env(safe-area-inset-left, 0px)) max(14px, env(safe-area-inset-bottom, 12px)) max(12px, env(safe-area-inset-right, 0px))`,
      }}
    >
      <div className="relative w-full pointer-events-none">
        {/* Bottom scrim — gradient that dims content behind the dock */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: 0,
            bottom: "calc(-1 * max(14px, env(safe-area-inset-bottom, 12px)))",
            left:  "calc(-1 * max(12px, env(safe-area-inset-left, 0px)))",
            right: "calc(-1 * max(12px, env(safe-area-inset-right, 0px)))",
            zIndex: 0,
            background: `linear-gradient(to bottom,
              transparent 0px,
              color-mix(in oklab, black 18%, transparent) 52px,
              color-mix(in oklab, black 36%, transparent) 100%
            )`,
          }}
        />

        {/* Glow outer wrapper — box-shadow here since squircle clip-path eats shadows */}
        <div
          className="relative z-10 w-full pointer-events-auto"
          style={{
            borderRadius: BAR_SQUIRCLE_RADIUS,
            boxShadow: `
              0 -8px 40px -16px color-mix(in oklab, var(--color-base-content) 28%, transparent),
              0 16px 48px -20px color-mix(in oklab, var(--color-primary) 22%, transparent)
            `,
          } as CSSProperties}
        >
          <Squircle
            cornerRadius={BAR_SQUIRCLE_RADIUS}
            cornerSmoothing={1}
            style={{
              width: "100%",
              position: "relative",
              overflow: "visible",
              padding: "14px 16px 14px",
              boxSizing: "border-box",
              background: "color-mix(in oklab, var(--color-base-100) 82%, white 18%)",
              backdropFilter: "blur(24px) saturate(1.25)",
              WebkitBackdropFilter: "blur(24px) saturate(1.25)",
              border: "1px solid color-mix(in oklab, var(--color-base-content) 10%, white 8%)",
            } as CSSProperties}
          >
            <div className="flex flex-col items-stretch gap-0.5 w-full">
              {/* Tab buttons row */}
              <div className="relative z-10 flex w-full items-center justify-between gap-1">
                {tabs.map((tab, i) => {
                  const isActive = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      ref={slotCallbackRefs[i] as React.RefCallback<HTMLButtonElement>}
                      onClick={() => onTabChange(tab.id)}
                      aria-label={tab.label ?? tab.id}
                      aria-current={isActive ? "page" : undefined}
                      className="flex-1 flex items-center justify-center min-h-[44px] py-2.5 px-0.5 border-none bg-transparent cursor-pointer rounded-xl"
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 pointer-events-none transition-colors duration-300"
                        style={{
                          color: isActive
                            ? "var(--color-primary)"
                            : "color-mix(in oklab, var(--color-base-content) 46%, transparent)",
                        }}
                      >
                        {isActive ? (tab.activeIcon ?? tab.icon) : tab.icon}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Indicator track */}
              <div
                ref={trackRef}
                className="relative w-full pointer-events-none"
                style={{ height: 8, marginTop: -1 }}
              >
                <motion.div
                  style={{
                    position: "absolute",
                    top: 1,
                    height: DOT,
                    borderRadius: 9999,
                    background: "var(--color-primary)",
                    boxShadow: `0 0 14px color-mix(in oklab, var(--color-primary) 55%, transparent)`,
                    willChange: "left, width, opacity",
                    left:    leftMv,
                    width:   widthMv,
                    opacity: opacityMv,
                  }}
                />
              </div>
            </div>
          </Squircle>
        </div>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Public component — delegates to the right variant
// ─────────────────────────────────────────────────────────────────────────────

export const BottomNav: React.FC<BottomNavProps> = ({
  variant = "bar",
  ...props
}) => {
  if (variant === "glass-dock") {
    const { fab: _fab, ...rest } = props;
    return <GlassDockNav {...rest} />;
  }
  return <BarNav {...props} />;
};
