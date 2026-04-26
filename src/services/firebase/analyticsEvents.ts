/**
 * Centralized registry of all analytics event names used across the application.
 * Use this object to ensure consistency and avoid magic strings.
 */
export const ANALYTICS_EVENTS = {
  // Auth Events
  AUTH_SUCCESS: 'auth_success',
  AUTH_FAILURE: 'auth_failure',
  LOGOUT: 'logout',
  PASSWORD_RESET_REQUESTED: 'password_reset_requested',
  
  // Tasbeeh Events
  TASBEEH_COMPLETED: 'tasbeeh_completed',
  TASBEEH_RESET: 'tasbeeh_reset',
  STREAK_MILESTONE: 'streak_milestone',
  
  // Navigation & UI
  SCREEN_VIEW: 'screen_view',
  THEME_CHANGED: 'theme_changed',
  NOTIFICATION_TOGGLED: 'notification_toggled',
} as const;

/**
 * Type-safe keys for analytics events.
 */
export type AnalyticsEventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];
