import { motion } from "framer-motion";
import { NavHeader } from "@/shared/components/NavHeader/NavHeader";
import { AYAT_OF_THE_DAY, getDayRotationIndex } from "@/shared/config/data";
import { useMemo } from "react";

export default function AyatOfTheDay() {
  const ayatToday = useMemo(
    () => AYAT_OF_THE_DAY[getDayRotationIndex(AYAT_OF_THE_DAY.length)],
    [],
  );

  return (
    <div className="page-container">
      <NavHeader title="Ayat of the Day" />
      
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="screen-pad"
      >
        <div style={{ textAlign: "center", marginBottom: "32px", marginTop: "16px" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            DAILY QURANIC WISDOM
          </p>
        </div>

        <div className="squircle-card">
          <p className="tasbeeh-arabic" dir="rtl" style={{ fontSize: "28px", lineHeight: 1.8, marginBottom: "20px" }}>
            {ayatToday.arabic}
          </p>
          <p style={{ fontSize: "16px", color: "var(--text-primary)", fontWeight: 700, marginBottom: "8px" }}>
            {ayatToday.english}
          </p>
          <p style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 800 }}>
            {ayatToday.source}
          </p>
        </div>
      </motion.main>
    </div>
  );
}
