import { getAnalytics, type Analytics } from "firebase/analytics";
import { app } from "@/services/firebase/app";

let analyticsInstance: Analytics | null = null;

if (app && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
  try {
    analyticsInstance = getAnalytics(app);
  } catch {
    analyticsInstance = null;
  }
}

export function getAnalyticsInstance(): Analytics | null {
  return analyticsInstance;
}

export function isAnalyticsAvailable(): boolean {
  return analyticsInstance !== null;
}
