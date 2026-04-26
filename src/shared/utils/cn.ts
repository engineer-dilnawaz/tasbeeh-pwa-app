import { clsx, type ClassValue } from "clsx";

/**
 * A utility to merge tailwind classes safely using clsx.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
