import { motion } from "framer-motion";
import { SquircleCard } from "@/shared/components/SquircleCard";
import { useTasbeehStore } from "@/features/tasbeeh/store/tasbeehStore";

export default function Stats() {
  const { streak, totalRecitations, tasbeehList, currentIndex, count } = useTasbeehStore();
  const active = tasbeehList[currentIndex];

  return (
    <motion.main
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      className="screen-pad"
    >
      <h1 className="screen-title">Stats</h1>
      <div className="today-stats" style={{ marginTop: "16px" }}>
        <div className="stat-item">
          <span className="stat-value">{streak}</span>
          <span className="stat-label">Day streak</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value">{totalRecitations}</span>
          <span className="stat-label">Total taps</span>
        </div>
      </div>
      <SquircleCard style={{ marginTop: "16px" }}>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>
          Current phrase
        </p>
        <p className="tasbeeh-arabic" dir="rtl">
          {active?.text ?? "—"}
        </p>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "8px" }}>
          Progress this set: {count} / {active?.target ?? "—"}
        </p>
      </SquircleCard>
    </motion.main>
  );
}
