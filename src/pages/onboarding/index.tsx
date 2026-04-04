import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLottie } from "lottie-react";
import styles from "./Onboarding.module.css";
import { Button } from "@/shared/components/Button";
import { DESIGN } from "@/shared/constants/design.constants";
import { getOrFetchVideo } from "@/shared/utils/videoCache";
import appLogoAnimation from "@/assets/lottie/app-logo.json";

import video1 from "@/assets/videos/onboarding-1.mp4";
import video2 from "@/assets/videos/onboarding-2.mp4";
import video3 from "@/assets/videos/onboarding-3.mp4";
import video4 from "@/assets/videos/onboarding-4.mp4";

const VIDEOS = [video1, video2, video3, video4];

const TAGLINES = [
  "Quiet Your Mind",
  "Release Daily Stress",
  "Remember Allah Often",
  "Find Inner Peace"
];


// Custom Google G Icon since Lucide doesn't include brand logos like Google
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// Custom Facebook Icon since Lucide doesn't include brand logos
function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.294h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isVideoBuffering, setIsVideoBuffering] = useState(true);
  const [resolvedVideoUrls, setResolvedVideoUrls] = useState<Record<number, string>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  const { View: LoaderView } = useLottie(
    {
      animationData: appLogoAnimation,
      loop: true,
    },
    { width: 120, height: 120 }
  );

  const handleNext = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % VIDEOS.length);
  };

  const handlePrev = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + VIDEOS.length) % VIDEOS.length);
  };

  useEffect(() => {
    setIsVideoBuffering(true);
    let active = true;

    // Proactively fetch the video for the current slide from Cache
    getOrFetchVideo(VIDEOS[currentVideoIndex]).then(url => {
      if (active) {
        setResolvedVideoUrls(prev => ({ ...prev, [currentVideoIndex]: url }));
      }
    });

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((err) => console.log("Auto-play prevented", err));
    }

    return () => { active = false; };
  }, [currentVideoIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      handleNext(); // Swipe left
    } else if (diff < -50) {
      handlePrev(); // Swipe right
    }
    setTouchStartX(null);
  };

  const handleEmailLink = () => {
    navigate("/sign-in");
  };

  const handleGuest = () => {
    navigate("/home");
  };

  return (
    <div 
      className={styles.container}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Fallback Loader while video downloads */}
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

      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={styles.videoBackground}
        src={resolvedVideoUrls[currentVideoIndex] || ""}
        onEnded={handleNext}
        onTimeUpdate={(e) => {
          if (e.currentTarget.currentTime >= 8) {
            handleNext();
          }
        }}
        onWaiting={() => setIsVideoBuffering(true)}
        onCanPlay={() => setIsVideoBuffering(false)}
        onPlaying={() => setIsVideoBuffering(false)}
      />
      
      {/* Gradient Overlay for Text Readability */}
      <div className={styles.overlay} />

      {/* Top Header */}
      <header 
        className={styles.header}
        style={{
          paddingLeft: `${DESIGN.SPACING.HORIZONTAL.space24}px`,
          paddingRight: `${DESIGN.SPACING.HORIZONTAL.space24}px`,
          paddingTop: `${DESIGN.SPACING.VERTICAL.space16}px`,
        }}
      >
        <div 
          className={styles.logoGroup}
          style={{ gap: `${DESIGN.SPACING.HORIZONTAL.space12}px` }}
        >
          <img src="/apple-touch-icon.png" alt="Tasbeeh Flow Logo" className={styles.appLogo} />
          <span className={styles.appName}>Tasbeeh Flow</span>
        </div>
      </header>

      {/* Bottom Content Area */}
      <div 
        className={styles.bottomContent}
        style={{
          paddingLeft: `${DESIGN.SPACING.HORIZONTAL.space24}px`,
          paddingRight: `${DESIGN.SPACING.HORIZONTAL.space24}px`,
          bottom: `max(env(safe-area-inset-bottom), ${DESIGN.SPACING.VERTICAL.space32}px)`,
          gap: `${DESIGN.SPACING.VERTICAL.space32}px`,
        }}
      >
        {/* Calming Words & Indicators */}
        <div 
          className={styles.taglineAndDots}
          style={{ marginBottom: `${DESIGN.SPACING.VERTICAL.space8}px` }}
        >
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
                {TAGLINES[currentVideoIndex].split(" ").map((word, idx) => (
                  <h1 key={idx}>{word}</h1>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div 
            className={styles.indicators}
            style={{ 
              gap: `${DESIGN.SPACING.HORIZONTAL.space8}px`, 
              paddingBottom: `${DESIGN.SPACING.VERTICAL.space8}px` 
            }}
          >
            {VIDEOS.map((_, i) => (
              <div
                key={i}
                className={`${styles.dot} ${i === currentVideoIndex ? styles.activeDot : ""}`}
              />
            ))}
          </div>
        </div>

        {/* Auth Actions */}
        <div className={styles.actions} style={{ gap: `${DESIGN.SPACING.VERTICAL.space16}px` }}>
          <Button
            variant="primary"
            fullWidth
            shape="squircle"
            leftIcon={<Mail size={20} />}
            onClick={handleEmailLink}
            className={styles.mainActionBtn}
          >
            Continue with Email Link
          </Button>

          <div className={styles.socialRow} style={{ gap: `${DESIGN.SPACING.HORIZONTAL.space12}px` }}>
            <Button
              variant="glass"
              shape="pill"
              leftIcon={<GoogleIcon />}
              onClick={() => console.log("Google Auth")}
            />
            <Button
              variant="glass"
              shape="pill"
              leftIcon={<FacebookIcon />}
              onClick={() => console.log("Facebook Auth")}
            />
            <Button
              variant="glass"
              shape="pill"
              leftIcon={<Mail size={20} color="#ffffff" />}
              onClick={() => navigate("/sign-in")}
            />
          </div>

          <div className={styles.guestDivider} style={{ gap: `${DESIGN.SPACING.HORIZONTAL.space16}px`, marginTop: `${DESIGN.SPACING.VERTICAL.space8}px` }}>
            <div className={styles.line} />
            <button className={styles.guestBtn} onClick={handleGuest}>
              Continue as a guest
            </button>
            <div className={styles.line} />
          </div>

          <p className={styles.terms} style={{ marginTop: `${DESIGN.SPACING.VERTICAL.space4}px` }}>
            By proceeding your agree to <strong>Terms & Conditions</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
