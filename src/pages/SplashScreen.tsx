import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Text } from "@/shared/design-system/ui/Text";
import { useOnboardingStore } from "@/features/onboarding/onboardingStore";

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const hasCompleted = useOnboardingStore((state) => state.hasCompletedOnboarding);

  useEffect(() => {
    // Artificial delay for branding presence
    const timer = setTimeout(() => {
      if (hasCompleted) {
        navigate("/home", { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [hasCompleted, navigate]);

  return (
    <div className="fixed inset-0 bg-base-100 flex flex-col items-center justify-center z-50 p-6 overflow-hidden">
      {/* Background Ambient Glow */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-primary pointer-events-none"
      />

      <div className="relative flex flex-col items-center gap-6">
        {/* Logo Icon Mockup */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.23, 1, 0.32, 1],
            delay: 0.2 
          }}
          className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center border border-primary/20 shadow-2xl shadow-primary/20"
        >
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
             <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
          </div>
        </motion.div>

        <div className="flex flex-col items-center gap-1 overflow-hidden">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Text variant="heading" weight="black" className="text-4xl tracking-tight text-primary">
              Tasbeeh
            </Text>
          </motion.div>
          
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Text variant="caption" weight="medium" color="subtle" className="tracking-widest uppercase opacity-40">
              Spiritual Companion
            </Text>
          </motion.div>
        </div>
      </div>

      {/* Footer Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <div className="h-1 w-12 bg-primary/20 rounded-full overflow-hidden">
           <motion.div 
             initial={{ x: -100 }}
             animate={{ x: 100 }}
             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
             className="h-full w-12 bg-primary"
           />
        </div>
      </motion.div>
    </div>
  );
};
