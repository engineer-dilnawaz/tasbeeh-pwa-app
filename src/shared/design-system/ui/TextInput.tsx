import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Squircle } from "./Squircle";

type InputSize = "xs" | "sm" | "md" | "lg" | "xl";
type InputVariant = "bordered" | "ghost" | "transparent";

interface TextInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
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
    ref,
  ) => {
    const isInvalid = error || inputProps["aria-invalid"] === true;
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = inputProps.type === "password";
    const currentType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : inputProps.type;

    const variantClass =
      variant === "ghost"
        ? "input-ghost border-none"
        : variant === "transparent"
          ? "bg-transparent border-none focus:outline-none focus:ring-0"
          : "border-none bg-base-content/5 dark:bg-white/5 focus:bg-base-content/8 dark:focus:bg-white/8";
    const radius = sizeRadius[size];
    const errorBgClass = isInvalid ? "bg-error/10" : "";

    // Ensure error color classes win over consumer-provided classes.
    // (If a consumer sets `border-*`, we still want `input-error` to take precedence.)
    const baseClasses = [
      "w-full",
      "outline-none",
      "border-none",
      "transition-colors",
      "focus:outline-none",
      "focus:ring-0",
      "focus-within:outline-none",
      "focus-within:ring-0",
      "focus-visible:outline-none",
      "focus-visible:ring-0",
      "placeholder:text-base-content/30",
      variantClass,
      className,
      errorBgClass,
    ]
      .filter(Boolean)
      .join(" ");

    const sizeHeightClass: Record<InputSize, string> = {
      xs: "h-8 px-3 text-xs",
      sm: "h-10 px-3 text-sm",
      md: "h-12 px-4 text-base",
      lg: "h-14 px-4 text-lg",
      xl: "h-16 px-5 text-xl",
    };

    const inputElement =
      leftIcon || rightIcon ? (
        <Squircle cornerRadius={radius} cornerSmoothing={0.9} asChild>
          <label
            className={`${baseClasses} ${sizeHeightClass[size]} flex items-center gap-2 !border-none !outline-none !ring-0`}
          >
            {leftIcon && (
              <span className="text-base-content/40 shrink-0">{leftIcon}</span>
            )}
            <input
              ref={ref}
              {...inputProps}
              type={currentType}
              className="grow bg-transparent outline-none py-2 border-none focus:ring-0"
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
        </Squircle>
      ) : (
        <Squircle cornerRadius={radius} cornerSmoothing={0.9} asChild>
          <input
            ref={ref}
            {...inputProps}
            className={`${baseClasses} ${sizeHeightClass[size]} !border-none !outline-none !ring-0`}
          />
        </Squircle>
      );

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            className={`block mb-1.5 font-semibold text-sm text-base-content/70 px-1`}
          >
            {label}
          </label>
        )}

        <div className="w-full relative h-full">
          <Squircle cornerRadius={radius} cornerSmoothing={0.9} asChild>
            <div className="absolute inset-0 bg-base-100 pointer-events-none" />
          </Squircle>
          {inputElement}
        </div>

        {(error || hint) && (
          <p
            className={`mt-1 text-xs ${error ? "text-error" : "text-base-content/50"}`}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";
