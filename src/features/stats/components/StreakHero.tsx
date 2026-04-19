import { motion } from "framer-motion";
import { Flame, Trophy, Calendar } from "lucide-react";
import { Card } from "@/shared/design-system/ui/Card";
import { Text } from "@/shared/design-system/ui/Text";
import { Squircle } from "@/shared/design-system/ui/Squircle";

interface StreakHeroProps {
  currentStreak: number;
  bestStreak: number;
  totalDaysActive: number;
}

export function StreakHero({ currentStreak, bestStreak, totalDaysActive }: StreakHeroProps) {
  return (
    <Squircle cornerRadius={24} cornerSmoothing={0.99} asChild>
      <div className="bg-white dark:bg-black p-8 shadow-sm border border-base-content/5 relative overflow-hidden">
        {/* Decorative Light Elements (Subtle) */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative flex items-center justify-around">
          {/* Main Current Streak */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
            className="flex flex-col items-center flex-1"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full scale-110 opacity-50" />
              <Squircle cornerRadius={20} cornerSmoothing={0.9} asChild>
                <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-red-600 shadow-xl shadow-orange-500/20">
                  <Flame className="w-8 h-8 text-white drop-shadow-sm" strokeWidth={2.5} />
                </div>
              </Squircle>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <span className="text-4xl font-black text-base-content tracking-tighter leading-none">
                {currentStreak}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mt-2">
                Diligence
              </span>
            </div>
          </motion.div>

          {/* Subtle Decorative Divider */}
          <div className="w-[1px] h-12 bg-base-content/5" />

          {/* Best Streak */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", bounce: 0.3 }}
            className="flex flex-col items-center flex-1"
          >
            <Squircle cornerRadius={14} cornerSmoothing={0.9} asChild>
              <div className="flex items-center justify-center w-11 h-11 bg-amber-500/10 border border-amber-500/10">
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>
            </Squircle>
            <div className="mt-3 flex flex-col items-center">
              <span className="text-xl font-bold text-base-content tracking-tight">{bestStreak}</span>
              <Text variant="caption" color="subtle" className="text-[9px] font-bold uppercase tracking-wider opacity-40">
                Best
              </Text>
            </div>
          </motion.div>

          {/* Subtle Decorative Divider */}
          <div className="w-[1px] h-12 bg-base-content/5" />

          {/* Total Days */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.3 }}
            className="flex flex-col items-center flex-1"
          >
            <Squircle cornerRadius={14} cornerSmoothing={0.9} asChild>
              <div className="flex items-center justify-center w-11 h-11 bg-primary/10 border border-primary/10">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
            </Squircle>
            <div className="mt-3 flex flex-col items-center">
              <span className="text-xl font-bold text-base-content tracking-tight">{totalDaysActive}</span>
              <Text variant="caption" color="subtle" className="text-[9px] font-bold uppercase tracking-wider opacity-40">
                Total
              </Text>
            </div>
          </motion.div>
        </div>
      </div>
    </Squircle>
  );
}
