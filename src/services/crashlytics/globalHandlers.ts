import { logErrorToAnalytics } from "./report";

function safeRecord(error: unknown, context: Record<string, string>): void {
  try {
    logErrorToAnalytics(error, context);
  } catch {
    /* avoid recursive reporting */
  }
}

/** Captures uncaught errors and unhandled promise rejections. Safe to call once at app startup. */
export function installGlobalErrorHandlers(): void {
  window.addEventListener("error", (event) => {
    if (event.error) {
      safeRecord(event.error, { source: "window_error" });
      return;
    }
    safeRecord(new Error(event.message || "window_error"), {
      source: "window_error",
      filename: String(event.filename ?? ""),
      lineno: String(event.lineno ?? ""),
      colno: String(event.colno ?? ""),
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const r = event.reason;
    const err = r instanceof Error ? r : new Error(String(r));
    safeRecord(err, { source: "unhandledrejection" });
  });
}
