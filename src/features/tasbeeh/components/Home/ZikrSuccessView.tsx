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
}

/**
 * ZikrSuccessView — Premium success state shown when a collection is completed.
 * Replaces the Ring to celebrate the achievement and offer next steps.
 */
export const ZikrSuccessView: React.FC<ZikrSuccessViewProps> = ({ 
  collectionName,
  onAddMore 
}) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="flex flex-col items-center justify-center text-center px-6 py-10 w-full"
    >
      <Squircle cornerRadius={40} cornerSmoothing={0.99} asChild>
        <div className="w-28 h-28 bg-primary/10 flex items-center justify-center mb-10 relative">
          <div className="z-10">
            <CheckCircle2 size={56} className="text-primary" />
          </div>
          
          {/* Decorative ambient pulses */}
          <motion.div 
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-primary/20 rounded-full"
          />
        </div>
      </Squircle>

      <div className="flex flex-col items-center">
        <TypingText 
          text="MashaAllah!" 
          className="text-base-content text-4xl font-black tracking-tight mb-4"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <Text variant="body" className="text-base-content/60 mb-10 max-w-[300px] leading-relaxed mx-auto text-center font-medium">
            You have successfully completed the <span className="text-primary font-black uppercase tracking-tight">"{collectionName}"</span> collection for today.
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
          Discover More Zikr
        </Button>
        
        <Button 
          variant="outline" 
          size="lg"
          className="gap-3 border-primary/20"
          onClick={() => navigate("/stats")}
        >
          <BarChart3 size={20} />
          View Your Progress
        </Button>
      </motion.div>

      <Text variant="caption" className="mt-10 text-base-content/40 italic px-4">
        "Verily, in the remembrance of Allah do hearts find rest."
      </Text>
    </motion.div>
  );
};
