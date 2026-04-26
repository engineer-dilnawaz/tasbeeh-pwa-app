import { identifyUser, logAppEvent, setProfileProperties } from "@/services/firebase/analytics";
import { ANALYTICS_EVENTS } from "@/services/firebase/analyticsEvents";
import type { User } from "firebase/auth";
import type { AuthMethod, AuthType } from "../types";
import { AUTH_TYPES } from "../constants";

/**
 * Tracks a successful authentication (Login or Signup).
 */
export const trackAuthSuccess = (user: User, method: AuthMethod) => {
  identifyUser(user.uid);

  setProfileProperties({
    login_method: method,
    is_verified: user.emailVerified,
    account_created_at: user.metadata.creationTime || null,
    last_login_at: user.metadata.lastSignInTime || null,
  });

  logAppEvent(ANALYTICS_EVENTS.AUTH_SUCCESS, { 
    method,
    type: user.metadata.creationTime === user.metadata.lastSignInTime ? AUTH_TYPES.SIGNUP : AUTH_TYPES.LOGIN
  });
};

/**
 * Tracks an authentication failure.
 */
export const trackAuthFailure = (
  error: string, 
  method: AuthMethod, 
  type: AuthType
) => {
  logAppEvent(ANALYTICS_EVENTS.AUTH_FAILURE, {
    method,
    type,
    error_message: error
  });
};

/**
 * Tracks when a user initiates a password reset request.
 */
export const trackPasswordResetRequested = (email: string) => {
  logAppEvent(ANALYTICS_EVENTS.PASSWORD_RESET_REQUESTED, {
    email_domain: email.split('@')[1]
  });
};

/**
 * Tracks when a user successfully logs out.
 */
export const trackLogout = () => {
  identifyUser(null);
  logAppEvent(ANALYTICS_EVENTS.LOGOUT);
};
