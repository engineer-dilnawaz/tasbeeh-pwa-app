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
  LogOut,
  User
} from "lucide-react";
import styles from "./Drawer.module.css";
import { useAuth } from "@/services/auth/useAuth";
import { LogoutSheet } from "../LogoutSheet/LogoutSheet";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Drawer({ isOpen, onClose }: DrawerProps) {
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
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className={styles.backdrop}
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={styles.drawer}
            >
              {/* Header / User Profile (Close Icon Removed) */}
              <div className={styles.header}>
                <div className={styles.profileInfo}>
                  <div className={styles.avatar}>
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="User Profile" />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div>
                    <div className={styles.userName}>{user?.displayName || "Brother/Sister"}</div>
                    <div className={styles.userRole}>Spiritual Seeker</div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className={styles.menu}>
                <span className={styles.sectionTitle}>Spiritual Insights</span>
                {menuItems.map((item, idx) => (
                  <button 
                    key={idx} 
                    className={styles.menuItem}
                    onClick={() => handleNavigate(item.path)}
                  >
                    <div 
                      className={styles.iconBox} 
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      <item.icon size={20} />
                    </div>
                    <div className={styles.itemText}>
                      <div className={styles.itemLabel}>{item.label}</div>
                      <div className={styles.itemDesc}>{item.description}</div>
                    </div>
                    <ChevronRight size={16} className={styles.chevron} />
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className={styles.footer}>
                <button 
                  className={styles.logoutBtn} 
                  onClick={() => setIsLogoutSheetOpen(true)}
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
                <div className={styles.appInfo}>
                  Tasbeeh Flow v1.0.0
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout Bottom Sheet */}
      <LogoutSheet 
        isOpen={isLogoutSheetOpen} 
        onClose={() => {
          setIsLogoutSheetOpen(false);
          onClose(); // Also close drawer
        }}
      />
    </>
  );
}
