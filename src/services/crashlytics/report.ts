import { logEvent } from "@/services/analytics/track";

const MAX_DESC = 1500;
const MAX_BREADCRUMB = 120;

const customKeys: Record<string, string> = {};

function truncate(s: string, n: number): string {
  return s.length <= n ? s : `${s.slice(0, n - 1)}…`;
}

/** Persists until cleared (merged into the next `recordError` payload). */
export function setCustomKey(key: string, value: string | number | boolean): void {
  customKeys[key] = String(value);
}

export function clearCustomKeys(): void {
  for (const k of Object.keys(customKeys)) delete customKeys[k];
}

export function log(message: string): void {
  logEvent("cl_breadcrumb", { message: truncate(message, MAX_BREADCRUMB) });
}

/**
 * Records a non-fatal error (GA4 `exception` event).
 * In development, also logs to the console for debugging.
 */
export function recordError(error: unknown, context?: Record<string, string>): void {
  const err = error instanceof Error ? error : new Error(String(error));

  if (import.meta.env.DEV) {
    console.error("[Crashlytics]", err, context);
  }

  const base = `${err.name}: ${err.message}`;
  const stack = err.stack ?? "";
  let description = truncate(`${base}\n${stack}`, MAX_DESC);

  const ctx: Record<string, string> = { ...customKeys, ...context };
  if (Object.keys(ctx).length > 0) {
    const extra = truncate(JSON.stringify(ctx), 400);
    description = truncate(`${description}\nctx:${extra}`, MAX_DESC);
  }

  logEvent("exception", { description, fatal: false });
}
