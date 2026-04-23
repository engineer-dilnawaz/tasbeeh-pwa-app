import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type InputSize = "xs" | "sm" | "md" | "lg" | "xl";
type InputVariant = "bordered" | "ghost" | "transparent";

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
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = inputProps.type === "password";
    const currentType = isPassword ? (showPassword ? "text" : "password") : inputProps.type;

    const variantClass =
      variant === "ghost"
        ? "input-ghost border-none"
        : variant === "transparent"
          ? "bg-transparent border-none focus:outline-none focus:ring-0"
          : "border-none bg-white dark:bg-[#121212]";
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
            type={currentType}
            className="grow bg-transparent outline-none py-2"
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-base-content/30 hover:text-base-content/60 transition-colors p-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
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
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className={`block mb-1.5 font-semibold text-sm text-base-content/70 px-1`}>
            {label}
          </label>
        )}

        <div className="w-full relative h-full">
          {inputElement}
        </div>

        {(error || hint) && (
          <p className={`mt-1 text-xs ${error ? "text-error" : "text-base-content/50"}`}>
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
