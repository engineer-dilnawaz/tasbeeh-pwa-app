import type { SquircleProps as BaseProps } from "@squircle-js/react";
import type { HTMLAttributes, ReactNode } from "react";

/**
 * SquircleProps
 * 
 * Combines library-native squircle props with standard HTML attributes
 * to support polymorphism and event handlers (onClick, etc).
 */
export interface SquircleProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  cornerRadius?: number;
  cornerSmoothing?: number;
  as?: React.ElementType; // Keep 'as' in types for documentation/logic, even if Base doesn't use it
}
