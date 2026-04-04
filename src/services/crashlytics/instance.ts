/**
 * Firebase Crashlytics does not ship a JavaScript/web SDK (Android, iOS, Flutter, Unity only).
 * This module exposes Crashlytics-like APIs and forwards reports through Google Analytics (GA4)
 * `exception` events when `VITE_FIREBASE_MEASUREMENT_ID` is configured.
 *
 * @see https://firebase.google.com/docs/crashlytics
 */
import { isAnalyticsAvailable } from "@/services/analytics/instance";

export function isCrashlyticsReportingAvailable(): boolean {
  return isAnalyticsAvailable();
}
