import React from "react";
import { motion } from "framer-motion";
import { Text } from "@/shared/design-system/ui/Text";
import { Button } from "@/shared/design-system/ui/Button";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { CheckCircle2, BarChart3, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TypingText } from "@/shared/components/TypingText";

interface ZikrSuccessViewProps {
  collectionName: string;
  onAddMore?: () => void;
  isEmpty?: boolean;
}

/**
 * ZikrSuccessView — Premium success state shown when a collection is completed
 * or when the app is empty (Discovery Mode).
 */
export const ZikrSuccessView: React.FC<ZikrSuccessViewProps> = ({
  collectionName,
  onAddMore,
  isEmpty = false,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="flex flex-col items-center justify-center text-center px-6 py-10 w-full"
    >
      <div className="relative mb-10 flex items-center justify-center">
        {/* Ambient Blob Background */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -inset-full flex items-center justify-center text-primary/30 pointer-events-none"
        >
          <svg
            viewBox="0 0 900 600"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <g transform="translate(450 300)">
              <motion.path
                initial={{ 
                  d: "M157.5 -88.3C185 -43.2 175.2 26.2 142.7 76.6C110.3 127 55.1 158.5 3.2 156.6C-48.7 154.8 -97.4 119.6 -129.3 69.5C-161.2 19.4 -176.3 -45.5 -152 -88.8C-127.6 -132 -63.8 -153.5 0.6 -153.8C65 -154.2 129.9 -133.3 157.5 -88.3" 
                }}
                animate={{
                  d: [
                    "M157.5 -88.3C185 -43.2 175.2 26.2 142.7 76.6C110.3 127 55.1 158.5 3.2 156.6C-48.7 154.8 -97.4 119.6 -129.3 69.5C-161.2 19.4 -176.3 -45.5 -152 -88.8C-127.6 -132 -63.8 -153.5 0.6 -153.8C65 -154.2 129.9 -133.3 157.5 -88.3",
                    "M180.5 -70.3C200 -50.2 190.2 10.2 160.7 60.6C130.3 110 70.1 140.5 10.2 145.6C-40.7 150.8 -110.4 125.6 -140.3 80.5C-170.2 30.4 -180.3 -30.5 -160 -70.8C-140.6 -110 -80.8 -140.5 10.6 -145.8C80 -150.2 150.9 -110.3 180.5 -70.3",
                    "M157.5 -88.3C185 -43.2 175.2 26.2 142.7 76.6C110.3 127 55.1 158.5 3.2 156.6C-48.7 154.8 -97.4 119.6 -129.3 69.5C-161.2 19.4 -176.3 -45.5 -152 -88.8C-127.6 -132 -63.8 -153.5 0.6 -153.8C65 -154.2 129.9 -133.3 157.5 -88.3"
                  ]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                fill="currentColor"
              />
            </g>
          </svg>
        </motion.div>

        <Squircle cornerRadius={40} cornerSmoothing={0.99} asChild>
          <div className="w-28 h-28 flex items-center justify-center relative z-10">
            <div className="z-20">
              {isEmpty ? (
                 <Plus size={56} className="text-primary" />
              ) : (
                 <CheckCircle2 size={56} className="text-primary" />
              )}
            </div>
          </div>
        </Squircle>
      </div>

      <div className="flex flex-col items-center">
        <TypingText
          text={isEmpty ? "Assalamu Alaikum" : "MashaAllah!"}
          className="text-base-content text-4xl font-black tracking-tight mb-4"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <Text
            variant="body"
            className="text-base-content/60 mb-10 max-w-[300px] leading-relaxed mx-auto text-center font-medium"
          >
            {isEmpty ? (
              <>
                It looks like you're ready to begin. Choose a 
                <span className="text-primary font-black uppercase tracking-tight ml-1">
                  Zikr collection
                </span> to start your spiritual journey.
              </>
            ) : (
              <>
                You have successfully completed the{" "}
                <span className="text-primary font-black uppercase tracking-tight">
                  "{collectionName}"
                </span>{" "}
                collection for today.
              </>
            )}
          </Text>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col gap-3 w-full max-w-[280px]"
      >
        <Button
          variant="primary"
          size="lg"
          className="gap-3 shadow-lg shadow-primary/20"
          onClick={onAddMore || (() => navigate("/collections"))}
        >
          <Plus size={20} />
          {isEmpty ? "Choose a Collection" : "Discover More Zikr"}
        </Button>

        {!isEmpty && (
          <Button
            variant="outline"
            size="lg"
            className="gap-3 border-primary/20"
            onClick={() => navigate("/stats")}
          >
            <BarChart3 size={20} />
            View Your Progress
          </Button>
        )}
      </motion.div>

      <Text
        variant="caption"
        className="mt-10 text-base-content/40 italic px-4"
      >
        "Verily, in the remembrance of Allah do hearts find rest."
      </Text>
    </motion.div>
  );
};
