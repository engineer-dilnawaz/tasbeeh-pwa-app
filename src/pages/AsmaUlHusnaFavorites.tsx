import { motion } from "framer-motion";
import { NavHeader } from "@/shared/components/NavHeader/NavHeader";
import { Heart, Volume2, Loader2 } from "lucide-react";
import { useAsmaUlHusna } from "@/features/tasbeeh/hooks/useAsmaUlHusna";
import { useTasbeehStore } from "@/features/tasbeeh/store/tasbeehStore";
import { resolveAsmaAudioUrl } from "@/features/tasbeeh/api/islamicApi";
import { useRef } from "react";

export default function AsmaUlHusnaFavorites() {
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
    <div className="page-container" style={{ background: "var(--bg-secondary)" }}>
      <NavHeader title="FAVORITES" />
      
      <audio ref={audioRef} hidden />

      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="screen-pad"
      >
        <div style={{ textAlign: "center", marginBottom: "32px", marginTop: "16px" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            YOUR DIVINE GALLERY
          </p>
        </div>

        {isPending && (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <Loader2 className="animate-spin" size={32} color="var(--accent)" />
          </div>
        )}

        {!isPending && favoriteNames.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
             <div style={{ padding: "24px", background: "var(--accent-subtle)", borderRadius: "32px", color: "var(--accent)" }}>
                <Heart size={48} strokeWidth={1} />
             </div>
             <p style={{ fontSize: "18px", color: "var(--text-muted)", fontWeight: 700, maxWidth: "240px" }}>
               No names favorited yet. Tap the heart while reciting.
             </p>
          </div>
        )}

        {favoriteNames.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {favoriteNames.map((n) => (
              <motion.div 
                key={n.number} 
                className="squircle-card" 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  padding: "20px",
                  background: "var(--bg-primary)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "var(--accent-subtle)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", fontSize: "15px", fontWeight: 900 }}>
                    {n.number}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>{n.transliteration}</span>
                    <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 700 }}>{n.translation}</span>
                  </div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button 
                    onClick={() => playAudio(n.audio)}
                    style={{ padding: "10px", borderRadius: "12px", background: "var(--bg-secondary)", color: "var(--accent)", border: "none" }}
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
