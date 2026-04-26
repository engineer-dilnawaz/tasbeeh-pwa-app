/**
 * Centralized route paths for the application.
 */
export const APP_ROUTES = {
  // Public Routes
  INDEX: "/",
  ONBOARDING: "/onboarding",
  SIGNIN: "/signin",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_EMAIL: "/verify-email",

  // Protected Routes
  HOME: "/home",
  STATS: "/stats",
  SETTINGS: "/settings",
  COLLECTIONS: "/collections",
  COLLECTIONS_NEW: "/collections/new",
  COLLECTIONS_FILTER: "/collections/filter",
  SETTINGS_FEEDBACK: "/settings/feedback",
  SETTINGS_ABOUT: "/settings/about",
  SETTINGS_PROFILE: "/settings/profile",

  // Debug & Utility
  TEST: "/test",
  TESTER: "/tester",
} as const;

export type AppRoute = typeof APP_ROUTES[keyof typeof APP_ROUTES];
