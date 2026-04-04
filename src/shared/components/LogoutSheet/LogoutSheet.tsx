import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User } from "lucide-react";
import styles from "./LogoutSheet.module.css";
import { useAuth } from "@/services/auth/useAuth";

interface LogoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutSheet({ isOpen, onClose }: LogoutSheetProps) {
  const { user, signOut } = useAuth();
  const isGuest = user?.isAnonymous;

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={styles.backdrop}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={styles.sheet}
          >
            {/* Handle */}
            <div className={styles.handle} />

            {/* Account Info Profile (Settings Style) */}
            <div className={styles.accountCard}>
              <div className={styles.avatar}>
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User Profile" />
                ) : (
                  <User size={24} />
                )}
              </div>
              <div className={styles.info}>
                <div className={styles.displayName}>
                  {user?.displayName || (isGuest ? "Guest User" : "Anonymous")}
                </div>
                {user?.email && <div className={styles.email}>{user.email}</div>}
              </div>
            </div>

            <div className={styles.content}>
              <h3 className={styles.title}>Sign Out?</h3>
              <p className={styles.message}>
                {isGuest 
                  ? "You are logged in as a Guest. Signing out will permanently delete your progress and preferences unless you link your account." 
                  : "Are you sure you want to sign out of your account? Your progress will be saved for next time."}
              </p>
            </div>

            <div className={styles.actions}>
              <button 
                className={styles.confirmBtn} 
                onClick={handleSignOut}
              >
                <LogOut size={18} />
                <span>{isGuest ? "Delete & Sign Out" : "Sign Out"}</span>
              </button>
              
              <button className={styles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
