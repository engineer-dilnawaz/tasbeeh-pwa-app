import { useState } from "react";
import { Menu, Bell } from "lucide-react";
import { DaisyIndicator } from "@/shared/components/daisy";
import { Drawer } from "@/shared/components/Drawer/Drawer";
import { useRemoteConfig } from "@/shared/hooks/useRemoteConfig";
import styles from "./AppShellHeader.module.css";

export function AppShellHeader() {
  const { t } = useRemoteConfig();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <header className={styles.wrapper}>
        <div className={styles.row}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Open Menu"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Menu size={24} aria-hidden />
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
                  <div className="status status-primary animate-ping" />
                  <span className="status status-primary status-md " />
                </div>
              }
            >
              <Bell size={24} aria-hidden />
            </DaisyIndicator>
          </button>
        </div>
      </header>
    </>
  );
}
