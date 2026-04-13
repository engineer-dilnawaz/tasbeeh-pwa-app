import React from "react";

type SwitchSize = "xs" | "sm" | "md" | "lg" | "xl";
type SwitchColor = "primary" | "secondary" | "accent" | "success" | "warning" | "error" | "neutral";
type SwitchVariant = "solid" | "outlined";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: SwitchSize;
  color?: SwitchColor;
  variant?: SwitchVariant;
  withIcons?: boolean;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const sizeClass: Record<SwitchSize, string> = {
  xs: "toggle-xs",
  sm: "toggle-sm",
  md: "toggle-md",
  lg: "toggle-lg",
  xl: "toggle-xl",
};

// Solid iOS style: unchecked = solid grey, checked = solid color — no visible border ring
const solidColorClass: Record<SwitchColor, string> = {
  primary:   "bg-base-300 border-base-300 checked:bg-primary   checked:border-primary   checked:text-primary-content",
  secondary: "bg-base-300 border-base-300 checked:bg-secondary checked:border-secondary checked:text-secondary-content",
  accent:    "bg-base-300 border-base-300 checked:bg-accent    checked:border-accent    checked:text-accent-content",
  success:   "bg-base-300 border-base-300 checked:bg-success   checked:border-success   checked:text-success-content",
  warning:   "bg-base-300 border-base-300 checked:bg-warning   checked:border-warning   checked:text-warning-content",
  error:     "bg-base-300 border-base-300 checked:bg-error     checked:border-error     checked:text-error-content",
  neutral:   "bg-base-300 border-base-300 checked:bg-neutral   checked:border-neutral   checked:text-neutral-content",
};

// Outlined: transparent track with color border, color thumb when checked
const outlinedColorClass: Record<SwitchColor, string> = {
  primary:   "bg-transparent border-base-content/20 checked:bg-base-100 checked:border-primary   checked:text-primary",
  secondary: "bg-transparent border-base-content/20 checked:bg-base-100 checked:border-secondary checked:text-secondary",
  accent:    "bg-transparent border-base-content/20 checked:bg-base-100 checked:border-accent    checked:text-accent",
  success:   "bg-transparent border-base-content/20 checked:bg-base-100 checked:border-success   checked:text-success",
  warning:   "bg-transparent border-base-content/20 checked:bg-base-100 checked:border-warning   checked:text-warning",
  error:     "bg-transparent border-base-content/20 checked:bg-base-100 checked:border-error     checked:text-error",
  neutral:   "bg-transparent border-base-content/20 checked:bg-base-100 checked:border-neutral   checked:text-neutral",
};

const CheckIcon = () => (
  <svg aria-label="enabled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="4" fill="none" stroke="currentColor">
      <path d="M20 6 9 17l-5-5" />
    </g>
  </svg>
);

const XIcon = () => (
  <svg
    aria-label="disabled"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

/**
 * Switch / Toggle.
 * - variant="solid" → iOS-style: solid grey track off, solid color track on (default)
 * - variant="outlined" → transparent track, color border + thumb when on
 * - withIcons → ✓ / ✕ icons inside the thumb
 */
export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  size = "md",
  color = "primary",
  variant = "solid",
  withIcons = false,
  label,
  disabled = false,
  className = "",
}) => {
  const trackClass = variant === "outlined" ? outlinedColorClass[color] : solidColorClass[color];
  const toggleClasses = `toggle ${trackClass} ${sizeClass[size]} ${className}`;

  const iconToggle = (
    <label
      className={`toggle ${trackClass} ${sizeClass[size]} ${className} ${
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <CheckIcon />
      <XIcon />
    </label>
  );

  const plainToggle = (
    <input
      type="checkbox"
      className={toggleClasses}
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
    />
  );

  const toggle = withIcons ? iconToggle : plainToggle;

  if (!label) return toggle;

  return (
    <label className="label gap-3 cursor-pointer justify-start">
      {toggle}
      <span className="label-text">{label}</span>
    </label>
  );
};
