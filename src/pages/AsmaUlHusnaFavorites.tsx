import { motion } from "framer-motion";
import { NavHeader } from "@/shared/components/NavHeader/NavHeader";
import { Heart, Volume2, Loader2 } from "lucide-react";
import { useAsmaUlHusna } from "@/features/tasbeeh/hooks/useAsmaUlHusna";
import { useTasbeehStore } from "@/features/tasbeeh/store/tasbeehStore";
import { resolveAsmaAudioUrl } from "@/features/tasbeeh/api/islamicApi";
import { useResolvedPalette } from "@/shared/components/ui/palette";
import { useRef } from "react";

export default function AsmaUlHusnaFavorites() {
  const palette = useResolvedPalette();
  const { data, isPending } = useAsmaUlHusna("en");
  const { favoriteAsmaNames, toggleFavoriteAsma } = useTasbeehStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const favoriteNames = (data?.names || []).filter(n => favoriteAsmaNames.includes(n.number));

  const playAudio = (audioUrl: string) => {
    if (!audioUrl) return;
    if (audioRef.current) {
      audioRef.current.src = resolveAsmaAudioUrl(audioUrl);
      audioRef.current.play().catch(console.error);
    }
  };

  return (
    <div className="min-h-dvh" style={{ background: palette.surfaceRaised }}>
      <NavHeader title="FAVORITES" />
      
      <audio ref={audioRef} hidden />

      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-3 py-2 pb-4"
      >
        <div style={{ textAlign: "center", marginBottom: "32px", marginTop: "16px" }}>
          <p style={{ color: palette.textMuted, fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            YOUR DIVINE GALLERY
          </p>
        </div>

        {isPending && (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <Loader2 className="animate-spin" size={32} color={palette.accent} />
          </div>
        )}

        {!isPending && favoriteNames.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
             <div style={{ padding: "24px", background: palette.accentSubtle, borderRadius: "32px", color: palette.accent }}>
                <Heart size={48} strokeWidth={1} />
             </div>
             <p style={{ fontSize: "18px", color: palette.textMuted, fontWeight: 700, maxWidth: "240px" }}>
               No names favorited yet. Tap the heart while reciting.
             </p>
          </div>
        )}

        {favoriteNames.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {favoriteNames.map((n) => (
              <motion.div 
                key={n.number} 
                className="rounded-[22px] border border-slate-200 bg-white py-4 pl-5 pr-5 dark:border-slate-600 dark:bg-slate-900/80"
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: palette.accentSubtle, display: "flex", alignItems: "center", justifyContent: "center", color: palette.accent, fontSize: "15px", fontWeight: 900 }}>
                    {n.number}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "18px", fontWeight: 800, color: palette.textPrimary }}>{n.transliteration}</span>
                    <span style={{ fontSize: "13px", color: palette.textMuted, fontWeight: 700 }}>{n.translation}</span>
                  </div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button 
                    onClick={() => playAudio(n.audio)}
                    style={{ padding: "10px", borderRadius: "12px", background: palette.surfaceRaised, color: palette.accent, border: "none" }}
                  >
                    <Volume2 size={20} />
                  </button>
                  <button 
                    onClick={() => toggleFavoriteAsma(n.number)}
                    style={{ padding: "10px", borderRadius: "12px", background: "rgba(255, 59, 48, 0.1)", color: "#ff3b30", border: "none" }}
                  >
                    <Heart size={20} fill="currentColor" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.main>
    </div>
  );
}
