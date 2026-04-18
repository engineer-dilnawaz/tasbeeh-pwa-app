import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import {
  motion,
  AnimatePresence,
  useDragControls,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
} from "framer-motion";
import { Squircle } from "@/shared/design-system/ui/Squircle";

// e.g. "25%", "50%", "90%", or explicit px like 400
export type SnapPoint = `${number}%` | number | "auto";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Array of snap points — smallest to largest.
   * Strings are % of viewport height: "25%", "50%", "100%"
   * "auto" behaves like "50%" for now.
   * Numbers are explicit px heights: 320, 600
   * Default: ["auto"]
   */
  snapPoints?: SnapPoint[];
  /** Which snap index to start at (0-indexed). Defaults to 0. */
  initialSnap?: number;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  scrollable?: boolean;
  /** Bottom inset in px (default matches Tailwind `bottom-3` = 12px). */
  bottomInsetPx?: number;
  /** Extra content bottom padding in px (safe-area aware). */
  contentPaddingBottomPx?: number;
  /**
   * Presentation mode:
   * - "translate" (default): full-height sheet translated by y.
   * - "height": true bottom-sheet where y controls height.
   *
   * Prefer "height" when the sheet has a pinned footer action (e.g. sticky CTA)
   * or when you notice the bottom content getting clipped/cropped at larger snap points.
   */
  presentation?: "translate" | "height";
  /**
   * Stacking context base z-index.
   * Backdrop uses this value; sheet uses `zIndexBase + 10`.
   * Default matches previous Tailwind z-90/z-100.
   */
  zIndexBase?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const SPRING = {
  type: "spring",
  damping: 28,
  stiffness: 280,
  mass: 0.8,
} as const;
const CLOSE_THRESHOLD_PX = 80;
const VELOCITY_THRESHOLD = 400;

// ─────────────────────────────────────────────────────────────────────────────
// Drawer Component
// ─────────────────────────────────────────────────────────────────────────────

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  snapPoints = ["auto"],
  initialSnap = 0,
  title,
  description,
  children,
  className = "",
  scrollable = true,
  bottomInsetPx = 12,
  contentPaddingBottomPx = 28,
  presentation = "translate",
  zIndexBase = 90,
}) => {
  const [mounted, setMounted] = useState(isOpen);
  const [winH, setWinH] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800,
  );
  const [currentSnapIdx, setCurrentSnapIdx] = useState(initialSnap);
  const [maxDragTop, setMaxDragTop] = useState(0);

  const y = useMotionValue(winH);
  const dragControls = useDragControls();
  const currentSnapIdxRef = useRef(initialSnap);

  const sheetHeight = useTransform(y, (latestY) => {
    const available = winH - bottomInsetPx;
    return Math.max(0, available - latestY);
  });

  // 1. Calculate Y offsets for each snap point
  const snapYOffsetsRef = useRef<number[]>([]);

  useLayoutEffect(() => {
    const updateSnapOffsets = () => {
      const h = window.innerHeight;
      setWinH(h);

      const offsets = snapPoints.map((p) => {
        if (typeof p === "number") return h - p;
        if (p === "auto") return h * 0.5;
        const pct = parseInt(p, 10);
        return h - (h * pct) / 100;
      });

      snapYOffsetsRef.current = offsets;
      setMaxDragTop(offsets[offsets.length - 1] ?? 0);
    };

    updateSnapOffsets();
    window.addEventListener("resize", updateSnapOffsets);
    return () => window.removeEventListener("resize", updateSnapOffsets);
  }, [snapPoints]);

  // 2. Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      // Prevent iOS "bounce" scroll bleed-through
      document.body.style.overscrollBehavior = "none";

      return () => {
        document.body.style.overflow = originalStyle;
        document.body.style.overscrollBehavior = "";
      };
    }
  }, [isOpen]);

  // 3. Sync animation with isOpen state
  useEffect(() => {
    if (isOpen) {
      if (!mounted) {
        requestAnimationFrame(() => setMounted(true));
      }
      const targetY = snapYOffsetsRef.current[currentSnapIdx] || winH * 0.5;
      requestAnimationFrame(() => {
        animate(y, targetY, SPRING);
      });
    } else if (mounted) {
      animate(y, winH, {
        ...SPRING,
        onComplete: () => {
          setMounted(false);
          setCurrentSnapIdx(initialSnap);
          currentSnapIdxRef.current = initialSnap;
        },
      });
    }
  }, [currentSnapIdx, initialSnap, isOpen, mounted, winH, y]);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const currentY = y.get();
      const yOffsets = snapYOffsetsRef.current;
      const lowestSnapY = yOffsets[0];

      if (
        currentY > lowestSnapY + CLOSE_THRESHOLD_PX ||
        (info.velocity.y > VELOCITY_THRESHOLD &&
          currentSnapIdxRef.current === 0)
      ) {
        onClose();
        return;
      }

      const distances = yOffsets.map((offset) => Math.abs(currentY - offset));
      const closestIdx = distances.indexOf(Math.min(...distances));

      let targetIdx = closestIdx;
      if (
        info.velocity.y < -VELOCITY_THRESHOLD &&
        closestIdx < yOffsets.length - 1
      ) {
        targetIdx = closestIdx + 1;
      } else if (info.velocity.y > VELOCITY_THRESHOLD && closestIdx > 0) {
        targetIdx = closestIdx - 1;
      }

      setCurrentSnapIdx(targetIdx);
      currentSnapIdxRef.current = targetIdx;
      animate(y, yOffsets[targetIdx], SPRING);
    },
    [onClose, y],
  );

  const sheetChromeOffset = title || description ? 110 : 52;
  const contentMaxHTranslate = useTransform(y, (latestY) =>
    // Visible height = viewport space minus handle/header chrome.
    // In translate mode the sheet is pinned to `top: 0` and `bottom: bottomInsetPx`,
    // so the available height is `(winH - bottomInsetPx)`.
    Math.max(0, winH - bottomInsetPx - latestY - sheetChromeOffset),
  );

  if (!mounted && !isOpen) return null;

  const sheet = (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
            style={{ zIndex: zIndexBase }}
            aria-hidden="true"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <Squircle cornerRadius={30} cornerSmoothing={0.92} asChild>
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === "string" ? title : "Bottom sheet"}
          drag="y"
          dragControls={dragControls}
          dragListener={false}
          dragConstraints={{
            top: maxDragTop,
          }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          className={`fixed inset-x-3 flex flex-col overflow-hidden bg-base-100 shadow-2xl ${className}`}
          style={{
            ...(presentation === "translate"
              ? { y, top: 0, height: winH - bottomInsetPx }
              : {}),
            ...(presentation === "height" ? { height: sheetHeight } : {}),
            bottom: bottomInsetPx,
            zIndex: zIndexBase + 10,
          }}
        >
          {/* ── Drag handle ─────────────────── */}
          <div
            className="flex flex-col items-center pt-3 pb-4 shrink-0 touch-none select-none cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <motion.div
              className="w-10 h-1.5 rounded-full bg-base-content/10"
              whileTap={{
                backgroundColor:
                  "color-mix(in oklab, var(--color-base-content) 20%, transparent)",
              }}
            />
          </div>

          {/* ── Header ──────────────────────── */}
          {(title || description) && (
            <div className="px-4 pb-3 shrink-0">
              {title && (
                <h2 className="text-lg font-bold text-base-content tracking-tight leading-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-base-content/50 mt-1 leading-normal">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* ── Content Area ────────────────── */}
          <motion.div
            className={`flex-1 px-2 touch-auto transition-colors min-h-0 no-scrollbar ${
              scrollable
                ? "overscroll-contain overflow-y-auto"
                : "overflow-y-hidden"
            }`}
            // Keep buttons clear of rounded bottom + safe-area.
            // `max()` is supported in modern browsers and works well here.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - CSS `max()` typing is too strict for style prop.
            style={{
              ...(presentation === "translate"
                ? { maxHeight: contentMaxHTranslate }
                : {}),
              paddingBottom: `max(${contentPaddingBottomPx}px, env(safe-area-inset-bottom,0px))`,
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      </Squircle>
    </>
  );

  return createPortal(sheet, document.body);
};
