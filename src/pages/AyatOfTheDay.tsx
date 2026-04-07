import { motion } from "framer-motion";
import { NavHeader } from "@/shared/components/NavHeader/NavHeader";
import { AYAT_OF_THE_DAY, getDayRotationIndex } from "@/shared/config/data";
import { useResolvedPalette } from "@/shared/components/ui/palette";
import { twUi } from "@/shared/lib/twUi";
import { useMemo } from "react";

export default function AyatOfTheDay() {
  const palette = useResolvedPalette();
  const ayatToday = useMemo(
    () => AYAT_OF_THE_DAY[getDayRotationIndex(AYAT_OF_THE_DAY.length)],
    [],
  );

  return (
    <div className="min-h-dvh">
      <NavHeader title="Ayat of the Day" />

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
            DAILY QURANIC WISDOM
          </p>
        </div>

        <div className="squircle-card">
          <p
            className={twUi.arabic}
            dir="rtl"
            style={{ fontSize: "28px", lineHeight: 1.8, marginBottom: "20px" }}
          >
            {ayatToday.arabic}
          </p>
          <p style={{ fontSize: "16px", color: palette.textPrimary, fontWeight: 700, marginBottom: "8px" }}>
            {ayatToday.english}
          </p>
          <p style={{ fontSize: "13px", color: palette.accent, fontWeight: 800 }}>{ayatToday.source}</p>
        </div>
      </motion.main>
    </div>
  );
}
