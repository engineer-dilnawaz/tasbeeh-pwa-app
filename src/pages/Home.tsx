import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, Bell } from "lucide-react";
import { HomeDhikrCounter } from "@/features/tasbeeh";
import { DaisyIndicator } from "@/shared/components/daisy";
import { useRemoteConfig } from "@/shared/hooks/useRemoteConfig";
import { Drawer } from "@/shared/components/Drawer/Drawer";
import styles from "./Home.module.css";

export default function Home() {
  const { t } = useRemoteConfig();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

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

          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Notifications"
          >
            <DaisyIndicator
              className="inline-flex size-6 items-center justify-center overflow-visible"
              indicator={
                <div className="inline-grid *:[grid-area:1/1] mr-1">
                  <div className="status status-primary animate-ping"></div>
                  <span className="status status-primary status-md " />
                </div>
              }
            >
              <Bell size={24} aria-hidden />
            </DaisyIndicator>
          </button>
        </header>

        <div className="flex min-h-0 w-full flex-1 flex-col items-stretch justify-start gap-4 pt-4 pb-0 pl-[max(12px,env(safe-area-inset-left))] pr-[max(12px,env(safe-area-inset-right))]">
          <HomeDhikrCounter />
        </div>
      </motion.main>
    </>
  );
}
