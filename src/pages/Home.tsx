import { motion } from "framer-motion";
import { HomeDhikrCounter } from "@/features/tasbeeh";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.container}
    >
      <div className="flex min-h-0 w-full flex-1 flex-col items-stretch justify-start gap-4 pt-4 pb-0 pl-[max(12px,env(safe-area-inset-left))] pr-[max(12px,env(safe-area-inset-right))]">
        <HomeDhikrCounter />
      </div>
    </motion.main>
  );
}
