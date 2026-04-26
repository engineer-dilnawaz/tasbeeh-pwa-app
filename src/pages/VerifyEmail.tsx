import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, RefreshCw, LogOut, Send, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useAuth,
  sendVerificationEmail,
  reloadUser,
  signOutUser,
} from "@/services/firebase/auth";
import { Button, DecorativeBackground } from "@/shared/design-system";
import { toast } from "@/shared/design-system/ui/useToast";
import { TOAST_VARIANTS } from "@/shared/constants";
import { useAppLottie } from "@/shared/hooks/useAppLottie";

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { LottieView } = useAppLottie("CheckMark", {
    loop: true,
    autoplay: true,
  });

  // If user somehow gets here but is already verified or logged out, send them home/signin
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    } else if (user.emailVerified) {
      navigate("/home");
    }
  }, [user, navigate]);

  // Countdown timer for resend button to prevent spam
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    try {
      await sendVerificationEmail();
      toast("Verification Sent", {
        variant: TOAST_VARIANTS.SUCCESS,
        description: "A new link has been sent to your inbox.",
      });
      setCountdown(60); // 1 minute cooldown
    } catch (error: any) {
      toast("Failed to Send", {
        variant: TOAST_VARIANTS.ERROR,
        description: error.message || "Something went wrong.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      const updatedUser = await reloadUser();
      if (updatedUser?.emailVerified) {
        toast("Verified!", {
          variant: TOAST_VARIANTS.SUCCESS,
          description: "Your email has been successfully verified.",
        });
        navigate("/home");
      } else {
        toast("Not Verified Yet", {
          variant: TOAST_VARIANTS.INFO,
          description: "Please check your email and click the link first.",
        });
      }
    } catch (error: any) {
      console.error("Verification check failed", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-base-100 overflow-hidden px-6 text-base-content">
      <DecorativeBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[420px] text-center space-y-8"
      >
        {/* Icon Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-32 w-32 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary opacity-20 blur-3xl rounded-full" />
            <div className="relative z-10 w-full h-full scale-125">
              {LottieView}
            </div>
          </div>
          <h1 className="text-3xl font-medium tracking-tight">
            Verify your email
          </h1>
          <p className="text-base text-base-content/60 px-4">
            We've sent a verification link to{" "}
            <span className="font-semibold text-base-content/90">
              {user?.email}
            </span>
            . Please check your inbox to continue.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleCheckStatus}
            isLoading={isChecking}
            className="h-14 text-lg"
            leftIcon={<Check size={20} />}
          >
            I've Verified
          </Button>

          <Button
            variant="ghost"
            onClick={handleResend}
            disabled={countdown > 0 || isResending}
            className="h-12"
            leftIcon={
              isResending ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )
            }
          >
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend Link"}
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="pt-4 border-t border-base-content/5">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="h-12 text-sm opacity-60 hover:opacity-100"
            leftIcon={<LogOut size={16} />}
          >
            Sign out and use another email
          </Button>
        </div>
      </motion.div>

      {/* Help Link */}
      <div className="fixed bottom-10 text-sm text-base-content/30">
        Need help?{" "}
        <a
          href="mailto:support@tasbeehflow.app"
          className="underline underline-offset-4"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};
