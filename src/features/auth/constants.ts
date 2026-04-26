/**
 * Centralized authentication constants for methods and flow types.
 */

export const AUTH_METHODS = {
  EMAIL: 'email',
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  GUEST: 'guest',
} as const;

export const AUTH_TYPES = {
  LOGIN: 'login',
  SIGNUP: 'signup',
} as const;
