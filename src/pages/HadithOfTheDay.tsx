import { motion } from "framer-motion";
import { NavHeader } from "@/shared/components/NavHeader/NavHeader";
import { HADITH_OF_THE_DAY, getDayRotationIndex } from "@/shared/config/data";
import { useResolvedPalette } from "@/shared/components/ui/palette";
import { twUi } from "@/shared/lib/twUi";
import { useMemo } from "react";

export default function HadithOfTheDay() {
  const palette = useResolvedPalette();
  const hadithToday = useMemo(
    () => HADITH_OF_THE_DAY[getDayRotationIndex(HADITH_OF_THE_DAY.length)],
    [],
  );

  return (
    <div className="min-h-dvh">
      <NavHeader title="Hadith of the Day" />

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-3 py-2 pb-4"
      >
        <div style={{ textAlign: "center", marginBottom: "32px", marginTop: "16px" }}>
          <p
            style={{
              color: palette.textMuted,
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            PROPHETIC TRADITIONS
          </p>
        </div>

        <div className="squircle-card">
          <p
            className={twUi.arabic}
            dir="rtl"
            style={{ fontSize: "24px", lineHeight: 1.7, marginBottom: "24px" }}
          >
            {hadithToday.arabic}
          </p>
          <div
            style={{
              padding: "16px",
              background: "rgba(148, 163, 184, 0.08)",
              borderRadius: "16px",
              border: `1px solid ${palette.border}`,
            }}
          >
            <p
              style={{
                fontSize: "15px",
                color: palette.textPrimary,
                fontWeight: 700,
                lineHeight: 1.6,
                marginBottom: "8px",
              }}
            >
              {hadithToday.english}
            </p>
            <p style={{ fontSize: "13px", color: palette.accent, fontWeight: 800 }}>
              — {hadithToday.source}
            </p>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
