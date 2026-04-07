import { motion } from "framer-motion";
import { SquircleCard } from "@/shared/components/SquircleCard";
import { useTasbeehCatalog } from "@/features/tasbeeh/hooks/useTasbeeh";
import { useTasbeehStore } from "@/features/tasbeeh/store/tasbeehStore";
import { useResolvedPalette } from "@/shared/components/ui/palette";
import { twUi } from "@/shared/lib/twUi";

export default function Stats() {
  const palette = useResolvedPalette();
  const { data: tasbeehList = [] } = useTasbeehCatalog();
  const { streak, totalRecitations, currentIndex, count } = useTasbeehStore();
  const active = tasbeehList[currentIndex];

  return (
    <motion.main
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      className="px-3 py-2 pb-4"
    >
      <h1 className={twUi.screenTitle}>Stats</h1>
      <div
        className="mt-4 flex items-center justify-center gap-6 rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 dark:border-slate-600 dark:bg-slate-900/80"
      >
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">{streak}</span>
          <span className={`mt-0.5 text-[11px] font-bold uppercase tracking-wide ${twUi.mutedText}`}>
            Day streak
          </span>
        </div>
        <div className="h-10 w-px bg-slate-200 dark:bg-slate-600" />
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">{totalRecitations}</span>
          <span className={`mt-0.5 text-[11px] font-bold uppercase tracking-wide ${twUi.mutedText}`}>
            Total taps
          </span>
        </div>
      </div>
      <SquircleCard style={{ marginTop: "16px" }}>
        <p style={{ fontSize: "13px", color: palette.textMuted, marginBottom: "8px" }}>Current phrase</p>
        <p className={twUi.arabic} dir="rtl">
          {active?.text ?? "—"}
        </p>
        <p style={{ fontSize: "13px", color: palette.textSecondary, marginTop: "8px" }}>
          Progress this set: {count} / {active?.target ?? "—"}
        </p>
      </SquircleCard>
    </motion.main>
  );
}
