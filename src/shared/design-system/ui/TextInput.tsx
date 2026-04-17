import React from "react";

type InputSize = "xs" | "sm" | "md" | "lg" | "xl";
type InputVariant = "bordered" | "ghost";

interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
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
    const variantClass =
      // Borderless inputs — rely on background color for affordance.
      // (We still keep daisy's input sizing/padding classes.)
      variant === "ghost" ? "input-ghost border-none" : "border-none";
    const radius = sizeRadius[size];
    const errorBgClass = isInvalid ? "bg-error/10" : "";

    // Ensure error color classes win over consumer-provided classes.
    // (If a consumer sets `border-*`, we still want `input-error` to take precedence.)
    const baseClasses = [
      "input",
      "w-full",
      "outline-none",
      "transition-colors",
      "focus-visible:outline-none",
      "focus-visible:ring-0",
      sizeClass[size],
      variantClass,
      className,
      // Prefer soft-error background over border color changes.
      // Keep border styling stable; let background communicate the error state.
      errorBgClass,
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
          className={baseClasses}
          style={{ borderRadius: radius }}
        />
      );

    return (
      <fieldset className={`fieldset w-full ${containerClassName}`}>
        {label && (
          <legend
            className={`fieldset-legend ${labelSizeClass[size]} bg-transparent px-0`}
          >
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
