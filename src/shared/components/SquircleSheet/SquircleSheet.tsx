import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { Sheet, type SheetDetent } from "react-modal-sheet";
import clsx from "clsx";
import sheetStyles from "./SquircleSheet.module.css";

/** Matches design-lab bottom sheet: side inset keeps sheet visually floating. */
export const SQUIRCLE_SHEET_SIDE_INSET = 14;
const TOP_R = 24;
const BOTTOM_R = 16;

export type SquircleSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  detent?: SheetDetent;
};

/**
 * Bottom sheet with unified rounded shell (fixes top-corner seam from split squircle/header).
 */
export function SquircleSheet({
  isOpen,
  onClose,
  title,
  children,
  detent = "content",
}: SquircleSheetProps) {
  const prefersReduced = useReducedMotion();
  const inset = SQUIRCLE_SHEET_SIDE_INSET;

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      detent={detent}
      prefersReducedMotion={Boolean(prefersReduced)}
    >
      <Sheet.Container
        unstyled
        className="flex flex-col overflow-hidden border border-base-300 bg-base-100 shadow-2xl"
        style={{
          left: inset,
          width: `calc(100% - ${inset * 2}px)`,
          maxWidth: `calc(100vw - ${inset * 2}px)`,
          boxSizing: "border-box",
          bottom: 0,
          paddingBottom: "max(10px, env(safe-area-inset-bottom, 0px))",
          maxHeight: "min(88dvh, 620px)",
          borderTopLeftRadius: TOP_R,
          borderTopRightRadius: TOP_R,
          borderBottomLeftRadius: BOTTOM_R,
          borderBottomRightRadius: BOTTOM_R,
          borderBottomColor: "transparent",
        }}
      >
        <Sheet.Header
          className="shrink-0 bg-base-100"
          style={{
            borderTopLeftRadius: TOP_R,
            borderTopRightRadius: TOP_R,
          }}
        />
        <Sheet.Content
          disableDrag
          className="flex min-h-0 flex-1 flex-col overflow-hidden bg-base-100"
          style={{
            borderBottomLeftRadius: BOTTOM_R,
            borderBottomRightRadius: BOTTOM_R,
            padding: "4px 18px 20px",
          }}
        >
          <div className={sheetStyles.titleOuter}>
            {typeof title === "string" ? (
              <h2 className={sheetStyles.titleHeading}>{title}</h2>
            ) : (
              title
            )}
          </div>
          <div className={clsx(sheetStyles.content, "min-h-0 flex-1 overflow-y-auto")}>
            {children}
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        unstyled
        className="bg-neutral/40 backdrop-blur-md"
        onTap={onClose}
      />
    </Sheet>
  );
}

export type SheetOptionRowProps = {
  active?: boolean;
  /** e.g. theme preview — rendered before the label */
  leading?: ReactNode;
  label: ReactNode;
  trailing?: ReactNode;
  onClick: () => void;
};

export function SheetOptionRow({
  active,
  leading,
  label,
  trailing,
  onClick,
}: SheetOptionRowProps) {
  return (
    <button
      type="button"
      className={clsx(
        "mb-2.5 flex w-full items-center justify-between gap-3 rounded-2xl border px-[18px] py-4 text-left font-inherit transition-colors last:mb-0",
        active
          ? "border-primary bg-primary text-primary-content"
          : "border-base-300 bg-base-200/60 text-base-content hover:bg-base-300/50",
      )}
      onClick={onClick}
    >
      <span className="flex min-w-0 flex-1 items-center gap-3">
        {leading}
        <span className="truncate text-base font-bold">{label}</span>
      </span>
      {trailing}
    </button>
  );
}
