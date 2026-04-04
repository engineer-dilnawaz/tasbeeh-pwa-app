import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  useState,
  useEffect,
  useRef,
  startTransition,
  useCallback,
} from "react";
import { useLottie } from "lottie-react";
import { useNavigate } from "react-router-dom";
import {
  hasCompletedOnboarding,
  setOnboardingCompleted,
} from "@/shared/utils/onboardingCompletion";
import styles from "./Onboarding.module.css";
import { Button } from "@/shared/components/Button";
import { getOrFetchVideo } from "@/shared/utils/videoCache";
import appLogoAnimation from "@/assets/lottie/app-logo.json";
import pluseArrowAnimation from "@/assets/lottie/pluse-arrow.json";

import video1 from "@/assets/videos/onboarding-1.mp4";
import video2 from "@/assets/videos/onboarding-2.mp4";
import video3 from "@/assets/videos/onboarding-3.mp4";
import video4 from "@/assets/videos/onboarding-4.mp4";

const VIDEOS = [video1, video2, video3, video4];

const TAGLINES = [
  "Quiet Your Mind",
  "Release Daily Stress",
  "Remember Allah Often",
  "Find Inner Peace",
];

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

/** Stack + button entrance after delay (kept in sync). */
const enterTransition = {
  duration: 0.35,
  ease: easeOut,
} as const;

/** Button exit, then stack reset — durations must match staged exit timers. */
const ctaExitTransition = {
  duration: 0.2,
  ease: easeOut,
} as const;

const stackResetTransition = {
  duration: 0.2,
  ease: easeOut,
} as const;

const CTA_EXIT_MS = ctaExitTransition.duration * 1000;
const STACK_RESET_MS = stackResetTransition.duration * 1000;

const stackVariants = {
  idle: { y: 0 },
  last: { y: -18 },
} as const;

/** Fixed to viewport bottom; y 100% = one self-height below edge, then slides to rest. */
const ctaVariants = {
  idle: {
    opacity: 0,
    y: "100%",
  },
  last: {
    opacity: 1,
    y: 0,
  },
} as const;

const LAST_SLIDE_INDEX = VIDEOS.length - 1;

/** After landing on last slide, tagline stays put; button enters after this delay. */
const PROCEED_REVEAL_MS = 300;

type LastExitPhase = "hidingCta" | "loweringStack";

/**
 * Isolated component so `useLottie` runs only when mounted (last slide). Default export
 * `<Lottie />` from `lottie-react` can resolve to a module object in some bundlers and crash.
 */
function ProceedPulseArrow({ autoplay }: { autoplay: boolean }) {
  const { View } = useLottie(
    {
      animationData: pluseArrowAnimation,
      loop: true,
      autoplay,
    },
    { width: 26, height: 26, display: "block" },
  );
  return View;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    if (hasCompletedOnboarding()) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);
  /**
   * Leaving last slide: index stays on last until CTA hides, stack rests, then we apply target.
   */
  const [lastExit, setLastExit] = useState<null | {
    phase: LastExitPhase;
    targetIndex: number;
    stackWasLifted: boolean;
  }>(null);
  /** Last slide only: false until PROCEED_REVEAL_MS after entering, then button animates in. */
  const [ctaReady, setCtaReady] = useState(false);
  const reduceMotion = useReducedMotion();
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isVideoBuffering, setIsVideoBuffering] = useState(true);
  const [resolvedVideoUrls, setResolvedVideoUrls] = useState<
    Record<number, string>
  >({});

  const isLastSlide = currentVideoIndex === LAST_SLIDE_INDEX;

  /** Stack lifted (-18px) only when last-slide “hero” is showing or while button hides (if it was lifted). */
  const stackLifted =
    isLastSlide &&
    (lastExit === null
      ? ctaReady
      : lastExit.phase === "hidingCta" && lastExit.stackWasLifted);

  const stackAnimate = stackLifted ? "last" : "idle";

  /** Proceed button visible (after reveal delay), hidden as soon as exit starts. */
  const ctaShown =
    isLastSlide && lastExit === null && ctaReady;

  const ctaAnimate = ctaShown ? "last" : "idle";

  const reserveSpaceForCta =
    (isLastSlide && ctaReady && lastExit === null) ||
    lastExit?.phase === "hidingCta";

  const leaveLastTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearLeaveLastTimeouts = () => {
    for (const id of leaveLastTimeoutsRef.current) {
      clearTimeout(id);
    }
    leaveLastTimeoutsRef.current = [];
  };

  const beginLeaveLastSlide = useCallback((targetIndex: number) => {
    if (lastExit) {
      return;
    }
    clearLeaveLastTimeouts();
    const stackWasLifted = ctaReady;
    setLastExit({ phase: "hidingCta", targetIndex, stackWasLifted });
    setCtaReady(false);

    const afterCtaMs = stackWasLifted ? CTA_EXIT_MS : 0;
    const afterStackMs = stackWasLifted ? STACK_RESET_MS : 0;

    const t1 = window.setTimeout(() => {
      setLastExit({
        phase: "loweringStack",
        targetIndex,
        stackWasLifted,
      });
      const t2 = window.setTimeout(() => {
        setCurrentVideoIndex(targetIndex);
        setLastExit(null);
      }, afterStackMs);
      leaveLastTimeoutsRef.current.push(t2);
    }, afterCtaMs);
    leaveLastTimeoutsRef.current.push(t1);
  }, [ctaReady, lastExit]);

  useEffect(
    () => () => {
      clearLeaveLastTimeouts();
    },
    [],
  );

  const { View: LoaderView } = useLottie(
    {
      animationData: appLogoAnimation,
      loop: true,
    },
    { width: 120, height: 120 },
  );

  const handleNext = () => {
    setCurrentVideoIndex((prev) => {
      if (prev === LAST_SLIDE_INDEX) {
        return prev;
      }
      return (prev + 1) % VIDEOS.length;
    });
  };

  const handlePrev = () => {
    if (lastExit) return;
    setCurrentVideoIndex((prev) => {
      if (prev === LAST_SLIDE_INDEX) {
        return prev;
      }
      return (prev - 1 + VIDEOS.length) % VIDEOS.length;
    });
  };

  useEffect(() => {
    if (!isLastSlide) {
      startTransition(() => {
        setCtaReady(false);
      });
      return;
    }
    startTransition(() => {
      setCtaReady(false);
    });
    const reveal = window.setTimeout(() => {
      startTransition(() => {
        setCtaReady(true);
      });
    }, PROCEED_REVEAL_MS);
    return () => clearTimeout(reveal);
  }, [isLastSlide]);

  useEffect(() => {
    let active = true;
    const id = requestAnimationFrame(() => setIsVideoBuffering(true));

    void getOrFetchVideo(VIDEOS[currentVideoIndex]).then((url) => {
      if (active) {
        setResolvedVideoUrls((prev) => ({ ...prev, [currentVideoIndex]: url }));
      }
    });

    return () => {
      active = false;
      cancelAnimationFrame(id);
    };
  }, [currentVideoIndex]);

  const videoSrc =
    resolvedVideoUrls[currentVideoIndex] ?? VIDEOS[currentVideoIndex];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    if (lastExit) {
      setTouchStartX(null);
      return;
    }
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      if (currentVideoIndex !== LAST_SLIDE_INDEX) {
        handleNext();
      }
    } else if (diff < -50) {
      if (currentVideoIndex === LAST_SLIDE_INDEX) {
        beginLeaveLastSlide(
          (LAST_SLIDE_INDEX - 1 + VIDEOS.length) % VIDEOS.length,
        );
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
  };

  return (
    <div
      className={styles.container}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence>
        {isVideoBuffering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.loaderWrapper}
          >
            {LoaderView}
          </motion.div>
        )}
      </AnimatePresence>

      <video
        key={currentVideoIndex}
        autoPlay
        muted
        playsInline
        loop={false}
        className={styles.videoBackground}
        src={videoSrc}
        onEnded={() => {
          if (currentVideoIndex === LAST_SLIDE_INDEX) {
            return;
          }
          handleNext();
        }}
        onTimeUpdate={(e) => {
          if (currentVideoIndex === LAST_SLIDE_INDEX) {
            return;
          }
          if (e.currentTarget.currentTime >= 8) {
            handleNext();
          }
        }}
        onWaiting={() => setIsVideoBuffering(true)}
        onCanPlay={() => setIsVideoBuffering(false)}
        onPlaying={() => setIsVideoBuffering(false)}
      />

      <div
        className={`${styles.overlayVideo} ${reserveSpaceForCta && isLastSlide ? styles.overlayVideoLastWithCta : ""}`}
        aria-hidden
      />

      <div
        className={`${styles.bottomContent} ${reserveSpaceForCta ? styles.bottomContentWithCta : ""}`}
      >
        <motion.div
          className={styles.bottomStack}
          variants={stackVariants}
          initial="idle"
          animate={stackAnimate}
          transition={
            stackAnimate === "last" ? enterTransition : stackResetTransition
          }
        >
          <div className={styles.taglineAndDots}>
            <div className={styles.taglineWrapper}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentVideoIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={styles.tagline}
                >
                  <h1 className={styles.taglineHeading}>
                    {TAGLINES[currentVideoIndex]
                      .split(" ")
                      .map((word, idx) => (
                        <span key={idx} className={styles.taglineLine}>
                          {word}
                        </span>
                      ))}
                  </h1>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className={styles.indicators}>
              {VIDEOS.map((_, i) => (
                <div
                  key={i}
                  className={`${styles.dot} ${i === currentVideoIndex ? styles.activeDot : ""}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={ctaVariants}
        initial="idle"
        animate={ctaAnimate}
        transition={
          ctaAnimate === "last" ? enterTransition : ctaExitTransition
        }
        className={styles.proceedWrap}
        aria-hidden={!ctaShown}
        style={{
          pointerEvents: ctaShown ? "auto" : "none",
        }}
      >
        <div className={styles.proceedBtnRing}>
          <Button
            variant="primary"
            fullWidth
            shape="squircle"
            type="button"
            onClick={() => {
              setOnboardingCompleted();
              navigate("/sign-in", { replace: true });
            }}
            rightIcon={
              isLastSlide ? (
                <span
                  className={`${styles.proceedLottieIcon} ${ctaShown ? styles.proceedLottieVisible : ""}`}
                  aria-hidden
                >
                  <ProceedPulseArrow autoplay={!reduceMotion} />
                </span>
              ) : undefined
            }
            className={styles.proceedBtn}
            tabIndex={ctaShown ? 0 : -1}
            disabled={!ctaShown}
            id="onboarding-proceed-btn"
          >
            Proceed
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
