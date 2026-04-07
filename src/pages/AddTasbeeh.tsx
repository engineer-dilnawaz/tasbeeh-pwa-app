import { motion } from "framer-motion";
import { SquircleCard } from "@/shared/components/SquircleCard";
import { useResolvedPalette } from "@/shared/components/ui/palette";
import { twUi } from "@/shared/lib/twUi";

export default function AddTasbeeh() {
  const palette = useResolvedPalette();
  return (
    <motion.main
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      className="px-3 py-2 pb-4"
    >
      <h1 className={twUi.screenTitle}>Add Tasbeeh</h1>
      <SquircleCard style={{ marginTop: "16px" }}>
        <p style={{ color: palette.textSecondary, lineHeight: 1.5, fontSize: "14px" }}>
          Custom phrases, targets, and reordering will plug in here.
        </p>
      </SquircleCard>
    </motion.main>
  );
}
