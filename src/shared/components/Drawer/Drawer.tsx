import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Book,
  MessageSquare,
  Star,
  Users,
  Compass,
  Clock,
  ChevronRight,
  User,
} from "lucide-react";
import styles from "./Drawer.module.css";
import { useResolvedPalette } from "@/shared/components/ui/palette";
import { useAuth } from "@/services/auth/useAuth";
import { LogoutSheet } from "../LogoutSheet/LogoutSheet";
import { SmoothSquircle } from "@/shared/components/ui/SmoothSquircle";
import { UiButton } from "@/shared/components/ui/UiButton";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Drawer({ isOpen, onClose }: DrawerProps) {
  const palette = useResolvedPalette();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLogoutSheetOpen, setIsLogoutSheetOpen] = useState(false);

  const menuItems = [
    { icon: Book, label: "Ayat of the Day", description: "Daily Quranic Wisdom", color: "#53b398", path: "/ayat" },
    { icon: MessageSquare, label: "Hadith of the Day", description: "Prophetic Traditions", color: "#b1bc5a", path: "/hadith" },
    { icon: Star, label: "Asma-ul-Husna", description: "The 99 Names of Allah", color: "#d3b47e", path: "/asma-ul-husna" },
    { icon: Users, label: "Community Goal", description: "1 Billion Salavat Challenge", color: "#ea937a", path: "/community" },
    { icon: Clock, label: "Prayer Times", description: "Accurate local timings", color: "#75c2ad", path: "/prayer-times" },
    { icon: Compass, label: "Qibla Finder", description: "Find the direction of Kaaba", color: "#c5c2b9", path: "/qibla" },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className={styles.backdrop}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className={styles.panelWrap}
            >
              <SmoothSquircle
                topLeftCornerRadius={0}
                topRightCornerRadius={24}
                bottomLeftCornerRadius={0}
                bottomRightCornerRadius={24}
                cornerSmoothing={1}
                style={{
                  width: "100%",
                  height: "100%",
                  background: palette.surface,
                  borderRight: `1px solid ${palette.border}`,
                  boxShadow: `8px 0 36px color-mix(in srgb, ${palette.textPrimary} 14%, transparent)`,
                  display: "flex",
                  flexDirection: "column",
                  boxSizing: "border-box",
                  paddingTop: "max(12px, env(safe-area-inset-top))",
                  paddingBottom: "max(12px, env(safe-area-inset-bottom))",
                }}
              >
                <div className={styles.header}>
                  <div className={styles.profileInfo}>
                    <SmoothSquircle
                      cornerRadius={14}
                      cornerSmoothing={1}
                      style={{
                        width: 48,
                        height: 48,
                        background: palette.surfaceRaised,
                        border: `1px solid ${palette.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: palette.textPrimary,
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <User size={24} />
                      )}
                    </SmoothSquircle>
                    <div>
                      <div className={styles.userName}>
                        {user?.displayName || "Brother/Sister"}
                      </div>
                      <div className={styles.userRole}>Spiritual Seeker</div>
                    </div>
                  </div>
                </div>

                <div className={styles.menu}>
                  <span className={styles.sectionTitle}>Spiritual Insights</span>
                  {menuItems.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={styles.menuItem}
                      onClick={() => handleNavigate(item.path)}
                    >
                      <SmoothSquircle
                        cornerRadius={12}
                        cornerSmoothing={1}
                        style={{
                          width: 40,
                          height: 40,
                          backgroundColor: `${item.color}18`,
                          color: item.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <item.icon size={20} />
                      </SmoothSquircle>
                      <div className={styles.itemText}>
                        <div className={styles.itemLabel}>{item.label}</div>
                        <div className={styles.itemDesc}>{item.description}</div>
                      </div>
                      <ChevronRight size={16} className={styles.chevron} />
                    </button>
                  ))}
                </div>

                <div className={styles.footer}>
                  <UiButton
                    label="Sign out"
                    variant="danger"
                    fullWidth
                    onClick={() => setIsLogoutSheetOpen(true)}
                  />
                  <div className={styles.appInfo}>Tasbeeh Flow v1.0.0</div>
                </div>
              </SmoothSquircle>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <LogoutSheet
        isOpen={isLogoutSheetOpen}
        onClose={() => {
          setIsLogoutSheetOpen(false);
          onClose();
        }}
      />
    </>
  );
}
