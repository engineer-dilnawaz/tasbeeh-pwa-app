/**
 * English localization strings for the Authentication feature.
 */
export const AUTH_EN = {
  toasts: {
    success_title: "Welcome back!",
    success_description: "Successfully signed in to your spiritual cloud.",
    account_created_title: "Account created successfully!",
    auth_failed_title: "Authentication Failed",
    signin_cancelled_title: "Sign In Cancelled",
    signin_cancelled_description: "You closed the sign-in window.",
    guest_signin_title: "Continuing as Guest",
    guest_signin_description: "Your progress will be saved locally on this device.",
  },
  errors: {
    unexpected: "An unexpected error occurred during authentication.",
    invalid_credentials: "Invalid email or password. Please try again.",
    email_exists: "This email is already registered. Try signing in instead.",
    weak_password: "The password is too weak. Please use a stronger password.",
  },
  reset_success: {
    drawer_title: "Check Your Email",
    title: "Reset Link Sent!",
    description_pre: "We've sent a password reset link to ",
    description_post: ". Please check your inbox and follow the instructions.",
    missing_email_label: "Didn't get the email?",
    missing_email_help: "Check your spam folder or wait a few minutes. If it still doesn't arrive, try sending it again.",
    back_to_login: "Back to Login",
  },
  guest: {
    display_name: "Guest",
    default_email: "guest@example.com",
  },
} as const;
