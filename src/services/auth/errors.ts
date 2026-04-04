import type { AuthError } from "firebase/auth";

export function formatAuthError(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as AuthError).code;
    const map: Record<string, string> = {
      "auth/email-already-in-use": "That email is already registered.",
      "auth/invalid-email": "Enter a valid email address.",
      "auth/user-disabled": "This account has been disabled.",
      "auth/user-not-found": "No account found for that email.",
      "auth/wrong-password": "Incorrect password.",
      "auth/weak-password": "Password should be at least 6 characters.",
      "auth/invalid-credential": "Invalid email or password.",
      "auth/popup-closed-by-user": "Sign-in was cancelled.",
      "auth/cancelled-popup-request": "Another sign-in is already open.",
      "auth/network-request-failed": "Network error. Check your connection.",
      "auth/too-many-requests": "Too many attempts. Try again later.",
      "auth/invalid-action-code": "This link is invalid or has expired.",
      "auth/expired-action-code": "This link has expired. Request a new one.",
    };
    if (code && map[code]) return map[code];
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}
