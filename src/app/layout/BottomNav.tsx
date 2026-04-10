import {
  ChartLineIcon,
  HouseIcon,
  GearIcon,
  BooksIcon,
} from "@phosphor-icons/react";
import { NavLink, useLocation } from "react-router-dom";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type Ref,
} from "react";
import { useRemoteConfig } from "@/shared/hooks/useRemoteConfig";
import { SmoothSquircle } from "@/shared/components/ui/SmoothSquircle";
import styles from "./BottomNav.module.css";

const ICON_SIZE = 24;
const DOT = 6;
/** Rounded-rectangle dock (not a pill); corner-smoothing uses this as the corner radius */
const BAR_SQUIRCLE_RADIUS = 24;

/** Bottom row order: home, collections, stats, settings */
function slotIndexFromPath(pathname: string): number | null {
  if (pathname === "/home") return 0;
  if (pathname === "/collections") return 1;
  if (pathname === "/stats") return 2;
  if (pathname === "/settings") return 3;
  return null;
}

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

type NavGlyph = typeof HouseIcon;

type TabConfig = {
  toNav: string;
  end?: boolean;
  icon: NavGlyph;
  ariaLabel: string;
};

type BottomNavTabProps = TabConfig & {
  linkRef: Ref<HTMLAnchorElement>;
};

/** Phosphor: `regular` = outline, `fill` = solid — same glyph, calm premium read */
function BottomNavTab({
  toNav,
  end,
  icon: Icon,
  ariaLabel,
  linkRef,
}: BottomNavTabProps) {
  return (
    <NavLink
      ref={linkRef}
      to={toNav}
      end={end}
      className={styles.link}
      aria-label={ariaLabel}
    >
      {({ isActive }) => (
        <span className={styles.iconMount}>
          <Icon
            size={ICON_SIZE}
            width={ICON_SIZE}
            height={ICON_SIZE}
            weight={isActive ? "fill" : "regular"}
            className={isActive ? styles.iconActive : styles.iconIdle}
            aria-hidden
          />
        </span>
      )}
    </NavLink>
  );
}

export function BottomNav() {
  const { t } = useRemoteConfig();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLElement | null)[]>([null, null, null, null]);
  const prevSlotRef = useRef<number | null>(null);
  /** Prevents ResizeObserver sync from resetting prev/position while morph runs. */
  const isMorphingRef = useRef(false);

  const leftMv = useMotionValue(0);
  const widthMv = useMotionValue(DOT);
  const opacityMv = useMotionValue(1);

  const slotLinkRefs = useMemo(
    () =>
      [0, 1, 2, 3].map((i) => (el: HTMLElement | null) => {
        slotRefs.current[i] = el;
      }),
    [],
  );

  const runIndicatorAnimation = useCallback(
    async (nextSlot: number | null, centers: number[]) => {
      const c1 = nextSlot === null ? NaN : centers[nextSlot];
      if (nextSlot === null) {
        await animate(opacityMv, 0, { duration: 0.18, ease: "easeOut" });
        prevSlotRef.current = null;
        return;
      }

      if (!Number.isFinite(c1)) return;

      void animate(opacityMv, 1, { duration: 0.12, ease: "easeOut" });

      const reduced = !!prefersReducedMotion;
      const prev = prevSlotRef.current;

      if (prev === null || prev === nextSlot || reduced) {
        widthMv.set(DOT);
        await Promise.all([
          animate(leftMv, c1 - DOT / 2, { duration: reduced ? 0 : 0.2 }),
          animate(widthMv, DOT, { duration: reduced ? 0 : 0.14 }),
        ]);
        prevSlotRef.current = nextSlot;
        return;
      }

      const c0 = centers[prev];
      if (!Number.isFinite(c0)) {
        widthMv.set(DOT);
        await Promise.all([
          animate(leftMv, c1 - DOT / 2, { duration: 0.2 }),
          animate(widthMv, DOT, { duration: 0.14 }),
        ]);
        prevSlotRef.current = nextSlot;
        return;
      }

      isMorphingRef.current = true;
      try {
        if (c1 > c0) {
          const lineW = c1 - c0 + DOT;
          await Promise.all([
            animate(leftMv, c0 - DOT / 2, { duration: 0 }),
            animate(widthMv, DOT, { duration: 0 }),
          ]);
          await animate(widthMv, lineW, {
            duration: 0.28,
            ease: [0.33, 0, 0.2, 1],
          });
          await Promise.all([
            animate(leftMv, c1 - DOT / 2, {
              duration: 0.32,
              ease: [0.34, 1.15, 0.64, 1],
            }),
            animate(widthMv, DOT, {
              duration: 0.32,
              ease: [0.34, 1.15, 0.64, 1],
            }),
          ]);
        } else if (c1 < c0) {
          const lineW = c0 - c1 + DOT;
          await Promise.all([
            animate(leftMv, c0 - DOT / 2, { duration: 0 }),
            animate(widthMv, DOT, { duration: 0 }),
          ]);
          await Promise.all([
            animate(widthMv, lineW, {
              duration: 0.28,
              ease: [0.33, 0, 0.2, 1],
            }),
            animate(leftMv, c1 - DOT / 2, {
              duration: 0.28,
              ease: [0.33, 0, 0.2, 1],
            }),
          ]);
          await animate(widthMv, DOT, {
            duration: 0.32,
            ease: [0.34, 1.15, 0.64, 1],
          });
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

    const slot = slotIndexFromPath(location.pathname);
    if (slot === null) {
      void animate(opacityMv, 0, { duration: 0.1 });
      prevSlotRef.current = null;
      return;
    }

    void animate(opacityMv, 1, { duration: 0.1 });
    const c = centers[slot];
    leftMv.set(c - DOT / 2);
    widthMv.set(DOT);
    prevSlotRef.current = slot;
  }, [location.pathname, leftMv, widthMv, opacityMv]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const centers = measureCenters(track, slotRefs.current);
    if (centers.some((x) => !Number.isFinite(x))) return;
    const nextSlot = slotIndexFromPath(location.pathname);
    void runIndicatorAnimation(nextSlot, centers);
  }, [location.pathname, runIndicatorAnimation]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => measureAndSync());
    });
    ro.observe(track);
    return () => ro.disconnect();
  }, [measureAndSync]);

  const tabs: TabConfig[] = [
    {
      toNav: "/home",
      end: true,
      icon: HouseIcon,
      ariaLabel: t("nav.home"),
    },
    { toNav: "/collections", icon: BooksIcon, ariaLabel: "Collections" },
    { toNav: "/stats", icon: ChartLineIcon, ariaLabel: t("nav.stats") },
    { toNav: "/settings", icon: GearIcon, ariaLabel: t("nav.settings") },
  ];

  return (
    <nav className={styles.shell} aria-label="Main">
      <div className={styles.dockStack}>
        <div className={styles.bottomScrim} aria-hidden />
        <div
          className={styles.barOuter}
          style={
            {
              "--bn-squircle-r": `${BAR_SQUIRCLE_RADIUS}px`,
            } as CSSProperties
          }
        >
          <SmoothSquircle
            className={styles.bar}
            cornerRadius={BAR_SQUIRCLE_RADIUS}
            cornerSmoothing={1}
          >
            <div className={styles.glassSheen} aria-hidden />
            <div className={styles.rowBlock}>
              <div className={styles.row}>
                <BottomNavTab {...tabs[0]} linkRef={slotLinkRefs[0]} />
                <BottomNavTab {...tabs[1]} linkRef={slotLinkRefs[1]} />
                <BottomNavTab {...tabs[2]} linkRef={slotLinkRefs[2]} />
                <BottomNavTab {...tabs[3]} linkRef={slotLinkRefs[3]} />
              </div>

              <div ref={trackRef} className={styles.track}>
                <motion.div
                  className={styles.indicator}
                  style={{
                    left: leftMv,
                    width: widthMv,
                    opacity: opacityMv,
                  }}
                />
              </div>
            </div>
          </SmoothSquircle>
        </div>
      </div>
    </nav>
  );
}
