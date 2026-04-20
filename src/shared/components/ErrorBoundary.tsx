import React, { useState } from "react";
import {
  useRouteError,
  useNavigate,
  isRouteErrorResponse,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  RotateCcw,
  Home,
  Compass,
  AlertCircle,
  Terminal,
  Layers,
} from "lucide-react";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Button } from "@/shared/design-system/ui/Button";
import { Drawer } from "@/shared/design-system/ui/Drawer";

/**
 * 🏔️ ErrorBoundary
 *
 * A meditative, card-less error experience.
 * Features a circular-pulsing compass and a bottom-sheet diagnostic log.
 */
export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);

  // Determine error message
  let errorMessage = "An unexpected pause occurred in the flow.";
  let errorStatus = "Flow Interrupted";
  let stackTrace = "";

  if (isRouteErrorResponse(error)) {
    errorStatus = `${error.status} ${error.statusText}`;
    if (error.status === 404) {
      errorMessage =
        "The path you were seeking seems to have vanished into the ether.";
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
    stackTrace = error.stack || "";
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const words = ["PAUSE", "BREATHE", "REFLECT", "TRUST", "CALM", "RETURN"];
  const [wordIndex, setWordIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-base-100 overflow-hidden px-4">
      {/* 1. Ambient Background Aurora (Enhanced) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 90, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-full h-full rounded-full bg-primary/15 blur-[160px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -45, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -left-1/4 w-full h-full rounded-full bg-info/10 blur-[140px]"
        />
      </div>

      {/* 2. Meditative Floating Content (No Card) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg flex flex-col items-center text-center py-12"
      >
        {/* Living Compass Icon */}
        <div className="mb-12 relative group">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1, 1.15, 1],
              color: [
                "var(--color-primary)",
                "var(--color-info)",
                "var(--color-primary)",
              ],
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity, times: [0, 0.8, 0.9, 1] },
              color: { duration: 8, repeat: Infinity, times: [0, 0.5, 1] },
            }}
            className="h-32 w-32 flex items-center justify-center p-6 rounded-full bg-base-content/5 backdrop-blur-xl border border-base-content/10 active:scale-110 transition-transform cursor-pointer"
          >
            <Compass size={64} strokeWidth={1} />
          </motion.div>

          {/* Drifting status indicator */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 h-10 w-10 bg-warning rounded-full border-4 border-base-100 flex items-center justify-center text-warning-content shadow-lg shadow-warning/20"
          >
            <AlertCircle size={18} fill="currentColor" />
          </motion.div>
        </div>

        {/* Header with Dynamic Rotating Words */}
        <div className="flex flex-col gap-8 mb-14">
          <div className="flex flex-col items-center">
            <div className="relative h-20 md:h-24 flex items-center justify-center overflow-hidden w-full">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute text-5xl md:text-7xl font-black tracking-tighter text-base-content"
                >
                  {words[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-[10px] uppercase font-black tracking-[0.4em] text-primary mt-2">
              Momentary Flow Interrupted
            </span>
          </div>

          <p className="text-lg leading-relaxed text-base-content/40 italic px-4 font-medium max-w-sm mx-auto">
            "Don't worry—your progress is safely tucked away. Take a breath and
            find your way back."
          </p>
        </div>

        {/* Premium Actions Area */}
        <div className="w-full max-w-xs flex flex-col gap-4">
          <Button
            variant="primary"
            size="lg"
            height={68}
            className="w-full text-lg tracking-widest bg-base-content! text-base-100! shadow-2xl shadow-base-content/20 border-none font-black uppercase"
            onClick={handleGoHome}
            leftIcon={<Home size={22} />}
          >
            Return Home
          </Button>

          <button
            onClick={handleRefresh}
            className="group flex h-16 items-center justify-center gap-3 text-base-content/30 hover:text-primary transition-all font-bold text-sm uppercase tracking-[0.25em] active:scale-95"
          >
            <RotateCcw
              size={18}
              className="group-hover:-rotate-90 transition-transform duration-500"
            />
            Refresh the Flow
          </button>
        </div>

        {/* Inspector Trigger (Simplified) */}
        <button
          onClick={() => setIsLogDrawerOpen(true)}
          className="mt-16 group flex flex-col items-center gap-2 text-[10px] uppercase font-black tracking-[0.3em] text-base-content/15 hover:text-primary transition-all p-4"
        >
          <Layers
            size={14}
            className="group-hover:scale-125 transition-transform"
          />
          Inspect Flow diagnostics
        </button>
      </motion.div>

      {/* 3. Diagnostic Bottom Sheet (Drawer) */}
      <Drawer
        isOpen={isLogDrawerOpen}
        onClose={() => setIsLogDrawerOpen(false)}
        presentation="height"
        snapPoints={["90%"]}
        className="bg-base-200/90 backdrop-blur-3xl"
      >
        <div className="p-6 pb-20 flex flex-col gap-8 max-w-screen-sm mx-auto">
          {/* Log Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-base-content/5 rounded-2xl flex items-center justify-center text-primary">
                <Terminal size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight uppercase">
                  Flow Diagnostics
                </span>
                <span className="text-[10px] font-bold text-base-content/30 uppercase tracking-widest">
                  Incident ID:{" "}
                  {Math.random().toString(36).substr(2, 9).toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Log Content inside Squircle groups */}
          <div className="flex flex-col gap-4 text-left">
            {/* Error Type */}
            <Squircle cornerRadius={20} cornerSmoothing={0.99} asChild>
              <div className="bg-base-content/5 p-5 border border-base-content/5">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 block opacity-60">
                  Status Code
                </span>
                <p className="text-xl font-mono font-bold text-base-content/80 break-all">
                  {errorStatus}
                </p>
              </div>
            </Squircle>

            {/* Error Message */}
            <Squircle cornerRadius={20} cornerSmoothing={0.99} asChild>
              <div className="bg-base-content/5 p-5 border border-base-content/5">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 block opacity-60">
                  Message
                </span>
                <p className="text-[15px] font-medium text-base-content/70 leading-relaxed font-mono">
                  {errorMessage}
                </p>
              </div>
            </Squircle>

            {/* Stack Trace */}
            {stackTrace && (
              <Squircle cornerRadius={20} cornerSmoothing={0.99} asChild>
                <div className="bg-black/80 dark:bg-black p-6 border border-white/5 shadow-inner">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 block opacity-80">
                    Full Trace
                  </span>
                  <div className="max-h-60 overflow-y-auto no-scrollbar">
                    <pre className="text-[11px] font-mono text-emerald-400/50 whitespace-pre-wrap leading-relaxed">
                      {stackTrace}
                    </pre>
                  </div>
                </div>
              </Squircle>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};
