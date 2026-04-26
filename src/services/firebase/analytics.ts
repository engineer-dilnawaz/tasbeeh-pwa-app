import {
  getAnalytics,
  logEvent,
  setUserId,
  setUserProperties,
} from "firebase/analytics";
import { type AnalyticsEventName } from "./analyticsEvents";
import app from "./config";

/**
 * Initialize Firebase Analytics
 */
export const analytics = getAnalytics(app);

/**
 * Sets the user ID for the current session.
 */
export const identifyUser = (uid: string | null) => {
  setUserId(analytics, uid);
};

/**
 * Sets custom user properties for segmentation.
 */
export const setProfileProperties = (
  properties: Record<string, string | number | boolean | null>,
) => {
  setUserProperties(analytics, properties);
};

/**
 * Logs a custom app event with optional parameters.
 *
 * @param name - The name of the event from ANALYTICS_EVENTS
 * @param params - Optional metadata for the event
 */
export const logAppEvent = (name: AnalyticsEventName, params?: object) => {
  logEvent(analytics, name as string, params);
};
