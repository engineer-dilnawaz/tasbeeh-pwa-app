import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useOnboardingStore } from "@/features/onboarding/onboardingStore";
import { Text } from "@/shared/design-system/ui/Text";
import { Button } from "@/shared/design-system/ui/Button";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { OnboardingIllustration } from "@/features/onboarding/components/OnboardingIllustration";
import { FeaturePill } from "@/features/onboarding/components/FeaturePill";

interface Slide {
  id: number;
  welcomeText: string;
  brandText: string;
  description: string;
  illustrationChar: string;
  pills: { icon: string; label: string; color: string }[];
}

const slides: Slide[] = [
  {
    id: 0,
    welcomeText: "Welcome to",
    brandText: "Tasbeeh Flow",
    description: "A calm, minimal space for your daily dhikr and remembrance.",
    illustrationChar: "ذِ",
    pills: [
      { icon: "📿", label: "Count", color: "#5B6BF0" },
      { icon: "🔥", label: "Streaks", color: "#3DB88A" },
      { icon: "📚", label: "Collect", color: "#5B6BF0" },
    ],
  },
  {
    id: 1,
    welcomeText: "Track Progress",
    brandText: "Build Habits",
    description:
      "Build consistency with meaningful insights and daily streaks.",
    illustrationChar: "كْ",
    pills: [
      { icon: "🎯", label: "Goals", color: "#3DB88A" },
      { icon: "📈", label: "Growth", color: "#5B6BF0" },
      { icon: "⭐", label: "Milestones", color: "#3DB88A" },
    ],
  },
  {
    id: 2,
    welcomeText: "Your Companion",
    brandText: "Pure & Peace",
    description:
      "No distractions, just you and your dhikr. Simple and focused.",
    illustrationChar: "ر",
    pills: [
      { icon: "☁️", label: "Offline", color: "#5B6BF0" },
      { icon: "✨", label: "Minimal", color: "#3DB88A" },
      { icon: "🤍", label: "Peace", color: "#5B6BF0" },
    ],
  },
];

export const Onboarding: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const complete = useOnboardingStore((state) => state.completeOnboarding);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      complete();
      navigate("/home", { replace: true });
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const onDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      handleNext();
    } else if (info.offset.x > threshold) {
      handlePrev();
    }
  };

  const current = slides[currentSlide];

  return (
    <div className="fixed inset-0 bg-base-100 flex flex-col items-center justify-between overflow-hidden">
      {/* Background Decorative Circles - Theme Aware */}
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] border border-base-content/5 rounded-full -translate-y-1/2 pointer-events-none z-0" />
      <div className="absolute top-[-220px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] border border-base-content/5 rounded-full -translate-y-1/2 pointer-events-none z-0" />

      {/* Top Bar */}
      <div className="relative w-full px-6 pt-14 flex justify-end z-30">
        <button
          onClick={() => {
            complete();
            navigate("/home", { replace: true });
          }}
          className="text-base-content/40 text-sm font-medium hover:text-base-content transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main Content with Swipe Gesture */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDragEnd={onDragEnd}
        className="relative z-10 flex-1 w-full flex flex-col items-center justify-center gap-10 px-6 max-w-md cursor-grab active:cursor-grabbing touch-none"
      >
        {/* Illustration Section */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
              transition={{ duration: 0.5, ease: "backOut" }}
            >
              <OnboardingIllustration centerChar={current.illustrationChar} />
            </motion.div>
          </AnimatePresence>

          {/* Peek Slide Decoration */}
          <div className="absolute top-1/2 -right-24 w-48 h-48 bg-primary opacity-[0.06] rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Text Content Section */}
        <div className="flex flex-col items-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <Text
                variant="heading"
                className="text-[28px] font-bold text-base-content leading-tight"
              >
                {current.welcomeText}
              </Text>
              <Text
                variant="heading"
                className="text-[28px] font-bold text-primary leading-tight mb-4"
              >
                {current.brandText}
              </Text>
              <Text
                variant="body"
                className="text-base-content/60 text-[16px] leading-[1.4] max-w-[280px]"
              >
                {current.description}
              </Text>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {current.pills.map((pill, idx) => (
            <FeaturePill
              key={`${currentSlide}-${idx}`}
              {...pill}
              delay={0.3 + idx * 0.1}
            />
          ))}
        </div>
      </motion.div>

      {/* Footer Navigation - Pushed to absolute bottom */}
      <div className="w-full px-6 pb-6 flex flex-col items-center gap-10">
        {/* Pagination Dots - Smooth Animated Selection */}
        <div className="flex gap-2.5">
          {slides.map((_, i) => {
            const isActive = i === currentSlide;
            return (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  width: isActive ? 32 : 8,
                  backgroundColor: isActive ? "var(--color-primary)" : "var(--color-base-content-20)",
                  opacity: isActive ? 1 : 0.4,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="h-2 rounded-full"
              />
            );
          })}
        </div>

        {/* Action Button - Explicit Squircle Wrapper */}
        <div className="w-full max-w-[350px]">
          <Squircle cornerRadius={18} cornerSmoothing={0.99} asChild>
            <Button
              size="lg"
              className="bg-primary text-primary-content !h-[64px] !rounded-none"
              rightIcon={<ArrowRight size={22} className="opacity-90" />}
              onClick={handleNext}
            >
              <span className="text-[17px] font-bold tracking-tight">
                {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
              </span>
            </Button>
          </Squircle>
        </div>
      </div>
    </div>
  );
};
