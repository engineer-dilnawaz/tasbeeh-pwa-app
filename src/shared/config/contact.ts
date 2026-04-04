/**
 * Public support / privacy contact. Set `VITE_SUPPORT_EMAIL` in `.env.local` for production.
 */
export function getSupportEmail(): string {
  return import.meta.env.VITE_SUPPORT_EMAIL?.trim() || "privacy@tasbeehflow.app";
}
