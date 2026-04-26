import { AuthErrorCodes } from "firebase/auth";
import { AUTH_EN } from "../en";

/**
 * Maps Firebase Auth error codes to user-friendly localized messages.
 * 
 * @param code - The Firebase Auth error code
 * @param defaultMessage - Optional fallback if the code is unknown
 * @returns A localized error string
 */
export const getAuthErrorMessage = (code: string | undefined, defaultMessage: string = AUTH_EN.errors.unexpected): string => {
  if (!code) return defaultMessage;

  switch (code) {
    case AuthErrorCodes.USER_DELETED:
    case AuthErrorCodes.INVALID_PASSWORD:
    case "auth/invalid-login-credentials":
    case "auth/invalid-credential":
      return AUTH_EN.errors.invalid_credentials;
      
    case AuthErrorCodes.EMAIL_EXISTS:
      return AUTH_EN.errors.email_exists;
      
    case AuthErrorCodes.WEAK_PASSWORD:
      return AUTH_EN.errors.weak_password;
      
    default:
      return defaultMessage;
  }
};
