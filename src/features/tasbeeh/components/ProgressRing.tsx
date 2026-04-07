import { useId, type ReactNode } from "react";
import clsx from "clsx";

type ProgressRingProps = {
  count: number;
  target: number;
  /** Replace default count / target in the center. */
  children?: ReactNode;
  className?: string;
  /** SVG width/height in px. */
  size?: number;
};

export function ProgressRing({
  count,
  target,
  children,
  className,
  size = 180,
}: ProgressRingProps) {
  const uid = useId().replace(/:/g, "");
  const filterId = `ringGlow-${uid}`;
  const R = size * (80 / 180);
  const cx = size / 2;
  const cy = size / 2;
  const C = 2 * Math.PI * R;
  const t = target > 0 ? target : 100;
  const offset = C - (Math.min(count, t) / t) * C;
  const strokeTrack = Math.max(6, size * (8 / 180));
  const strokeProg = Math.max(8, size * (10 / 180));

  return (
    <div
      className={clsx(
        "relative flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        className="-rotate-90 text-primary drop-shadow-[0_0_22px_color-mix(in_oklab,var(--color-primary)_35%,transparent)]"
        width={size}
        height={size}
        aria-hidden
      >
        <defs>
          <filter
            id={filterId}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          className="fill-transparent stroke-base-300 dark:stroke-base-content/20"
          cx={cx}
          cy={cy}
          r={R}
          strokeWidth={strokeTrack}
        />
        <circle
          className="fill-transparent text-primary [stroke-linecap:round] transition-[stroke-dashoffset] duration-300 ease-out"
          style={{ stroke: "currentColor" }}
          strokeWidth={strokeProg}
          cx={cx}
          cy={cy}
          r={R}
          filter={`url(#${filterId})`}
          strokeDasharray={C}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        {children ?? (
          <>
            <div className="bg-linear-to-br from-base-content to-base-content/70 bg-clip-text text-[clamp(2rem,12vw,3.25rem)] font-black tabular-nums leading-none text-transparent">
              {count}
            </div>
            <div className="mt-1 text-sm font-semibold tabular-nums text-base-content/50">
              / {t}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
