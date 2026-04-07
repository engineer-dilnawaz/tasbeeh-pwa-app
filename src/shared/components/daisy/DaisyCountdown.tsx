import clsx from "clsx";
import type { CSSProperties, HTMLAttributes } from "react";

const clamp999 = (n: number) => Math.min(999, Math.max(0, Math.floor(n)));

export type DaisyCountdownProps = HTMLAttributes<HTMLSpanElement> & {
  /** 0–999 per [daisyUI countdown](https://daisyui.com/components/countdown/). */
  value: number;
  /** Min digit width: 1 (default), 2, or 3. */
  digits?: 1 | 2 | 3;
  formatValue?: (n: number) => string;
};

/**
 * daisyUI [countdown](https://daisyui.com/components/countdown/) — set `--value` + matching text.
 */
export function DaisyCountdown({
  value,
  digits = 1,
  formatValue,
  className,
  style,
  ...rest
}: DaisyCountdownProps) {
  const v = clamp999(value);
  const text =
    formatValue?.(v) ??
    (digits === 1 ? String(v) : String(v).padStart(digits, "0"));

  const innerStyle = {
    ...style,
    "--value": v,
    ...(digits > 1 ? { "--digits": digits } : {}),
  } as CSSProperties;

  return (
    <span className={clsx("countdown", className)} {...rest}>
      <span style={innerStyle} aria-live="polite" aria-label={text}>
        {text}
      </span>
    </span>
  );
}
