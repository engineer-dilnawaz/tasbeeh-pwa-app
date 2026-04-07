/** When set to `"1"`, user turned off tap vibration (home + settings share this). */
export const VIBRATION_USER_DISABLED_KEY = "tasbeeh-home-vibration-off";

/** Short pulse for each count (ms). Below ~25ms many phones feel nothing. */
export const HAPTIC_TAP_MS = 52;

/** Stronger pattern for completing a dhikr: vibrate, pause, vibrate (ms). */
export const HAPTIC_COMPLETION_PATTERN: readonly number[] = [68, 115, 72];

export function readUserVibrationDisabled(): boolean {
  try {
    return localStorage.getItem(VIBRATION_USER_DISABLED_KEY) === "1";
  } catch {
    return false;
  }
}

const PREF_EVENT = "tasbeeh-vibration-pref-changed";

export function writeUserVibrationDisabled(disabled: boolean): void {
  try {
    localStorage.setItem(VIBRATION_USER_DISABLED_KEY, disabled ? "1" : "0");
    window.dispatchEvent(new Event(PREF_EVENT));
  } catch {
    /* ignore */
  }
}

/** Same-tab sync when settings change (storage event only fires in other tabs). */
export function subscribeVibrationPrefChanged(cb: () => void): () => void {
  window.addEventListener(PREF_EVENT, cb);
  return () => window.removeEventListener(PREF_EVENT, cb);
}

export type HapticsBlockedReason = "insecure" | "unsupported";

/**
 * Non-HTTPS pages (e.g. http://192.168.x.x during `vite --host`) are not a
 * [secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts),
 * so `navigator.vibrate` is unavailable — a common cause of “no buzz on Android”.
 */
export function getHapticsBlockedReason(): HapticsBlockedReason | null {
  if (
    typeof globalThis !== "undefined" &&
    typeof globalThis.isSecureContext === "boolean" &&
    !globalThis.isSecureContext
  ) {
    return "insecure";
  }
  if (
    typeof navigator === "undefined" ||
    typeof navigator.vibrate !== "function"
  ) {
    return "unsupported";
  }
  return null;
}

export function vibrateSupported(): boolean {
  return getHapticsBlockedReason() === null;
}

function normalizePattern(pattern: number | number[]): number | number[] {
  if (typeof pattern === "number") {
    return Math.max(pattern, 35);
  }
  return pattern.map((n, i) => (i % 2 === 0 ? Math.max(n, 35) : Math.max(n, 0)));
}

export function safeVibrate(pattern: number | number[]): boolean {
  if (!vibrateSupported()) return false;
  try {
    navigator.vibrate(0);
    const normalized = normalizePattern(
      typeof pattern === "number" ? pattern : [...pattern],
    );
    const ok = navigator.vibrate(normalized);
    return ok !== false;
  } catch {
    return false;
  }
}
