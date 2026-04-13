import React from "react";

type CheckboxSize = "xs" | "sm" | "md" | "lg" | "xl";
type CheckboxColor = "primary" | "secondary" | "accent" | "success" | "warning" | "error" | "neutral";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: CheckboxSize;
  color?: CheckboxColor;
  label?: string;
  indeterminate?: boolean;
  disabled?: boolean;
  className?: string;
}

const sizeClass: Record<CheckboxSize, string> = {
  xs: "checkbox-xs",
  sm: "checkbox-sm",
  md: "checkbox-md",
  lg: "checkbox-lg",
  xl: "checkbox-xl",
};

const colorClass: Record<CheckboxColor, string> = {
  primary: "checkbox-primary",
  secondary: "checkbox-secondary",
  accent: "checkbox-accent",
  success: "checkbox-success",
  warning: "checkbox-warning",
  error: "checkbox-error",
  neutral: "checkbox-neutral",
};

/**
 * Checkbox — DaisyUI checkbox, wrapped for controlled React usage.
 * Supports indeterminate state, all DaisyUI colors and sizes, and an optional label.
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  size = "md",
  color = "primary",
  label,
  indeterminate = false,
  disabled = false,
  className = "",
}) => {
  const ref = React.useRef<HTMLInputElement>(null);

  // indeterminate is not an HTML attribute — must be set via JS
  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const input = (
    <input
      ref={ref}
      type="checkbox"
      className={`checkbox ${colorClass[color]} ${sizeClass[size]} ${className}`}
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
    />
  );

  if (!label) return input;

  return (
    <label className="label gap-3 cursor-pointer justify-start">
      {input}
      <span className="label-text">{label}</span>
    </label>
  );
};
