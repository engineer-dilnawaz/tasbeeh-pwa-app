import { useLottie } from "lottie-react";
import checkMarkData from "../../assets/lotties/check-mark.json";

/**
 * Registry of available Lottie animations in the app.
 * Add new animations here to make them available via useAppLottie.
 */
export const LOTTIE_ANIMATIONS = {
  CheckMark: checkMarkData,
} as const;

export type LottieAnimationKey = keyof typeof LOTTIE_ANIMATIONS;

/**
 * Custom options for the Lottie animation, strictly limited to essential
 * animation settings and styling to ensure a clean DX without HTML noise.
 */
export interface UseAppLottieOptions {
  loop?: boolean | number;
  autoplay?: boolean;
  initialSegment?: [number, number];
  speed?: number;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  onComplete?: () => void;
  onLoopComplete?: () => void;
  onEnterFrame?: () => void;
  onSegmentStart?: () => void;
}

/**
 * A global hook for managing Lottie animations across the Tasbeeh app.
 * Provides a central registry, type safety, and consistent default options.
 *
 * @param key - The key of the animation to play (e.g., 'CheckMark')
 * @param options - Customization options for the animation (loop, autoplay, etc.)
 */
export function useAppLottie(
  key: LottieAnimationKey,
  options: UseAppLottieOptions = {},
) {
  const { width, height, style, ...restOptions } = options;

  const animationData = LOTTIE_ANIMATIONS[key];

  const lottieOptions = {
    animationData,
    loop: true,
    autoplay: true,
    ...restOptions,
  };

  const lottieStyle = {
    width: width ?? "100%",
    height: height ?? "100%",
    ...style,
  };

  const { View: LottieView, ...lottieInstance } = useLottie(
    lottieOptions,
    lottieStyle,
  );

  return {
    LottieView,
    instance: lottieInstance,
  };
}
