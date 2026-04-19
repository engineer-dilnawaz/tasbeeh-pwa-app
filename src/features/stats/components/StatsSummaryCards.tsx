import { motion } from "framer-motion";
import { Hash, Target, TrendingUp, Repeat } from "lucide-react";
import { Card } from "@/shared/design-system/ui/Card";
import { Text } from "@/shared/design-system/ui/Text";
import { Squircle } from "@/shared/design-system/ui/Squircle";

interface StatsSummaryCardsProps {
  totalTaps: number;
  roundsCompleted: number;
  averagePerDay: number;
  totalDaysActive: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  iconBgClass: string;
  delay: number;
}

function StatCard({ icon, value, label, iconBgClass, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, type: "spring", bounce: 0.3 }}
      whileTap={{ scale: 0.98 }}
    >
      <Squircle cornerRadius={24} cornerSmoothing={0.99} asChild>
        <div className="h-full bg-white dark:bg-black p-5 shadow-sm border border-base-content/5">
          <div className="flex flex-col gap-3">
            <Squircle cornerRadius={12} cornerSmoothing={0.9} asChild>
              <div className={`flex items-center justify-center w-10 h-10 ${iconBgClass}`}>
                {icon}
              </div>
            </Squircle>
            <div className="flex flex-col gap-0.5">
              <span className="text-xl font-black text-base-content tracking-tighter leading-none">
                {value}
              </span>
              <Text variant="caption" color="subtle" className="text-[10px] font-bold uppercase tracking-wider opacity-40">
                {label}
              </Text>
            </div>
          </div>
        </div>
      </Squircle>
    </motion.div>
  );
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export function StatsSummaryCards({
  totalTaps,
  roundsCompleted,
  averagePerDay,
  totalDaysActive,
}: StatsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        icon={<Hash className="w-5 h-5 text-primary" />}
        value={formatNumber(totalTaps)}
        label="Total Zikr"
        iconBgClass="bg-primary/10"
        delay={0}
      />
      <StatCard
        icon={<Target className="w-5 h-5 text-success" />}
        value={roundsCompleted}
        label="Rounds"
        iconBgClass="bg-success/10"
        delay={0.05}
      />
      <StatCard
        icon={<TrendingUp className="w-5 h-5 text-info" />}
        value={averagePerDay}
        label="Avg / Day"
        iconBgClass="bg-info/10"
        delay={0.1}
      />
      <StatCard
        icon={<Repeat className="w-5 h-5 text-secondary" />}
        value={totalDaysActive}
        label="Active Days"
        iconBgClass="bg-secondary/10"
        delay={0.15}
      />
    </div>
  );
}
