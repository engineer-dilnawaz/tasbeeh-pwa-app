import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, Bell } from "lucide-react";
import { useRemoteConfig } from "@/shared/hooks/useRemoteConfig";
import { Drawer } from "@/shared/components/Drawer/Drawer";
import styles from "./Home.module.css";

export default function Home() {
  const { t } = useRemoteConfig();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.container}
      >
        {/* Home Header */}
        <header className={styles.header}>
          <button 
            className={styles.iconBtn} 
            aria-label="Open Menu"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <h1 className={styles.title}>{t("app.title") || "Tasbeeh Flow"}</h1>

          <button className={styles.iconBtn} aria-label="Notifications">
            <div className={styles.notificationBadge} />
            <Bell size={24} />
          </button>
        </header>

        {/* Main Content Area (Scratch) */}
        <div className={styles.content}>
          {/* We will build this section by section */}
        </div>
      </motion.main>
    </>
  );
}
