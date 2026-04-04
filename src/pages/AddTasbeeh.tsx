import { motion } from "framer-motion";
import { SquircleCard } from "@/shared/components/SquircleCard";

export default function AddTasbeeh() {
  return (
    <motion.main
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      className="screen-pad"
    >
      <h1 className="screen-title">Add Tasbeeh</h1>
      <SquircleCard style={{ marginTop: "16px" }}>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.5, fontSize: "14px" }}>
          Custom phrases, targets, and reordering will plug in here.
        </p>
      </SquircleCard>
    </motion.main>
  );
}
