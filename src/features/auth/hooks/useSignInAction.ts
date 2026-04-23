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
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { type SignInValues, type SignUpValues } from "../authSchemas";

export function useSignInAction() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = (message: string = "Welcome back!") => {
    toast(message, {
      variant: "success",
      description: "Successfully signed in to your spiritual cloud.",
    });
    navigate("/home");
  };

  const handleError = (error: any) => {
    console.error("Auth Action Error:", error);
    
    // Handle intentional cancellations with a gentle info toast
    if (error?.code === "auth/user-cancelled" || error?.code === "auth/popup-closed-by-user") {
      toast("Sign In Cancelled", {
        variant: "info",
        description: "You closed the sign-in window.",
      });
      return;
    }

    // Extract a user-friendly message
    let message = "An unexpected error occurred during authentication.";
    if (error?.code) {
      switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          message = "Invalid email or password. Please try again.";
          break;
        case "auth/email-already-in-use":
          message = "This email is already registered. Try signing in instead.";
          break;
        case "auth/weak-password":
          message = "The password is too weak. Please use a stronger password.";
          break;
        default:
          message = error.message || message;
      }
    }

    toast("Authentication Failed", {
      variant: "error",
      description: message,
    });
  };

  const onEmailSubmit = async (values: SignInValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await signInWithEmail(values.email, values.password);
      handleSuccess();
    } catch (err) {
      handleError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignUpSubmit = async (values: SignUpValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await signUpWithEmail(values.email, values.password, values.name);
      handleSuccess("Account created successfully!");
    } catch (err) {
      handleError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      handleSuccess();
    } catch (err) {
      handleError(err);
    }
  };

  const onFacebookSignIn = async () => {
    try {
      await signInWithFacebook();
      handleSuccess();
    } catch (err) {
      handleError(err);
    }
  };

  const onGuestSignIn = async () => {
    try {
      const user = await signInAsGuest();
      
      // Update local profile for Guest
      const setProfile = useSettingsStore.getState().setProfile;
      const guestHandle = generateRandomGuestName();
      
      setProfile({
        displayName: "Guest",
        username: `@${guestHandle}`,
        email: "guest@example.com"
      });

      toast("Continuing as Guest", {
        variant: "info",
        description: "Your progress will be saved locally on this device.",
      });
      navigate("/home");
    } catch (err) {
      handleError(err);
    }
  };

  const onResetPassword = async (email: string) => {
    setIsSubmitting(true);
    try {
      await sendPasswordReset(email);
      return true;
    } catch (error: any) {
      handleError(error);
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
