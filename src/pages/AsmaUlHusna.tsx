import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavHeader } from "@/shared/components/NavHeader/NavHeader";
import { Heart, Volume2, Loader2, Languages } from "lucide-react";
import { useAsmaUlHusna } from "@/features/tasbeeh/hooks/useAsmaUlHusna";
import { resolveAsmaAudioUrl } from "@/features/tasbeeh/api/islamicApi";
import { useResolvedPalette } from "@/shared/components/ui/palette";
import { useTasbeehStore } from "@/features/tasbeeh/store/tasbeehStore";
import { useNavigate } from "react-router-dom";

export default function AsmaUlHusna() {
  const palette = useResolvedPalette();
  const navigate = useNavigate();
  const [lang, setLang] = useState<"en" | "ur">("en");

  const { data, isPending, isError } = useAsmaUlHusna(lang);
  const { favoriteAsmaNames, toggleFavoriteAsma } = useTasbeehStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHeartPulse, setShowHeartPulse] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isProgrammatic = useRef(false);

  const names = useMemo(() => data?.names || [], [data]);
  const currentName = names[currentIndex];
  const isFavorited = currentName && favoriteAsmaNames.includes(currentName.number);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  // Reset on lang change
  useEffect(() => {
    isProgrammatic.current = true;
    setCurrentIndex(0);
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
    setTimeout(() => { isProgrammatic.current = false; }, 300);
  }, [lang]);

  // Use IntersectionObserver so currentIndex updates AS the card scrolls into center,
  // not after the animation finishes. This is what makes scale/opacity feel instant.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || names.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammatic.current) return;
        // Find the most-visible card (highest ratio = most centered)
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) {
          const idx = Number((best.target as HTMLElement).dataset.index);
          setCurrentIndex((prev) => {
            if (prev !== idx) stopAudio();
            return idx;
          });
        }
      },
      {
        root: container,
        threshold: [0.5, 0.75, 1.0],
      }
    );

    container.querySelectorAll("[data-index]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [names, stopAudio]);

  const handleFavorite = useCallback(
    (event?: React.MouseEvent | React.TouchEvent) => {
      event?.stopPropagation();
      if (currentName) {
        const alreadyFav = favoriteAsmaNames.includes(currentName.number);
        toggleFavoriteAsma(currentName.number);
        if (!alreadyFav) {
          setShowHeartPulse(true);
          setTimeout(() => setShowHeartPulse(false), 800);
        }
      }
    },
    [currentName, favoriteAsmaNames, toggleFavoriteAsma]
  );

  const playAudio = useCallback(() => {
    if (!currentName?.audio) return;
    stopAudio();
    if (audioRef.current) {
      audioRef.current.src = resolveAsmaAudioUrl(currentName.audio);
      audioRef.current.play().catch(console.error);
    }
  }, [currentName, stopAudio]);

  useEffect(() => () => stopAudio(), [stopAudio, currentIndex]);

  return (
    <div
      style={{
        background: palette.surfaceRaised,
        overflow: "hidden",
        height: "100dvh",
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavHeader
        title="99 Names"
        rightElement={
          <div style={{ display: "flex", gap: "8px" }}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                stopAudio();
                setLang((l) => (l === "en" ? "ur" : "en"));
              }}
              style={{
                background: palette.bg,
                color: palette.accent,
                border: `1px solid ${palette.border}`,
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
                background: palette.accentSubtle,
                color: palette.accent,
                border: "none",
                borderRadius: "12px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Heart size={20} fill={favoriteAsmaNames.length > 0 ? "currentColor" : "none"} />
            </motion.button>
          </div>
        }
      />

      <audio ref={audioRef} hidden />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {isPending && <Loader2 className="animate-spin" size={40} color={palette.accent} />}
        {isError && (
          <p style={{ color: palette.accent, textAlign: "center" }}>
            The names are currently veiled.
          </p>
        )}

        {names.length > 0 && (
          <>
            {/*
              CSS SNAP CAROUSEL
              - scroll-snap-type handles all the snapping natively
              - IntersectionObserver fires DURING scroll to update currentIndex
              - Framer Motion only controls scale/opacity (purely visual, no layout)
            */}
            <div
              ref={scrollRef}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "16px",
                overflowX: "scroll",
                overflowY: "hidden",
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
                width: "100%",
                padding: "24px 0",
                WebkitOverflowScrolling: "touch",
                // Hide scrollbar
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {/* Left spacer — centers first card */}
              <div style={{ flexShrink: 0, width: "calc(50vw - 150px)", minWidth: "calc(50vw - 150px)" }} />

              {names.map((name, i) => {
                const isCenter = i === currentIndex;

                return (
                  <motion.div
                    key={`${name.number}-${lang}`}
                    data-index={i}
                    animate={{
                      scale: isCenter ? 1 : 0.84,
                      opacity: isCenter ? 1 : 0.38,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onDoubleClick={isCenter ? handleFavorite : undefined}
                    style={{
                      flexShrink: 0,
                      width: "300px",
                      height: "500px",
                      scrollSnapAlign: "center",
                      borderRadius: "32px",
                      background: palette.bg,
                      border: `1px solid ${palette.border}`,
                      boxShadow: "none",
                    scrollSnapStop: "always",
                      padding: "28px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      userSelect: "none",
                      pointerEvents: isCenter ? "auto" : "none",
                      position: "relative",
                      cursor: "pointer",
                    }}
                  >
                    {/* Heart pulse overlay */}
                    <AnimatePresence>
                      {showHeartPulse && isCenter && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1.6, opacity: 1 }}
                          exit={{ scale: 2.2, opacity: 0 }}
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
                          <Heart size={100} fill="currentColor" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Header row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "13px",
                          background: palette.accentSubtle,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: palette.accent,
                          fontSize: "15px",
                          fontWeight: 900,
                        }}
                      >
                        {name.number}
                      </div>
                      <motion.button
                        onClick={handleFavorite}
                        whileTap={{ scale: 1.4 }}
                        style={{
                          background: "none",
                          border: "none",
                          color: isFavorited ? "#ff3b30" : palette.textMuted,
                          cursor: "pointer",
                          padding: 0,
                          display: "flex",
                        }}
                      >
                        <Heart size={24} fill={isFavorited ? "currentColor" : "none"} strokeWidth={isFavorited ? 0 : 2} />
                      </motion.button>
                    </div>

                    {/* Arabic + transliteration */}
                    <div
                      style={{
                        textAlign: "center",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: "14px",
                      }}
                    >
                      <h1
                        style={{
                          fontSize: "64px",
                          lineHeight: 1.1,
                          margin: 0,
                          color: palette.textPrimary,
                          fontWeight: 400,
                          direction: "rtl",
                        }}
                      >
                        {name.name}
                      </h1>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <h2 style={{ fontSize: "17px", color: palette.accent, fontWeight: 800, margin: 0 }}>
                          {name.transliteration}
                        </h2>
                        <p
                          style={{
                            fontSize: lang === "ur" ? "19px" : "14px",
                            color: palette.textSecondary,
                            fontWeight: 600,
                            margin: 0,
                            direction: lang === "ur" ? "rtl" : "ltr",
                          }}
                        >
                          {name.translation}
                        </p>
                      </div>
                    </div>

                    {/* Meaning + audio */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <p
                        style={{
                          fontSize: "12px",
                          color: palette.textMuted,
                          textAlign: "center",
                          lineHeight: "1.6",
                          fontStyle: "italic",
                          margin: 0,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        "{name.meaning}"
                      </p>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            playAudio();
                          }}
                          whileTap={{ scale: 0.9 }}
                          style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "18px",
                            background: palette.accent,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: `0 8px 20px color-mix(in srgb, ${palette.accent} 35%, transparent)`,
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <Volume2 size={22} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Right spacer — centers last card */}
              <div style={{ flexShrink: 0, width: "calc(50vw - 150px)", minWidth: "calc(50vw - 150px)" }} />
            </div>

            <p
              style={{
                fontSize: "13px",
                color: palette.textMuted,
                fontWeight: 900,
                letterSpacing: "0.1em",
                marginTop: "0px",
              }}
            >
              {currentIndex + 1} / {names.length}
            </p>
          </>
        )}
      </main>

      {/* Hide webkit scrollbar */}
      <style>{`
        [style*="overflowX: scroll"]::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
