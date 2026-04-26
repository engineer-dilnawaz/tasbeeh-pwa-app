import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, RefreshCw, LogOut, Send, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  useAuth, 
  sendVerificationEmail, 
  reloadUser, 
  signOutUser 
} from "@/services/firebase/auth";
import { Button, DecorativeBackground } from "@/shared/design-system";
import { toast } from "@/shared/design-system/ui/useToast";
import { TOAST_VARIANTS } from "@/shared/constants";

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [countdown, setCountdown] = useState(0);

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
          <div className="relative">
            <div className="absolute inset-0 bg-primary opacity-20 blur-2xl rounded-full" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Mail size={40} />
            </div>
          </div>
          <h1 className="text-3xl font-medium tracking-tight">Verify your email</h1>
          <p className="text-base text-base-content/60 px-4">
            We've sent a verification link to <span className="font-semibold text-base-content/90">{user?.email}</span>. 
            Please check your inbox to continue.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleCheckStatus}
            isLoading={isChecking}
            className="h-14 text-lg"
          >
            {isChecking ? "Checking..." : "I've Verified"}
            {!isChecking && <CheckCircle2 size={20} className="ml-2" />}
          </Button>

          <Button
            variant="ghost"
            onClick={handleResend}
            disabled={countdown > 0 || isResending}
            className="h-12"
          >
            {isResending ? (
              <RefreshCw size={18} className="animate-spin mr-2" />
            ) : (
              <Send size={18} className="mr-2" />
            )}
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend Link"}
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="pt-4 border-t border-base-content/5">
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full text-base-content/40 hover:text-base-content/70 transition-colors py-2"
          >
            <LogOut size={16} />
            Sign out and use another email
          </button>
        </div>
      </motion.div>

      {/* Help Link */}
      <div className="fixed bottom-10 text-sm text-base-content/30">
        Need help? <a href="mailto:support@tasbeehflow.app" className="underline underline-offset-4">Contact Support</a>
      </div>
    </div>
  );
};
