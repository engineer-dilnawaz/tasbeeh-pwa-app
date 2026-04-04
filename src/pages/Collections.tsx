import { motion } from "framer-motion";
import { Library } from "lucide-react";
import styles from "./Collections.module.css";

export default function Collections() {
  return (
    <motion.main 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.container}
    >
      <div className={styles.emptyState}>
        <div className={styles.iconBox}>
          <Library size={48} color="var(--accent)" />
        </div>
        <h1>Your Collections</h1>
        <p>This is where your personalized Tasbeeh collections will live soon. Stay tuned for updates!</p>
      </div>
    </motion.main>
  );
}
