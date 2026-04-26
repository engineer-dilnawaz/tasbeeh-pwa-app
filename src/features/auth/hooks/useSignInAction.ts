import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/shared/design-system/ui/useToast";
import { 
  signInWithEmail, 
  signUpWithEmail,
  signInWithGoogle, 
  signInWithFacebook, 
  signInAsGuest,
  generateRandomGuestName,
  sendPasswordReset
} from "@/services/firebase/auth";
import { AuthErrorCodes } from "firebase/auth";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { type SignInValues, type SignUpValues } from "../authSchemas";
import { type AuthMethod, type AuthType } from "../types";
import { AUTH_EN } from "../en";
import { trackAuthSuccess, trackAuthFailure, trackPasswordResetRequested } from "../utils/authAnalytics";

import { logger } from "@/shared/utils/logger";

import { TOAST_VARIANTS } from "@/shared/constants";

import { getAuthErrorMessage } from "../utils/authErrors";

import { AUTH_METHODS, AUTH_TYPES } from "../constants";

import { APP_ROUTES } from "@/shared/routes";

export function useSignInAction() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = (message: string = AUTH_EN.toasts.success_title) => {
    toast(message, {
      variant: TOAST_VARIANTS.SUCCESS,
      description: AUTH_EN.toasts.success_description,
    });
    navigate(APP_ROUTES.HOME);
  };

  const handleError = (error: any, method: AuthMethod, type: AuthType) => {
    logger.error("Auth Action Error:", error);
    
    // Track failure in analytics
    trackAuthFailure(error.message || String(error), method, type);

    // Handle intentional cancellations with a gentle info toast
    if (error?.code === AuthErrorCodes.USER_CANCELLED || error?.code === AuthErrorCodes.POPUP_CLOSED_BY_USER) {
      toast(AUTH_EN.toasts.signin_cancelled_title, {
        variant: TOAST_VARIANTS.INFO,
        description: AUTH_EN.toasts.signin_cancelled_description,
      });
      return;
    }

    // Extract a user-friendly message using our centralized mapper
    const message = getAuthErrorMessage(error?.code, error.message);

    toast(AUTH_EN.toasts.auth_failed_title, {
      variant: TOAST_VARIANTS.ERROR,
      description: message,
    });
  };

  const onEmailSubmit = async (values: SignInValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const user = await signInWithEmail(values.email, values.password);
      trackAuthSuccess(user, AUTH_METHODS.EMAIL);
      handleSuccess();
    } catch (err) {
      handleError(err, AUTH_METHODS.EMAIL, AUTH_TYPES.LOGIN);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignUpSubmit = async (values: SignUpValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Pre-hydrate store so useAuth has the correct data for createUserProfile
      const setProfile = useSettingsStore.getState().setProfile;
      setProfile({
        displayName: values.name,
        email: values.email,
        username: `@${values.email.split("@")[0]}`, // Initial suggestion
      });

      const user = await signUpWithEmail(values.email, values.password, values.name);
      trackAuthSuccess(user, AUTH_METHODS.EMAIL);
      handleSuccess(AUTH_EN.toasts.account_created_title);
    } catch (err) {
      handleError(err, AUTH_METHODS.EMAIL, AUTH_TYPES.SIGNUP);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      trackAuthSuccess(user, AUTH_METHODS.GOOGLE);
      handleSuccess();
    } catch (err) {
      handleError(err, AUTH_METHODS.GOOGLE, AUTH_TYPES.LOGIN);
    }
  };

  const onFacebookSignIn = async () => {
    try {
      const user = await signInWithFacebook();
      trackAuthSuccess(user, AUTH_METHODS.FACEBOOK);
      handleSuccess();
    } catch (err) {
      handleError(err, AUTH_METHODS.FACEBOOK, AUTH_TYPES.LOGIN);
    }
  };

  const onGuestSignIn = async () => {
    try {
      // Update local profile for Guest BEFORE signing in
      const setProfile = useSettingsStore.getState().setProfile;
      const guestHandle = generateRandomGuestName();
      
      setProfile({
        displayName: AUTH_EN.guest.display_name,
        username: `@${guestHandle}`,
        email: AUTH_EN.guest.default_email
      });

      const user = await signInAsGuest();
      trackAuthSuccess(user, AUTH_METHODS.GUEST);
      
      toast(AUTH_EN.toasts.guest_signin_title, {
        variant: TOAST_VARIANTS.INFO,
        description: AUTH_EN.toasts.guest_signin_description,
      });
      navigate(APP_ROUTES.HOME);
    } catch (err) {
      handleError(err, AUTH_METHODS.GUEST, AUTH_TYPES.LOGIN);
    }
  };

  const onResetPassword = async (email: string) => {
    setIsSubmitting(true);
    trackPasswordResetRequested(email);
    try {
      await sendPasswordReset(email);
      return true;
    } catch (error: any) {
      handleError(error, AUTH_METHODS.EMAIL, AUTH_TYPES.LOGIN);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    onEmailSubmit,
    onSignUpSubmit,
    onGoogleSignIn,
    onFacebookSignIn,
    onGuestSignIn,
    onResetPassword,
  };
}
