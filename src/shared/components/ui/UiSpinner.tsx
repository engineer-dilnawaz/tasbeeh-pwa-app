import { motion } from "framer-motion";

export function UiSpinner({ color }: { color: string }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      style={{
        width: 16,
        height: 16,
        border: `2px solid ${color}40`,
        borderTop: `2px solid ${color}`,
        borderRadius: "50%",
      }}
    />
  );
}
