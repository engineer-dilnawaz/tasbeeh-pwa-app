/**
 * Public-facing app name: use the same value in Firebase Console
 * (Project settings → Public-facing name) so auth emails match in-app copy.
 * Override with VITE_PUBLIC_APP_NAME in `.env.local`.
 */
export function getPublicAppName(): string {
  return import.meta.env.VITE_PUBLIC_APP_NAME?.trim() || "Tasbeeh";
}

/**
 * URL embedded in the magic link email (`ActionCodeSettings.url`).
 * Domain must be listed under Authentication → Settings → Authorized domains.
 */
export function getEmailLinkContinueUrl(): string {
  const explicit = import.meta.env.VITE_APP_ORIGIN?.replace(/\/$/, "");
  if (explicit) return `${explicit}/auth/email-link`;
  if (typeof window === "undefined") return "/auth/email-link";
  return `${window.location.origin}/auth/email-link`;
}
