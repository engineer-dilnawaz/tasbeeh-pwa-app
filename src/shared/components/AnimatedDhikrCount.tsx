import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type CSSProperties,
} from "react";
import {
  useMotionValue,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import type { Transition } from "motion/react";
import ReactAnimatedNumbersPkg from "react-animated-numbers";
import {
  formatDhikrCount,
  leadingFormatPrefix,
} from "@/shared/utils/formatDhikrCount";

type ReactAnimatedNumbersProps = {
  className?: string;
  animateToNumber: number;
  fontStyle?: CSSProperties;
  transitions?: (index: number) => Transition;
  useThousandsSeparator?: boolean;
  locale?: string;
};

/** CJS package: Vite may yield `module.exports` as `{ default: fn }` — React needs the function. */
const ReactAnimatedNumbers: ComponentType<ReactAnimatedNumbersProps> =
  typeof ReactAnimatedNumbersPkg === "function"
    ? (ReactAnimatedNumbersPkg as ComponentType<ReactAnimatedNumbersProps>)
    : (
        ReactAnimatedNumbersPkg as unknown as {
          default: ComponentType<ReactAnimatedNumbersProps>;
        }
      ).default;

export type AnimatedDhikrCountProps = {
  value: number;
  /** Leading zeros when the integer part is narrow (default 2 → 01, 09, 99). */
  minIntegerDigits?: number;
  prefersReducedMotion?: boolean;
  className?: string;
  style?: CSSProperties;
};

const SPRING_LIVE = { stiffness: 420, damping: 40, mass: 0.55 } as const;
const SPRING_SNAP = { stiffness: 8000, damping: 130, mass: 0.5 } as const;

/**
 * Per-digit odometer animation (via `react-animated-numbers` + Motion) plus
 * optional spring smoothing between integer targets. Thousands separators and
 * `minIntegerDigits` match `formatDhikrCount`.
 */
export function AnimatedDhikrCount({
  value,
  minIntegerDigits = 2,
  prefersReducedMotion = false,
  className,
  style,
}: AnimatedDhikrCountProps) {
  const safe = Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));
  const target = useMotionValue(safe);
  const spring = useSpring(target, prefersReducedMotion ? SPRING_SNAP : SPRING_LIVE);
  const [displayInt, setDisplayInt] = useState(safe);

  useEffect(() => {
    target.set(safe);
  }, [safe, target]);

  useMotionValueEvent(spring, "change", (latest) => {
    setDisplayInt(Math.round(latest));
  });

  const prefix = useMemo(
    () => leadingFormatPrefix(displayInt, minIntegerDigits),
    [displayInt, minIntegerDigits],
  );

  const fontStyle: CSSProperties = { ...style };
  delete (fontStyle as { display?: string }).display;

  if (prefersReducedMotion) {
    return (
      <span
        className={className}
        style={{
          fontVariantNumeric: "tabular-nums",
          ...style,
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {formatDhikrCount(displayInt, { minIntegerDigits })}
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{
        fontVariantNumeric: "tabular-nums",
        alignItems: "baseline",
        justifyContent: "inherit",
        ...style,
        display: style?.display === "block" ? "inline-flex" : (style?.display ?? "inline-flex"),
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      {prefix ? (
        <span
          style={{
            fontVariantNumeric: "tabular-nums",
            ...fontStyle,
          }}
        >
          {prefix}
        </span>
      ) : null}
      <ReactAnimatedNumbers
        animateToNumber={displayInt}
        useThousandsSeparator
        locale="en-US"
        fontStyle={fontStyle}
        transitions={(index) => ({
          type: "spring",
          stiffness: 420,
          damping: 34,
          mass: 0.75,
          delay: index * 0.045,
        })}
      />
    </span>
  );
}
