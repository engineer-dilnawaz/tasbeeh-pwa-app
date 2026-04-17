import React from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

type TooltipPlacement = "top" | "bottom" | "left" | "right";
type TooltipVariant =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";
type TooltipTrigger = "hover" | "manual";

/** Manual-only: `floating` = positioned bubble (default). `daisy` = daisyUI `tooltip` + `tooltip-content` chrome. */
export type TooltipManualLayout = "floating" | "daisy";

interface TooltipProps {
  content: React.ReactNode;
  open?: boolean;
  placement?: TooltipPlacement;
  variant?: TooltipVariant;
  trigger?: TooltipTrigger;
  /** When `trigger="manual"`, choose bubble chrome. Default `floating`. */
  manualLayout?: TooltipManualLayout;
  /**
   * Manual-only: render the bubble in a portal (fixed positioning) so it won't
   * get clipped by parent `overflow: hidden` (e.g. drawers/squircles).
   * Default: true.
   */
  manualPortal?: boolean;
  animate?: boolean;
  /** Only used when `animate` is true. Default: 180ms */
  transitionMs?: number;
  /** Renders content with daisyUI skeleton styles (default: true). */
  useSkeleton?: boolean;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

function ManualTooltip({
  content,
  open,
  placement,
  bubbleVariantClasses,
  transitionMs,
  contentClassName,
  manualPortal,
  className,
  children,
}: {
  content: React.ReactNode;
  open: boolean;
  placement: TooltipPlacement;
  bubbleVariantClasses: string;
  transitionMs: number;
  contentClassName?: string;
  manualPortal: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const anchorRef = React.useRef<HTMLDivElement | null>(null);
  const bubbleRef = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState<{ left: number; top: number } | null>(
    null,
  );

  const updatePosition = React.useCallback(() => {
    if (!manualPortal) return;
    const anchor = anchorRef.current;
    const bubble = bubbleRef.current;
    if (!anchor || !bubble) return;

    const a = anchor.getBoundingClientRect();
    const b = bubble.getBoundingClientRect();
    const gap = 12;
    const pad = 8;

    let left: number;
    let top: number;

    if (placement === "top") {
      left = a.left + a.width / 2 - b.width / 2;
      top = a.top - b.height - gap;
    } else if (placement === "bottom") {
      left = a.left + a.width / 2 - b.width / 2;
      top = a.bottom + gap;
    } else if (placement === "left") {
      left = a.left - b.width - gap;
      top = a.top + a.height / 2 - b.height / 2;
    } else {
      left = a.right + gap;
      top = a.top + a.height / 2 - b.height / 2;
    }

    left = Math.max(pad, Math.min(left, window.innerWidth - b.width - pad));
    top = Math.max(pad, Math.min(top, window.innerHeight - b.height - pad));

    setPos({ left, top });
  }, [manualPortal, placement]);

  React.useLayoutEffect(() => {
    if (!open) return;
    if (!manualPortal) return;
    updatePosition();
  }, [open, manualPortal, updatePosition, content]);

  React.useEffect(() => {
    if (!open) return;
    if (!manualPortal) return;

    const onReflow = () => updatePosition();
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, true);
    return () => {
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow, true);
    };
  }, [open, manualPortal, updatePosition]);

  const bubble = (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="manual-tooltip-bubble"
          ref={bubbleRef}
          initial={{
            opacity: 0,
            x: placement === "left" ? -10 : placement === "right" ? 10 : 0,
            y: placement === "top" ? -10 : placement === "bottom" ? 10 : 0,
          }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{
            opacity: 0,
            x: placement === "left" ? -10 : placement === "right" ? 10 : 0,
            y: placement === "top" ? -10 : placement === "bottom" ? 10 : 0,
          }}
          transition={{ duration: transitionMs / 1000, ease: "easeOut" }}
          className={clsx(
            manualPortal ? "fixed z-[9999] select-none" : "absolute z-[9999] select-none",
            !manualPortal &&
              (placement === "left"
                ? "right-full top-1/2 -translate-y-1/2 mr-3"
                : placement === "right"
                  ? "left-full top-1/2 -translate-y-1/2 ml-3"
                  : placement === "top"
                    ? "bottom-full left-1/2 -translate-x-1/2 mb-3"
                    : "top-full left-1/2 -translate-x-1/2 mt-3"),
          )}
          style={manualPortal && pos ? { left: pos.left, top: pos.top } : undefined}
        >
          <div
            className={clsx(
              "relative",
              "max-w-[260px] whitespace-normal text-center leading-snug",
              "px-3 py-2 text-[12px] font-medium",
              "rounded-xl",
              bubbleVariantClasses,
              contentClassName,
            )}
          >
            {content}
            <span
              aria-hidden="true"
              className={clsx(
                "absolute h-2.5 w-2.5 rotate-45",
                "rounded-[2px]",
                bubbleVariantClasses,
                placement === "left"
                  ? "right-[-5px] top-1/2 -translate-y-1/2"
                  : placement === "right"
                    ? "left-[-5px] top-1/2 -translate-y-1/2"
                    : placement === "top"
                      ? "bottom-[-5px] left-1/2 -translate-x-1/2"
                      : "top-[-5px] left-1/2 -translate-x-1/2",
              )}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <div
      ref={anchorRef}
      className={clsx(manualPortal ? "inline-flex pointer-events-auto" : "relative inline-flex pointer-events-auto", className)}
    >
      {manualPortal ? createPortal(bubble, document.body) : bubble}
      {children}
    </div>
  );
}

export function Tooltip({
  content,
  open,
  placement = "top",
  variant = "neutral",
  trigger = "hover",
  manualLayout = "floating",
  manualPortal = true,
  transitionMs = 180,
  useSkeleton = true,
  className,
  contentClassName,
  children,
}: TooltipProps) {
  const isOpen = Boolean(open);
  const bubbleVariantClasses = getBubbleVariantClasses(variant);
  const renderedContent = React.useMemo(
    () =>
      useSkeleton ? (
        <span className="skeleton skeleton-text">{content}</span>
      ) : (
        <span>{content}</span>
      ),
    [content, useSkeleton],
  );

  if (trigger === "manual" && manualLayout === "daisy") {
    return (
      <div
        className={clsx(
          "tooltip",
          isOpen ? "tooltip-open" : null,
          placement === "top"
            ? "tooltip-top"
            : placement === "bottom"
              ? "tooltip-bottom"
              : placement === "left"
                ? "tooltip-left"
                : "tooltip-right",
          variant === "neutral"
            ? "tooltip-neutral"
            : variant === "primary"
              ? "tooltip-primary"
              : variant === "secondary"
                ? "tooltip-secondary"
                : variant === "accent"
                  ? "tooltip-accent"
                  : variant === "info"
                    ? "tooltip-info"
                    : variant === "success"
                      ? "tooltip-success"
                      : variant === "warning"
                        ? "tooltip-warning"
                        : "tooltip-error",
          className,
        )}
      >
        <div className={clsx("tooltip-content", contentClassName)}>
          {useSkeleton ? (
            <span className="skeleton skeleton-text">{content}</span>
          ) : (
            content
          )}
        </div>
        {children}
      </div>
    );
  }

  // Manual mode renders a single bubble+tail block (so tail never disconnects).
  if (trigger === "manual") {
    return (
      <ManualTooltip
        content={renderedContent}
        open={isOpen}
        placement={placement}
        bubbleVariantClasses={bubbleVariantClasses}
        transitionMs={transitionMs}
        contentClassName={contentClassName}
        manualPortal={manualPortal}
        className={className}
      >
        {children}
      </ManualTooltip>
    );
  }

  return (
    <div
      className={clsx(
        "tooltip",
        "pointer-events-auto",
        isOpen ? "tooltip-open" : null,
        placement === "top"
          ? "tooltip-top"
          : placement === "bottom"
            ? "tooltip-bottom"
            : placement === "left"
              ? "tooltip-left"
              : "tooltip-right",
        variant === "neutral"
          ? "tooltip-neutral"
          : variant === "primary"
            ? "tooltip-primary"
            : variant === "secondary"
              ? "tooltip-secondary"
              : variant === "accent"
                ? "tooltip-accent"
                : variant === "info"
                  ? "tooltip-info"
                  : variant === "success"
                    ? "tooltip-success"
                    : variant === "warning"
                      ? "tooltip-warning"
                      : "tooltip-error",
        className,
      )}
    >
      <div
        className={clsx(
          "tooltip-content",
          "max-w-[260px] whitespace-normal text-center leading-snug",
          "px-3 py-2 text-[12px] font-medium",
          contentClassName,
        )}
      >
        {renderedContent}
      </div>
      {children}
    </div>
  );
}

function getBubbleVariantClasses(variant: TooltipVariant) {
  // Use daisy semantic tokens so all themes work.
  if (variant === "primary") return "bg-primary text-primary-content";
  if (variant === "secondary") return "bg-secondary text-secondary-content";
  if (variant === "accent") return "bg-accent text-accent-content";
  if (variant === "info") return "bg-info text-info-content";
  if (variant === "success") return "bg-success text-success-content";
  if (variant === "warning") return "bg-warning text-warning-content";
  if (variant === "error") return "bg-error text-error-content";
  return "bg-neutral text-neutral-content";
}
