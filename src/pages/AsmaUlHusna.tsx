import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  type Variants,
} from "framer-motion";
import { NavHeader } from "@/shared/components/NavHeader/NavHeader";
import {
  Heart,
  Volume2,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Languages,
} from "lucide-react";
import { useAsmaUlHusna } from "@/features/tasbeeh/hooks/useAsmaUlHusna";
import { resolveAsmaAudioUrl } from "@/features/tasbeeh/api/islamicApi";
import { useTasbeehStore } from "@/features/tasbeeh/store/tasbeehStore";
import { useNavigate } from "react-router-dom";

// 🍱 Variants for snappy transitions
const cardVariants: Variants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 600 : -600,
    opacity: 0,
    scale: 0.8,
    rotate: direction > 0 ? 30 : -30,
  }),
  animate: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    zIndex: 10,
    transition: { type: "spring", stiffness: 200, damping: 24, mass: 0.8 },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -600 : 600,
    opacity: 0,
    scale: 0.9,
    rotate: direction > 0 ? -20 : 20,
    zIndex: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  }),
};

export default function AsmaUlHusna() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<"en" | "ur">("en");

  const { data, isPending, isError } = useAsmaUlHusna(lang);
  const { favoriteAsmaNames, toggleFavoriteAsma } = useTasbeehStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showHeartPulse, setShowHeartPulse] = useState(false);

  // 🍱 Axis-Locked Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Respond only to downward pull
  const bgScale1 = useTransform(y, [0, 200], [0.94, 1.0]);
  const bgTranslate1 = useTransform(y, [0, 200], [-15, 0]);

  const bgScale2 = useTransform(y, [0, 200], [0.88, 0.94]);
  const bgTranslate2 = useTransform(y, [0, 200], [-30, -10]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const names = data?.names || [];
  const currentName = names[currentIndex];
  const isFavorited =
    currentName && favoriteAsmaNames.includes(currentName.number);

  const handleSwipe = (newDirection: number) => {
    setDirection(newDirection);
    if (newDirection > 0 && currentIndex < names.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (newDirection < 0 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    x.set(0);
    y.set(0);
  };

  const handleFavorite = (event?: React.MouseEvent | React.TouchEvent) => {
    event?.stopPropagation();
    if (currentName) {
      const alreadyFav = favoriteAsmaNames.includes(currentName.number);
      toggleFavoriteAsma(currentName.number);
      if (!alreadyFav) {
        setShowHeartPulse(true);
        setTimeout(() => setShowHeartPulse(false), 800);
      }
    }
  };

  const playAudio = () => {
    if (!currentName?.audio) return;
    if (audioRef.current) {
      audioRef.current.src = resolveAsmaAudioUrl(currentName.audio);
      audioRef.current.play().catch(console.error);
    }
  };

  return (
    <div
      className="page-container"
      style={{
        background: "var(--bg-secondary)",
        overflow: "hidden",
        height: "100dvh",
      }}
    >
      <NavHeader
        title="99 Names"
        rightElement={
          <div style={{ display: "flex", gap: "8px" }}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setLang(lang === "en" ? "ur" : "en")}
              style={{
                background: "var(--bg-primary)",
                color: "var(--accent)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              <Languages size={16} />
              {lang.toUpperCase()}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/asma-ul-husna/favorites")}
              style={{
                background: "var(--accent-subtle)",
                color: "var(--accent)",
                border: "none",
                borderRadius: "12px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Heart
                size={20}
                fill={favoriteAsmaNames.length > 0 ? "currentColor" : "none"}
              />
            </motion.button>
          </div>
        }
      />

      <audio ref={audioRef} hidden />

      <motion.main
        className="screen-pad"
        style={{
          height: "calc(100dvh - 80px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {isPending && (
          <Loader2 className="animate-spin" size={40} color="var(--accent)" />
        )}

        {isError && (
          <div
            className="squircle-card"
            style={{ textAlign: "center", color: "var(--accent)" }}
          >
            The names are currently veiled.
          </div>
        )}

        {currentName && (
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "340px",
              height: "520px",
            }}
          >
            {currentIndex < names.length - 2 && (
              <motion.div
                style={{
                  position: "absolute",
                  inset: "0 20px",
                  background: "var(--bg-primary)",
                  borderRadius: "32px",
                  border: "1px solid var(--border)",
                  opacity: 0.15,
                  zIndex: 0,
                  scale: bgScale2,
                  y: bgTranslate2,
                }}
              />
            )}
            {currentIndex < names.length - 1 && (
              <motion.div
                style={{
                  position: "absolute",
                  inset: "0 10px",
                  background: "var(--bg-primary)",
                  borderRadius: "32px",
                  border: "1px solid var(--border)",
                  opacity: 0.35,
                  zIndex: 1,
                  scale: bgScale1,
                  y: bgTranslate1,
                }}
              />
            )}

            <AnimatePresence
              initial={false}
              custom={direction}
              mode="popLayout"
            >
              <motion.div
                key={`${currentIndex}-${lang}`}
                custom={direction}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 300 }}
                dragElastic={0.4}
                dragDirectionLock
                style={{
                  x,
                  y,
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "32px",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.12)",
                  border: "1px solid var(--border)",
                  background: "var(--bg-primary)",
                  cursor: "grab",
                  zIndex: 10,
                  borderRadius: "32px",
                  userSelect: "none",
                  touchAction: "none",
                }}
                onDrag={(_event, info) => {
                  // 🍱 Strict Directional Locking: Left, Right, or Down. No Up. No Diagonal.
                  if (info.offset.y < 0) {
                    y.set(0); // Kill Upward movement
                  }

                  const absX = Math.abs(info.offset.x);
                  const absY = Math.abs(info.offset.y);

                  // Axis locking refinement: if pulling down, kill horizontal jitter
                  if (absY > 20 && absY > absX) {
                    x.set(0);
                  } else if (absX > 20 && absX > absY) {
                    y.set(0);
                  }
                }}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 100) handleSwipe(-1);
                  else if (info.offset.x < -100) handleSwipe(1);
                  else {
                    x.set(0);
                    y.set(0);
                  }
                }}
                onDoubleClick={handleFavorite}
                whileDrag={{ scale: 1.01, cursor: "grabbing" }}
                className="squircle-card"
              >
                <AnimatePresence>
                  {showHeartPulse && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.8, opacity: 1 }}
                      exit={{ scale: 2.5, opacity: 0 }}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        x: "-50%",
                        y: "-50%",
                        zIndex: 100,
                        color: "#ff3b30",
                        pointerEvents: "none",
                      }}
                    >
                      <Heart size={120} fill="currentColor" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "14px",
                      background: "var(--accent-subtle)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent)",
                      fontSize: "16px",
                      fontWeight: 900,
                    }}
                  >
                    {currentName.number}
                  </div>
                  <motion.button
                    onClick={handleFavorite}
                    whileTap={{ scale: 1.4 }}
                    style={{
                      background: "none",
                      border: "none",
                      color: isFavorited ? "#ff3b30" : "var(--text-muted)",
                      cursor: "pointer",
                    }}
                  >
                    <Heart
                      size={28}
                      fill={isFavorited ? "currentColor" : "none"}
                      strokeWidth={isFavorited ? 0 : 2}
                    />
                  </motion.button>
                </div>

                <div
                  style={{
                    textAlign: "center",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "20px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "74px",
                      margin: 0,
                      color: "var(--text-primary)",
                      fontWeight: 400,
                      direction: "rtl",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {currentName.name}
                  </h1>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "20px",
                        color: "var(--accent)",
                        fontWeight: 800,
                        margin: 0,
                      }}
                    >
                      {currentName.transliteration}
                    </h2>
                    <p
                      style={{
                        fontSize: lang === "ur" ? "24px" : "16px",
                        color: "var(--text-secondary)",
                        fontWeight: 600,
                        direction: lang === "ur" ? "rtl" : "ltr",
                      }}
                    >
                      {currentName.translation}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--text-muted)",
                      textAlign: "center",
                      lineHeight: "1.6",
                      fontWeight: 500,
                      fontStyle: "italic",
                      height: "45px",
                      overflow: "hidden",
                    }}
                  >
                    "{currentName.meaning}"
                  </p>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <motion.button
                      onClick={(event) => {
                        event.stopPropagation();
                        playAudio();
                      }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "22px",
                        background: "var(--accent)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 10px 20px rgba(var(--accent-rgb), 0.3)",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Volume2 size={26} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {currentName && (
          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                fontWeight: 900,
                letterSpacing: "0.1em",
              }}
            >
              {currentIndex + 1} / {names.length}
            </p>
            <div
              style={{
                display: "flex",
                gap: "20px",
                marginTop: "16px",
                opacity: 0.2,
              }}
            >
              <ArrowLeft size={16} />
              <div
                style={{
                  width: "1px",
                  height: "16px",
                  background: "var(--border)",
                }}
              />
              <ArrowRight size={16} />
            </div>
          </div>
        )}
      </motion.main>
    </div>
  );
}
