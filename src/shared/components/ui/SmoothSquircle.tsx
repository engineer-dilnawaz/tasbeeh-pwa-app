import type { ComponentType } from "react";
import { Squircle as CornerSquircle } from "corner-smoothing";

/** `corner-smoothing` squircle with loose typing for `as` / style props. */
export const SmoothSquircle = CornerSquircle as unknown as ComponentType<
  Record<string, unknown>
>;
