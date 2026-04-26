import React from "react";
import { useLottie, type LottieOptions } from "lottie-react";
import checkMarkData from "../../assets/lotties/check-mark.json";

/**
 * Registry of available Lottie animations in the app.
 */
export const LOTTIE_ANIMATIONS = {
  CheckMark: checkMarkData,
} as const;

export type LottieAnimationKey = keyof typeof LOTTIE_ANIMATIONS;

/**
 * Custom options for the Lottie animation.
 */
export interface UseAppLottieOptions extends Omit<LottieOptions, 'animationData'> {
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

/**
 * A global hook for managing Lottie animations across the Tasbeeh app.
 */
export function useAppLottie(key: LottieAnimationKey, options: UseAppLottieOptions = {}) {
  const { 
    width, 
    height, 
    style, 
    loop = true, 
    autoplay = true, 
    ...lottieProps 
  } = options;
  
  const animationData = LOTTIE_ANIMATIONS[key];

  const { View } = useLottie({
    animationData,
    loop,
    autoplay,
    ...lottieProps,
  }, {
    width: width ?? "100%",
    height: height ?? "100%",
    ...style,
  });

  return {
    LottieView: React.cloneElement(View as React.ReactElement, { key }),
  };
}
