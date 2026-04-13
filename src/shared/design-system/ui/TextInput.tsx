import React from "react";

type InputSize = "xs" | "sm" | "md" | "lg" | "xl";
type InputColor =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "neutral";
type InputVariant = "bordered" | "ghost";

interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
  color?: InputColor;
  variant?: InputVariant;
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const sizeClass: Record<InputSize, string> = {
  xs: "input-xs",
  sm: "input-sm",
  md: "input-md",
  lg: "input-lg",
  xl: "input-xl",
};

// Smooth corner radius per size — applied directly to the element via style
const sizeRadius: Record<InputSize, number> = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 14,
  xl: 16,
};

const colorClass: Record<InputColor, string> = {
  primary: "input-primary",
  secondary: "input-secondary",
  accent: "input-accent",
  success: "input-success",
  warning: "input-warning",
  error: "input-error",
  neutral: "input-neutral",
};

const labelSizeClass: Record<InputSize, string> = {
  xs: "text-xs",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-sm",
  xl: "text-base",
};

/**
 * TextInput — DaisyUI input field with smooth corners.
 * Supports label, hint/error text, left/right icon slots, all variants/colors/sizes.
 * borderRadius is applied inline on the element itself — no wrapper clipping needed.
 */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      size = "md",
      color,
      variant = "bordered",
      label,
      hint,
      error,
      leftIcon,
      rightIcon,
      containerClassName = "",
      className = "",
      ...inputProps
    },
    ref
  ) => {
    const isInvalid = error || inputProps["aria-invalid"] === true;
    const resolvedColor = isInvalid ? "error" : color;
    const variantClass =
      variant === "ghost" ? "input-ghost" : "input-bordered";
    const radius = sizeRadius[size];

    const baseClasses = [
      "input",
      "w-full",
      "outline-none",
      sizeClass[size],
      variantClass,
      resolvedColor ? colorClass[resolvedColor] : "",
    ]
      .filter(Boolean)
      .join(" ");

    const inputElement =
      leftIcon || rightIcon ? (
        <label
          className={`${baseClasses} flex items-center gap-2`}
          style={{ borderRadius: radius }}
        >
          {leftIcon && (
            <span className="text-base-content/40 shrink-0">{leftIcon}</span>
          )}
          <input
            ref={ref}
            {...inputProps}
            className="grow bg-transparent outline-none min-w-0"
          />
          {rightIcon && (
            <span className="text-base-content/40 shrink-0">{rightIcon}</span>
          )}
        </label>
      ) : (
        <input
          ref={ref}
          {...inputProps}
          className={`${baseClasses} ${className}`}
          style={{ borderRadius: radius }}
        />
      );

    return (
      <fieldset className={`fieldset w-full ${containerClassName}`}>
        {label && (
          <legend className={`fieldset-legend ${labelSizeClass[size]}`}>
            {label}
          </legend>
        )}

        {inputElement}

        {(error || hint) && (
          <p
            className={`fieldset-label ${
              error ? "text-error" : "text-base-content/50"
            }`}
          >
            {error ?? hint}
          </p>
        )}
      </fieldset>
    );
  }
);

TextInput.displayName = "TextInput";
