import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLottie } from "lottie-react";

import appLogoAnimation from "@/assets/lottie/app-logo.json";
import { useAuth } from "@/services/auth/useAuth";
import { preloadVideos } from "@/shared/utils/videoCache";
import {
  SPLASH_MIN_DURATION_MS,
  SPLASH_SESSION_STORAGE_KEY,
} from "@/shared/config/constants";
import { hasCompletedOnboarding } from "@/shared/utils/onboardingCompletion";

import video1 from "@/assets/videos/onboarding-1.mp4";
import video2 from "@/assets/videos/onboarding-2.mp4";
import video3 from "@/assets/videos/onboarding-3.mp4";
import video4 from "@/assets/videos/onboarding-4.mp4";

import styles from "./splash.module.css";

function hasSplashSeenThisSession(): boolean {
  try {
    return sessionStorage.getItem(SPLASH_SESSION_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export default function SplashScreen() {
  const navigate = useNavigate();
  const { status, user } = useAuth();
  const [minDurationDone, setMinDurationDone] = useState(() =>
    hasSplashSeenThisSession(),
  );

  const { View } = useLottie(
    {
      animationData: appLogoAnimation,
      loop: true,
      className: styles.lottieCanvas,
    },
    { width: "100%", height: "100%" },
  );

  // Trigger fire-and-forget caching in the background instantly
  useEffect(() => {
    preloadVideos([video1, video2, video3, video4]);
  }, []);

  useEffect(() => {
    if (minDurationDone) return;
    const id = window.setTimeout(
      () => setMinDurationDone(true),
      SPLASH_MIN_DURATION_MS,
    );
    return () => window.clearTimeout(id);
  }, [minDurationDone]);

  const authResolved = status !== "loading";

  useEffect(() => {
    if (!minDurationDone || !authResolved) return;
    try {
      sessionStorage.setItem(SPLASH_SESSION_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    if (user) {
      navigate("/home", { replace: true });
      return;
    }
    if (hasCompletedOnboarding()) {
      navigate("/sign-in", { replace: true });
      return;
    }
    navigate("/onboarding", { replace: true });
  }, [minDurationDone, authResolved, navigate, user]);

  return (
    <div className={styles.root} role="presentation">
      <div className={styles.lottie} aria-hidden>
        {View}
      </div>
    </div>
  );
}
