import { motion } from "framer-motion";
import { NavHeader } from "@/shared/components/NavHeader/NavHeader";
import { HADITH_OF_THE_DAY, getDayRotationIndex } from "@/shared/config/data";
import { useMemo } from "react";

export default function HadithOfTheDay() {
  const hadithToday = useMemo(
    () => HADITH_OF_THE_DAY[getDayRotationIndex(HADITH_OF_THE_DAY.length)],
    [],
  );

  return (
    <div className="page-container">
      <NavHeader title="Hadith of the Day" />
      
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="screen-pad"
      >
        <div style={{ textAlign: "center", marginBottom: "32px", marginTop: "16px" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            PROPHETIC TRADITIONS
          </p>
        </div>

        <div className="squircle-card">
          <p className="tasbeeh-arabic" dir="rtl" style={{ fontSize: "24px", lineHeight: 1.7, marginBottom: "24px" }}>
            {hadithToday.arabic}
          </p>
          <div style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "16px", border: "1px solid var(--border)" }}>
            <p style={{ fontSize: "15px", color: "var(--text-primary)", fontWeight: 700, lineHeight: 1.6, marginBottom: "8px" }}>
              {hadithToday.english}
            </p>
            <p style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 800 }}>
              — {hadithToday.source}
            </p>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
