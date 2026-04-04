/**
 * Responsive Scaling Utilities for Web
 * Scaled against an iPhone 13 Mini (375 x 812) baseline.
 */

const DESIGN_W = 375;
const DESIGN_H = 812;

const getWindowWidth = () => (typeof window !== "undefined" ? window.innerWidth : DESIGN_W);
const getWindowHeight = () => (typeof window !== "undefined" ? window.innerHeight : DESIGN_H);

/**
 * Scale width from design to device constraints.
 * Provides a responsive width unit similar to React Native.
 * @param size - Design pixel value
 */
export const wp = (size: number): number => {
  const scaleW = getWindowWidth() / DESIGN_W;
  // Apply a gentle clamping so it doesn't blow up on Desktop screens
  const clampedScale = Math.min(Math.max(scaleW, 0.5), 1.5);
  return Math.round(size * clampedScale);
};

/**
 * Scale height from design to device constraints.
 * Provides a responsive height unit similar to React Native.
 * @param size - Design pixel value 
 */
export const hp = (size: number): number => {
  const scaleH = getWindowHeight() / DESIGN_H;
  // Apply a gentle clamping so it doesn't blow up on huge displays
  const clampedScale = Math.min(Math.max(scaleH, 0.5), 1.5);
  return Math.round(size * clampedScale);
};

/**
 * Scale font-size from design to device constraints.
 * Provides responsive typography mapping.
 * @param size - Design pixel value 
 */
export const fp = (size: number): number => {
  const scaleW = getWindowWidth() / DESIGN_W;
  // Font scaling is typically tighter constraint than width
  const clampedScale = Math.min(Math.max(scaleW, 0.8), 1.2);
  return Math.round(size * clampedScale);
};

