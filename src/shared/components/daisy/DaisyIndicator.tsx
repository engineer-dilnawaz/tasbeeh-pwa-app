import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

export type DaisyIndicatorHAlign = "start" | "center" | "end";
export type DaisyIndicatorVAlign = "top" | "middle" | "bottom";

export type DaisyIndicatorProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Corner badge or dot (e.g. `badge badge-primary`, `status status-error`). */
  indicator: ReactNode;
  h?: DaisyIndicatorHAlign;
  v?: DaisyIndicatorVAlign;
};

const hClass: Record<DaisyIndicatorHAlign, string> = {
  start: "indicator-start",
  center: "indicator-center",
  end: "indicator-end",
};

const vClass: Record<DaisyIndicatorVAlign, string> = {
  top: "indicator-top",
  middle: "indicator-middle",
  bottom: "indicator-bottom",
};

/** daisyUI [indicator](https://daisyui.com/components/indicator/) */
export function DaisyIndicator({
  children,
  indicator,
  h = "end",
  v = "top",
  className,
  ...rest
}: DaisyIndicatorProps) {
  return (
    <div className={clsx("indicator", className)} {...rest}>
      <span
        className={clsx(
          "indicator-item",
          vClass[v],
          hClass[h],
        )}
      >
        {indicator}
      </span>
      {children}
    </div>
  );
}
