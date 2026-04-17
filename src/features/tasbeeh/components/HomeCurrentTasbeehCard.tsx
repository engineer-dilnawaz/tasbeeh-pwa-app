import { motion } from "framer-motion";

import { Card } from "@/shared/design-system/ui/Card";
import { Counter } from "@/shared/design-system/ui/Counter";
import { ProgressRing } from "@/shared/design-system/ui/ProgressRing";
import { Text } from "@/shared/design-system/ui/Text";

interface HomeCurrentTasbeehCardProps {
  arabic: string;
  transliteration: string;
  count: number;
  target: number;
  onCount: () => void;
}

export function HomeCurrentTasbeehCard({
  arabic,
  transliteration,
  count,
  target,
  onCount,
}: HomeCurrentTasbeehCardProps) {
  const progress = Math.min(100, Math.round((count / target) * 100));
  const isCompleted = count >= target;

  return (
    <Card variant="outlined" radius="lg" className="border-base-content/10 bg-base-100">
      <div className="flex flex-col items-center gap-5">
        <div className="text-center">
          <Text variant="display-arabic" className="text-3xl leading-[1.4]">
            {arabic}
          </Text>
          <Text variant="body" color="muted" className="mt-1">
            {transliteration}
          </Text>
        </div>

        <motion.button
          type="button"
          onClick={onCount}
          whileTap={{ scale: 0.98 }}
          className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          aria-label="Increment tasbeeh count"
        >
          <ProgressRing value={progress} size={188} strokeWidth={12} glow={false}>
            <div className="flex flex-col items-center">
              <Counter value={count} variant="counter" className="text-primary" />
              <Text variant="caption" color="subtle" className="mt-1 text-[10px]! tracking-[0.16em]!">
                {count}/{target}
              </Text>
            </div>
          </ProgressRing>
        </motion.button>

        <Text
          variant="body"
          color={isCompleted ? "primary" : "subtle"}
          className="text-center"
        >
          {isCompleted ? "Target reached. You can complete this round." : "Tap the ring to continue counting."}
        </Text>
      </div>
    </Card>
  );
}

