import { motion } from "framer-motion";
import { NavHeader } from "@/shared/components/NavHeader/NavHeader";
import { Compass, RotateCw } from "lucide-react";
import { useResolvedPalette } from "@/shared/components/ui/palette";

export default function QiblaFinder() {
  const palette = useResolvedPalette();
  return (
    <div className="min-h-dvh">
      <NavHeader title="Qibla Finder" />

      <motion.main
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="px-3 py-2 pb-4"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "80vh",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p
            style={{
              color: palette.textMuted,
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            FIND THE KAABA
          </p>
        </div>

        <div
          style={{
            position: "relative",
            width: "240px",
            height: "240px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              border: `2px solid ${palette.border}`,
              borderRadius: "50%",
            }}
          />
          <motion.div
            animate={{ rotate: [0, 45, 0, -45, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "200px",
              height: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Compass size={120} style={{ color: palette.accent }} />
          </motion.div>

          <div
            style={{
              position: "absolute",
              top: "-10px",
              width: "12px",
              height: "12px",
              background: "#f87171",
              borderRadius: "50%",
              boxShadow: "0 0 10px rgba(248, 113, 113, 0.5)",
            }}
          />
        </div>

        <div
          className="squircle-card"
          style={{ marginTop: "64px", textAlign: "center", width: "100%" }}
        >
          <h3 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "8px" }}>
            124.5° SE
          </h3>
          <p style={{ fontSize: "14px", color: palette.textMuted }}>
            Direction of Qibla from current location
          </p>
          <button
            type="button"
            style={{
              marginTop: "20px",
              background: palette.surfaceRaised,
              border: `1px solid ${palette.border}`,
              padding: "12px 20px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: 700,
              color: palette.textPrimary,
            }}
          >
            <RotateCw size={18} />
            Recalibrate
          </button>
        </div>

        <p
          style={{
            marginTop: "32px",
            fontSize: "12px",
            color: palette.textMuted,
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          Best results when device is flat on a level surface.
        </p>
      </motion.main>
    </div>
  );
}
