import React from "react";

import { Squircle } from "@/shared/design-system/ui/Squircle";

export type SkeletonVariant =
  | "circular"
  | "rectangular"
  | "text"
  | "card"
  | "collectionCard";

export interface SkeletonProps {
  /** Optional override classes to style dimensions, margin, etc. */
  className?: string;
  /** Pre-defined shape configurations */
  variant?: SkeletonVariant;
  /** Explicit width (e.g. 40, "100%", "5rem") — ignored for `collectionCard` */
  width?: string | number;
  /** Explicit height — ignored for `collectionCard` */
  height?: string | number;
  /** Disable the shimmer animation to save CPU power */
  animated?: boolean;
}

function shimmerClass(animated: boolean) {
  return animated
    ? "skeleton border-none !bg-base-content/10 dark:!bg-base-content/15"
    : "bg-base-content/10";
}

const CHIP_SKELETON =
  "inline-flex h-[26px] min-w-[3.75rem] shrink-0 rounded-full border border-base-content/12 px-3 py-0";

/**
 * Layout/spacing aligned with `CollectionsCard` (title → priority → description
 * → recitation chips → Tasbeeh list + segmented track → rows → CTA buttons).
 */
function CollectionCardSkeleton({
  animated,
  className,
}: {
  animated: boolean;
  className: string;
}) {
  const s = shimmerClass(animated);

  return (
    <div className={className} aria-hidden>
      <Squircle
        cornerRadius={30}
        cornerSmoothing={0.99}
        className="surface-card w-full p-5"
      >
        {/* Title + priority — matches CollectionsCard header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className={`${s} h-6 w-[min(92%,18rem)] rounded-lg`} />
            <div className={`${s} mt-1 h-3.5 w-[min(48%,11rem)] rounded-md`} />
          </div>
        </div>

        {/* Description (3 lines) + “see more” — matches mt-3 block */}
        <div className="mt-3">
          <div className="flex flex-col gap-[0.35rem]">
            <div className={`${s} h-[0.95rem] w-full rounded-md`} />
            <div className={`${s} h-[0.95rem] w-full rounded-md`} />
            <div className={`${s} h-[0.95rem] w-[min(94%,100%)] rounded-md`} />
            <div className={`${s} mt-1 h-3 w-14 rounded-md`} />
          </div>
        </div>

        {/* Recitation Time + chips — matches mt-4 + mt-2 flex flex-wrap gap-2 */}
        <div className="mt-4">
          <div className={`${s} h-4 w-36 rounded-md`} />
          <div className="mt-2 flex flex-wrap gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className={`${CHIP_SKELETON} ${s}`} />
            ))}
          </div>
        </div>

        {/* Tasbeeh List — matches mt-5 */}
        <div className="mt-5">
          <div className={`${s} h-4 w-28 rounded-md`} />
          <div className="mt-3">
            <Squircle
              cornerRadius={18}
              cornerSmoothing={0.9}
              className="w-full bg-base-content/8 p-1"
            >
              <div className="relative flex h-8 w-full">
                <div className="relative z-10 flex flex-1 items-center justify-center">
                  <div className={`${s} h-2.5 w-9 max-w-[80%] rounded-sm opacity-40`} />
                </div>
                <div className="relative z-10 mx-0.5 flex flex-1 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-base-100">
                  <div className={`${s} h-3 w-11 max-w-[85%] rounded-md`} />
                </div>
                <div className="relative z-10 flex flex-1 items-center justify-center">
                  <div className={`${s} h-2.5 w-8 max-w-[80%] rounded-sm opacity-40`} />
                </div>
              </div>
            </Squircle>
          </div>

          <div className="mt-3 divide-y divide-base-content/8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div
                  className={`${s} h-4 w-[min(58%,14rem)] rounded-md`}
                />
                <div
                  className={`${s} h-[18px] w-[18px] shrink-0 rounded-full`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Primary + outline — matches mt-6 flex flex-col gap-3 + h-14 buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <Squircle cornerRadius={100} cornerSmoothing={0.92} className="w-full">
            <div className={`${s} h-14 w-full rounded-full`} />
          </Squircle>
          <div className="flex h-14 w-full items-center justify-center rounded-full border border-base-content/20 px-4">
            <div className={`${s} h-3.5 w-[min(42%,10rem)] rounded-md`} />
          </div>
        </div>
      </Squircle>
    </div>
  );
}

/**
 * Skeleton primitive + composed presets (`collectionCard`).
 * Primitives (`text`, `circular`, `rectangular`, `card`) unchanged for existing screens.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "text",
  width,
  height,
  animated = true,
}) => {
  if (variant === "collectionCard") {
    return <CollectionCardSkeleton animated={animated} className={className} />;
  }

  const baseClasses = animated
    ? "skeleton w-full border-none !bg-base-content/10 dark:!bg-base-content/15"
    : "bg-base-content/10";

  let defaultWidth: string | number | undefined;
  let defaultHeight: string | number | undefined;
  let radiusClass = "";

  switch (variant) {
    case "text":
      defaultWidth = "100%";
      defaultHeight = "1.25rem";
      radiusClass = "rounded-lg";
      break;
    case "circular":
      defaultWidth = "3rem";
      defaultHeight = "3rem";
      radiusClass = "rounded-full";
      break;
    case "rectangular":
      defaultWidth = "100%";
      defaultHeight = "auto";
      radiusClass = "rounded-xl";
      break;
    case "card":
      defaultWidth = "100%";
      defaultHeight = "8rem";
      radiusClass = "rounded-[24px]"; // Squircle approximation
      break;
  }

  return (
    <div
      className={`${baseClasses} ${radiusClass} ${className}`}
      style={{
        width: width ?? defaultWidth,
        height: height ?? defaultHeight,
      }}
    />
  );
};
