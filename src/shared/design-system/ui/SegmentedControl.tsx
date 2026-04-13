import { motion } from "framer-motion";

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  layoutId: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  layoutId,
}: SegmentedControlProps<T>) {
  return (
    <div className="relative flex p-1 bg-base-content/5 rounded-2xl w-full">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`relative z-10 flex-1 flex items-center justify-center h-10 text-[11px] font-bold uppercase tracking-widest transition-all ${
            value === option.value ? "text-primary" : "text-base-content/40"
          }`}
        >
          {option.label}
          {value === option.value && (
            <motion.div
              layoutId={layoutId}
              className="absolute inset-0 bg-base-100 rounded-xl shadow-sm -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
