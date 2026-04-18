import { useSettingsStore } from "@/features/settings/store/settingsStore";

/**
 * Checks if the device supports haptics and the user has them enabled.
 */
function canVibrate() {
  const { hapticsEnabled } = useSettingsStore.getState().interaction;

  return (
    hapticsEnabled &&
    typeof navigator !== "undefined" &&
    typeof navigator.vibrate === "function"
  );
}

/**
 * Scales a vibration duration based on the user's selected haptic intensity.
 */
function scale(ms: number) {
  const { hapticsIntensity } = useSettingsStore.getState().interaction;

  switch (hapticsIntensity) {
    case "light":
      return ms * 0.7;
    case "medium":
      return ms;
    case "strong":
      return ms * 1.3;
    default:
      return ms;
  }
}

let lastVibrationTime = 0;
const MIN_INTERVAL = 25; // ms (safety throttle)

function shouldThrottle() {
  const now = Date.now();
  if (now - lastVibrationTime < MIN_INTERVAL) return true;
  lastVibrationTime = now;
  return false;
}

/**
 * 📳 Robust Haptic Feedback Service
 */
export const hapticService = {
  trigger(pattern: number | number[]) {
    if (!canVibrate() || shouldThrottle()) return;

    try {
      navigator.vibrate(pattern);
    } catch {
      // silent
    }
  },

  light() {
    // Increased to 40ms to match the "Undo" feel that was working
    hapticService.trigger(scale(40));
  },

  medium() {
    hapticService.trigger(scale(60));
  },

  heavy() {
    hapticService.trigger(scale(80));
  },

  success() {
    const base = [30, 45, 35];
    const scaled = base.map(scale);
    hapticService.trigger(scaled);
  },

  warning() {
    const base = [45, 35, 45];
    const scaled = base.map(scale);
    hapticService.trigger(scaled);
  },

  error() {
    const base = [70, 50, 70];
    const scaled = base.map(scale);
    hapticService.trigger(scaled);
  },
};
