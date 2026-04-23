import {
  GuestDisclaimerSheet,
  SignInForm,
  SignUpForm,
  SocialAuthGroup,
} from "@/features/auth";
import { useSignInAction } from "@/features/auth/hooks/useSignInAction";
import { PillTabs } from "@/shared/design-system";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type AuthMode = "signin" | "signup";

export default function SignIn() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const {
    isSubmitting,
    onEmailSubmit,
    onSignUpSubmit,
    onGoogleSignIn,
    onFacebookSignIn,
    onGuestSignIn,
  } = useSignInAction();

  const authTabs = [
    { id: "signin" as const, label: "Sign In" },
    { id: "signup" as const, label: "Sign Up" },
  ];

  const [isGuestDrawerOpen, setIsGuestDrawerOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-16 bg-base-100 overflow-hidden px-6 pb-20 gap-8 text-base-content">
      {/* Background Decorative Circles - Theme Aware */}
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] border border-base-content/5 rounded-full -translate-y-1/2 pointer-events-none z-0" />
      <div className="absolute top-[-220px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] border border-base-content/5 rounded-full -translate-y-1/2 pointer-events-none z-0" />
      <div className="absolute top-1/2 -right-24 w-64 h-64 bg-primary opacity-[0.06] rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-[-100px] -left-24 w-80 h-80 bg-primary opacity-[0.04] rounded-full blur-3xl pointer-events-none z-0" />

      {/* Subtle Dot Pattern */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, var(--color-base-content) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Heading Section */}
      <div className="w-full max-w-[420px] text-center space-y-2 select-none">
        <motion.h1
          key={mode + "-title"}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "tween",
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
          }}
          className="text-3xl font-medium text-black dark:text-white"
        >
          {mode === "signin" ? "Welcome Back" : "Create Account"}
        </motion.h1>
        <motion.p
          key={mode + "-subtitle"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "tween",
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.1,
          }}
          style={{
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
          }}
          className="text-base text-gray-500"
        >
          {mode === "signin"
            ? "Your personal companion for spiritual consistency"
            : "Begin your journey of consistent spiritual practice"}
        </motion.p>
      </div>

      {/* Tabs Section */}
      <div className="w-full max-w-[420px]">
        <PillTabs
          options={authTabs}
          activeTab={mode}
          onChange={(id) => setMode(id)}
        />
      </div>

      <div className="relative z-10 w-full max-w-[420px] min-h-[500px]">
        <AnimatePresence initial={false}>
          {mode === "signin" ? (
            <motion.div
              key="signin-form"
              initial={{ opacity: 0, x: "100vw" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100vw", position: "absolute" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="w-full top-0 left-0 space-y-8"
            >
              <SignInForm onSubmit={onEmailSubmit} isLoading={isSubmitting} />

              <SocialAuthGroup
                onGoogle={onGoogleSignIn}
                onFacebook={onFacebookSignIn}
                onGuest={() => setIsGuestDrawerOpen(true)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="signup-form"
              initial={{ opacity: 0, x: "-100vw" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100vw", position: "absolute" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="w-full top-0 left-0 space-y-8"
            >
              <SignUpForm onSubmit={onSignUpSubmit} isLoading={isSubmitting} />

              <SocialAuthGroup
                onGoogle={onGoogleSignIn}
                onFacebook={onFacebookSignIn}
                onGuest={() => setIsGuestDrawerOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Guest Disclaimer Drawer */}
      <GuestDisclaimerSheet
        isOpen={isGuestDrawerOpen}
        onClose={() => setIsGuestDrawerOpen(false)}
        onProceed={onGuestSignIn}
      />
    </div>
  );
}
