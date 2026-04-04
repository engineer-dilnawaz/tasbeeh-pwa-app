import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, type Auth } from "firebase/auth";
import { EMAIL_FOR_SIGNIN_STORAGE_KEY } from "../constants";
import { getEmailLinkContinueUrl } from "../config";

export function buildEmailLinkActionCodeSettings() {
  return {
    url: getEmailLinkContinueUrl(),
    handleCodeInApp: true,
  };
}

export function sendEmailSignInLink(auth: Auth, email: string): Promise<void> {
  return sendSignInLinkToEmail(auth, email.trim(), buildEmailLinkActionCodeSettings());
}

export function storeEmailForSignIn(email: string): void {
  try {
    localStorage.setItem(EMAIL_FOR_SIGNIN_STORAGE_KEY, email.trim());
  } catch {
    /* ignore */
  }
}

export function readStoredEmailForSignIn(): string | null {
  try {
    return localStorage.getItem(EMAIL_FOR_SIGNIN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearStoredEmailForSignIn(): void {
  try {
    localStorage.removeItem(EMAIL_FOR_SIGNIN_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function isCurrentUrlEmailSignInLink(auth: Auth): boolean {
  if (typeof window === "undefined") return false;
  return isSignInWithEmailLink(auth, window.location.href);
}

export function completeSignInWithEmailLink(
  auth: Auth,
  email: string,
  emailLinkUrl: string,
): ReturnType<typeof signInWithEmailLink> {
  return signInWithEmailLink(auth, email.trim(), emailLinkUrl);
}
