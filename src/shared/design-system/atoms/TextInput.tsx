import React from "react";
import { Surface } from "./Surface";
import { cn } from "@/shared/utils/cn";

type InputVariant = "bordered" | "ghost" | "transparent";
type InputSize = "sm" | "md" | "lg";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  inputSize?: InputSize;
  isInvalid?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<InputVariant, string> = {
  bordered: "bg-ds-bg-surface shadow-sm focus-within:bg-ds-bg-surface/80",
  ghost: "bg-ds-bg-surface/40 focus-within:bg-ds-bg-surface/60",
  transparent: "bg-transparent focus-within:bg-ds-bg-surface/10",
};

const sizeStyles: Record<InputSize, string> = {
  sm: "h-10 px-3 text-sm",
  md: "h-12 px-4 text-base",
  lg: "h-14 px-5 text-lg",
};

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ 
    variant = "bordered", 
    inputSize = "md", 
    isInvalid = false, 
    leftIcon, 
    rightIcon, 
    className = "", 
    ...props 
  }, ref) => {
    return (
      <Surface
        cornerRadius={inputSize === "sm" ? 14 : 18}
        className={cn(
          "flex items-center gap-2 transition-all group",
          variantStyles[variant],
          isInvalid && "bg-red-500/10",
          className
        )}
      >
        {leftIcon && (
          <span className="pl-3 text-ds-text-subtle group-focus-within:text-ds-primary transition-colors">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-transparent outline-none text-ds-text-main placeholder:text-ds-text-subtle/50",
            sizeStyles[inputSize],
            leftIcon ? "pl-0" : "",
            rightIcon ? "pr-0" : ""
          )}
          {...props}
        />
        {rightIcon && (
          <span className="pr-3 text-ds-text-subtle group-focus-within:text-ds-primary transition-colors">
            {rightIcon}
          </span>
        )}
      </Surface>
    );
  }
);

TextInput.displayName = "TextInput";
