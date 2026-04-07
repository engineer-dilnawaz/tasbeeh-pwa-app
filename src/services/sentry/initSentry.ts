import * as Sentry from "@sentry/react";
import { useEffect } from "react";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";

const dsn = import.meta.env.VITE_SENTRY_DSN ?? "";

/** Events are sent in production builds, or in dev when `VITE_SENTRY_ENABLE_IN_DEV=true`. */
export function isSentryReportingActive(): boolean {
  if (!dsn) return false;
  if (import.meta.env.PROD) return true;
  return import.meta.env.VITE_SENTRY_ENABLE_IN_DEV === "true";
}

/**
 * Call once at startup, before React renders.
 * Captures: JS errors, unhandled rejections, React root errors (`reactErrorHandler`),
 * render errors (`ErrorBoundary`), and route navigations (React Router v7).
 * Session replay is buffered and uploaded when an error is captured (`replaysOnErrorSampleRate: 1`).
 */
export function initSentry(): void {
  if (!dsn) {
    if (import.meta.env.PROD) {
      console.warn(
        "[Sentry] Set VITE_SENTRY_DSN (see .env.example); crash reporting is disabled.",
      );
    }
    return;
  }

  const environment =
    import.meta.env.VITE_SENTRY_ENVIRONMENT ?? import.meta.env.MODE;
  const release =
    import.meta.env.VITE_SENTRY_RELEASE ?? `tasbeeh-flow@${__APP_VERSION__}`;
  const sendDefaultPii =
    import.meta.env.VITE_SENTRY_SEND_DEFAULT_PII !== "false";

  Sentry.init({
    dsn,
    enabled: isSentryReportingActive(),
    environment,
    release,
    sendDefaultPii,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.reactRouterV7BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: import.meta.env.PROD ? 0.2 : 1,
    replaysSessionSampleRate: import.meta.env.PROD ? 0.02 : 0,
    replaysOnErrorSampleRate: 1,
  });
}

/** Options for `createRoot` so React 19 uncaught/caught errors are reported. */
export function getSentryReactRootOptions(): {
  onUncaughtError: ReturnType<typeof Sentry.reactErrorHandler>;
  onCaughtError: ReturnType<typeof Sentry.reactErrorHandler>;
} | undefined {
  if (!isSentryReportingActive()) return undefined;
  const handler = Sentry.reactErrorHandler();
  return { onUncaughtError: handler, onCaughtError: handler };
}
