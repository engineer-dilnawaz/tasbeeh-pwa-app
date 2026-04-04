import { logEvent as firebaseLogEvent } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";
import { getAnalyticsInstance } from "./instance";

/** GA4-friendly params (custom events stay JSON-serializable). */
export type AnalyticsParams = Record<string, string | number | boolean>;

function getClient(): Analytics | null {
  return getAnalyticsInstance();
}

/** Low-level event (no-op when Analytics is unavailable). */
export function logEvent(eventName: string, params?: AnalyticsParams): void {
  const a = getClient();
  if (!a) return;
  firebaseLogEvent(a, eventName, params);
}

/** Firebase-recommended `screen_view` (GA4 / Analytics). */
export function trackScreenView(screenName: string, screenClass?: string): void {
  const cls = screenClass ?? screenName;
  logEvent("screen_view", {
    firebase_screen: screenName,
    firebase_screen_class: cls,
  });
}

/** Recommended `login` event. */
export function trackLogin(method: string): void {
  logEvent("login", { method });
}

/** Recommended `sign_up` event. */
export function trackSignUp(method: string): void {
  logEvent("sign_up", { method });
}
