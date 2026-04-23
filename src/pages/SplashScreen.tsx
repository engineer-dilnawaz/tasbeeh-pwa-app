import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Text } from "@/shared/design-system/ui/Text";
import { useOnboardingStore } from "@/features/onboarding/onboardingStore";
import { AppLogo } from "@/shared/components/AppLogo";

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const hasCompleted = useOnboardingStore(
    (state) => state.hasCompletedOnboarding,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasCompleted) {
        navigate("/signin", { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [hasCompleted, navigate]);

  return (
    <div className="fixed inset-0 bg-base-100 flex flex-col items-center justify-between z-50 p-6 overflow-hidden">
      {/* Background Decorative Circles - Theme Aware */}
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] border border-base-content/5 rounded-full -translate-y-1/2 pointer-events-none z-0" />
      <div className="absolute top-[-220px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] border border-base-content/5 rounded-full -translate-y-1/2 pointer-events-none z-0" />

      {/* Center Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
        >
          <AppLogo size={120} text="ذِكْر" />
        </motion.div>

        <div className="flex flex-col items-center gap-3">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Text
              variant="heading"
              className="text-[32px] font-bold text-base-content tracking-tight"
            >
              Tasbeeh <span className="text-primary">Flow</span>
            </Text>
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Text className="text-base-content/60 text-[16px] font-medium tracking-wide text-center px-8">
              Elevate your Zikr, find your focus.
            </Text>
          </motion.div>
        </div>
      </div>

      {/* Modern Horizontal Loader */}
      <div className="w-full max-w-[140px] pb-12">
        <div className="h-1.5 w-full bg-base-content/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="h-full bg-primary"
          />
        </div>
      </div>
    </div>
  );
};
