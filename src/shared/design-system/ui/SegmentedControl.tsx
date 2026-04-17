import { motion } from "framer-motion";
import { Squircle } from "@/shared/design-system/ui/Squircle";

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
  uppercase?: boolean;
  activeItemClassName?: string;
  activeTextClassName?: string;
  inactiveTextClassName?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  uppercase = true,
  activeItemClassName = "bg-white dark:bg-base-100",
  activeTextClassName = "text-primary",
  inactiveTextClassName = "text-base-content/45",
}: SegmentedControlProps<T>) {
  const buttonHeightClass =
    size === "sm" ? "h-8 text-[10px]" : "h-10 text-[11px]";
  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const segmentWidthPct = options.length > 0 ? 100 / options.length : 100;

  return (
    <Squircle
      cornerRadius={18}
      cornerSmoothing={0.9}
      className="w-full bg-base-content/8 p-1"
    >
      <div className="relative flex w-full">
        {/* X-axis only active pill (avoid y/layout jitter) */}
        <motion.div
          aria-hidden
          initial={false}
          className={`absolute top-0 bottom-0 rounded-xl shadow-sm ${activeItemClassName}`}
          style={{ width: `${segmentWidthPct}%` }}
          animate={{ left: `${activeIndex * segmentWidthPct}%` }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`relative z-10 flex flex-1 items-center justify-center font-bold transition-all ${
              buttonHeightClass
            } ${uppercase ? "uppercase tracking-widest" : "tracking-normal"} ${
              value === option.value
                ? activeTextClassName
                : inactiveTextClassName
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </Squircle>
  );
}
