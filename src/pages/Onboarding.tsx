import { useOnboardingStore } from "@/features/onboarding/onboardingStore";
import { Text } from "@/shared/design-system/ui/Text";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import slide1 from "@/assets/images/slide1.jpg";
import slide2 from "@/assets/images/slide2.jpg";
import slide3 from "@/assets/images/slide3.jpg";

const slides = [
  {
    title: "Find Your Calm",
    message:
      "A minimalist space for your daily Zikr. Focus on the remembrance of Allah with every tap.",
    image: slide1,
  },
  {
    title: "Track Your Journey",
    message:
      "Maintain consistency with daily streaks and spiritual insights designed to help you grow.",
    image: slide2,
  },
  {
    title: "Begin Your Path",
    message:
      "Experience the tactile feedback of physical prayer beads, right in the palm of your hand.",
    image: slide3,
  },
];

export const Onboarding: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const complete = useOnboardingStore((state) => state.completeOnboarding);

  // Swipe-to-Start Slider Logic
  const x = useMotionValue(0);
  const swipeWidth = 260; // Max distance for the slider
  useTransform(x, [0, swipeWidth], [1, 0]);
  useTransform(x, [0, swipeWidth], [1, 0.9]);
  const backgroundAlpha = useTransform(x, [0, swipeWidth], [0.1, 1]);

  // Hoist mask transforms to top level to avoid Rules of Hooks violation
  const maskImage = useTransform(
    x,
    (val) =>
      `linear-gradient(to right, transparent ${val}px, black ${val + 40}px)`,
  );
  const webkitMaskImage = useTransform(
    x,
    (val) =>
      `linear-gradient(to right, transparent ${val}px, black ${val + 40}px)`,
  );

  const handleDragEnd = () => {
    if (x.get() >= swipeWidth * 0.8) {
      complete();
      navigate("/home", { replace: true });
    }
  };

  const next = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col overflow-hidden">
      {/* ── Background Image Transition (Smooth Cross-fade) ──────────────── */}
      <AnimatePresence>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={slides[currentSlide].image} 
            alt="" 
            className="w-full h-full object-cover"
          />
          {/* Subtle Accent Overlays (Lightened since images have black edges) */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex-1 flex flex-col p-8 pt-20">
        {/* ── Progress Indicators ────────────────────────────────────────── */}
        <div className="flex gap-2 mb-12">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                width: i === currentSlide ? 40 : 10,
                backgroundColor:
                  i === currentSlide ? "#A855F7" : "rgba(255,255,255,0.4)",
              }}
              className="h-2.5 rounded-full transition-colors shadow-lg"
            />
          ))}
        </div>

        {/* ── Content Slider ─────────────────────────────────────────────── */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait" custom={currentSlide}>
            <motion.div
              key={currentSlide}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative flex flex-col gap-8 p-8 -m-8 rounded-[40px] bg-white/5 backdrop-blur-2xl border border-white/10"
            >
              <Text
                variant="heading"
                weight="black"
                className="text-6xl tracking-tighter leading-[0.9] text-white"
              >
                {slides[currentSlide].title}
              </Text>
              <Text
                variant="body"
                className="text-2xl leading-relaxed text-white/95 font-medium"
              >
                {slides[currentSlide].message}
              </Text>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Navigation ─────────────────────────────────────────────────── */}
        <footer className="mt-auto h-32 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {currentSlide < slides.length - 1 ? (
              // Standard Next/Prev Navigation
              <motion.div
                key="nav"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex items-center justify-between w-full"
              >
                {/* Previous Circle Button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={prev}
                  className={`w-14 h-14 rounded-full flex items-center justify-center bg-transparent border border-white/20 text-white transition-all ${
                    currentSlide === 0
                      ? "opacity-0 pointer-events-none"
                      : "opacity-100 hover:border-primary"
                  }`}
                >
                  <ChevronLeft size={24} />
                </motion.button>

                {/* Next Circle Button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={next}
                  className="w-14 h-14 rounded-full flex items-center justify-center bg-transparent border border-white/20 text-white hover:border-primary transition-all"
                >
                  <ChevronRight size={24} />
                </motion.button>
              </motion.div>
            ) : (
              // ── Swipe to Start Slider (Final Slide) ──────────────────────
              <motion.div
                key="finish"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex justify-center py-4"
              >
                <div className="relative w-full max-w-[320px] h-20 bg-base-200 rounded-full p-2 flex items-center border border-base-content/5 overflow-hidden">
                  <motion.div
                    style={{ maskImage, WebkitMaskImage: webkitMaskImage }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 italic"
                  >
                    <Text variant="caption">Slide to get started</Text>
                  </motion.div>

                  <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: swipeWidth }}
                    dragElastic={0.1}
                    style={{ x }}
                    onDragEnd={handleDragEnd}
                    className="h-16 w-16 bg-primary rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center shadow-xl z-10"
                  >
                    <ChevronRight
                      size={32}
                      strokeWidth={3}
                      className="text-white"
                    />
                  </motion.div>

                  <motion.div
                    style={{ opacity: backgroundAlpha }}
                    className="absolute left-0 top-0 bottom-0 bg-primary/10 rounded-full"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </footer>
      </div>
    </div>
  );
};
