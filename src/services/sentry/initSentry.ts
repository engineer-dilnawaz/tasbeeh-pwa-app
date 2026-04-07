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
 */
export function initSentry(): void {
  // If no DSN, we still want to avoid crashing the app if the user hasn't set it up
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

  try {
    const integrations: any[] = [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ];

    // Safely add Router integration if available
    // Sentry v8+ uses reactRouterV6BrowserTracingIntegration for both v6 and v7
    // unless they released a specific v7 one recently.
    const routerIntegration =
      (Sentry as any).reactRouterV7BrowserTracingIntegration ||
      (Sentry as any).reactRouterV6BrowserTracingIntegration;

    if (typeof routerIntegration === "function") {
      integrations.push(
        routerIntegration({
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes,
        }),
      );
    }

    Sentry.init({
      dsn,
      enabled: isSentryReportingActive(),
      environment,
      release,
      sendDefaultPii,
      integrations,
      tracesSampleRate: import.meta.env.PROD ? 0.2 : 1,
      replaysSessionSampleRate: import.meta.env.PROD ? 0.02 : 0,
      replaysOnErrorSampleRate: 1,
    });
  } catch (e) {
    console.error("[Sentry] Failed to initialize:", e);
  }
}

/** Options for `createRoot` so React 19 uncaught/caught errors are reported. */
export function getSentryReactRootOptions():
  | {
      onUncaughtError: (error: unknown, errorInfo: any) => void;
      onCaughtError: (error: unknown, errorInfo: any) => void;
    }
  | undefined {
  if (!isSentryReportingActive()) return undefined;

  try {
    // Sentry.reactErrorHandler handles the reporting to Sentry
    const handler = Sentry.reactErrorHandler();
    return {
      onUncaughtError: (error, errorInfo) => {
        console.error("Uncaught React Error:", error, errorInfo);
        handler(error, errorInfo);
      },
      onCaughtError: (error, errorInfo) => {
        console.warn("Caught React Error:", error, errorInfo);
        handler(error, errorInfo);
      },
    };
  } catch (e) {
    console.error("[Sentry] Failed to get React root options:", e);
    return undefined;
  }
}
