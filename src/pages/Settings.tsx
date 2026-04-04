import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { 
  LogOut, 
  Palette, 
  Bell, 
  Globe, 
  ShieldCheck, 
  Smartphone,
  ChevronRight,
  Zap,
  Info,
  Check,
  User as UserIcon,
  Mail,
  AlertCircle,
  Loader2,
  Clock as ClockIcon
} from "lucide-react";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import type { ThemeId } from "@/shared/config/constants";
import { ThemePicker } from "@/features/settings/components/ThemePicker";
import { useAuth } from "@/services/auth/useAuth";
import { useRemoteConfig } from "@/shared/hooks/useRemoteConfig";
import { applyThemeToDocument, persistTheme, readStoredTheme } from "@/shared/lib/theme";
import { Switch } from "@/shared/components/forms/Switch";
import styles from "./Settings.module.css";

/** 
 * Local BottomSheet component with Drag-to-dismiss & Scroll Locking 
 */
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 100) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.sheetOverlay}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 400 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={styles.sheetContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.sheetHandle} />
            <h2 className={styles.sheetTitle}>{title}</h2>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const {
    t,
    locale,
    supportedLocales,
    setLocale,
    refresh,
  } = useRemoteConfig();
  const { use24HourFormat, toggleTimeFormat } = useSettingsStore();

  const [theme, setTheme] = useState<ThemeId>(readStoredTheme);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [hapticStrength, setHapticStrength] = useState(1);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [resetMidnight, setResetMidnight] = useState(true);
  
  const [isLanguageSheetOpen, setIsLanguageSheetOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isLogoutSheetOpen, setIsLogoutSheetOpen] = useState(false);
  const [isVersionInfoOpen, setIsVersionInfoOpen] = useState(false);

  const [editName, setEditName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    applyThemeToDocument(theme);
    if (user?.displayName) setEditName(user.displayName);
  }, [theme, user]);

  const onSelectTheme = (id: ThemeId) => {
    setTheme(id);
    persistTheme(id);
  };

  const isGuest = user?.isAnonymous ?? false;

  const handleSaveChanges = async () => {
    if (!user) return;
    setIsUpdating(true);
    try {
      await updateProfile(user, { displayName: editName });
      setIsEditProfileOpen(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "M";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formattedName = useMemo(() => {
    const raw = user?.displayName || (isGuest ? "Guest" : "Musafir");
    return raw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }, [user?.displayName, isGuest]);

  const strengthLabel = useMemo(() => {
    const labels = ["Light", "Medium", "Strong", "Very Strong"];
    return labels[hapticStrength] || "Medium";
  }, [hapticStrength]);

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.container}
    >
      <div style={{ height: "4px" }} />

      {/* Profile Section */}
      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          {getInitials(user?.displayName || (isGuest ? "G" : null))}
        </div>
        <div className={styles.profileInfo}>
          <h3>{formattedName}</h3>
          <p>{user?.email || (isGuest ? "Temporary Guest Account" : "Join our community")}</p>
        </div>
        <button className={styles.editBtn} onClick={() => setIsEditProfileOpen(true)}>
          Edit
        </button>
      </div>

      {/* Daily Remembrance Group */}
      <div className={styles.group}>
        <p className={styles.groupTitle}>{t("settings.remind.title")}</p>
        <div className={styles.groupContent}>
          <div className={styles.row}>
            <div className={`${styles.iconBox}`} style={{ background: "#fff5e6", color: "#ffa500" }}>
              <Bell size={22} />
            </div>
            <div className={styles.rowLabel}>
              <span className={styles.itemName}>{t("settings.remind.daily")}</span>
              <span className={styles.itemHint}>{t("settings.remind.dailyHint")}</span>
            </div>
            <div className={styles.control}>
              <Switch isOn={dailyReminder} onToggle={() => setDailyReminder(!dailyReminder)} />
            </div>
          </div>
        </div>
      </div>

      {/* Appearance Group */}
      <div className={styles.group}>
        <p className={styles.groupTitle}>{t("settings.appearance.title")}</p>
        <div className={styles.groupContent}>
          <div className={styles.row} style={{ cursor: "default" }}>
            <div className={`${styles.iconBox}`} style={{ background: "#f0f0ff", color: "#5856d6" }}>
              <Palette size={22} />
            </div>
            <div className={styles.rowLabel}>
              <span className={styles.itemName}>{t("settings.appearance.theme")}</span>
              <span className={styles.itemHint}>{t("settings.appearance.themeHint")}</span>
            </div>
          </div>
          <div style={{ padding: "8px 24px 24px" }}>
            <ThemePicker theme={theme} onSelect={onSelectTheme} />
          </div>
          
          <div className={styles.divider} />

          <button className={styles.row} onClick={() => setIsLanguageSheetOpen(true)}>
            <div className={`${styles.iconBox}`} style={{ background: "#e1f5fe", color: "#007aff" }}>
              <Globe size={22} />
            </div>
            <div className={styles.rowLabel}>
              <span className={styles.itemName}>{t("settings.remote.locale")}</span>
              <span className={styles.itemHint}>{locale.toUpperCase().replace('_', '-')}</span>
            </div>
            <ChevronRight size={20} style={{ opacity: 0.6, color: "var(--text-muted)" }} />
          </button>
        </div>
      </div>

      {/* Experience Group */}
      <div className={styles.group}>
        <p className={styles.groupTitle}>{t("settings.experience.title")}</p>
        <div className={styles.groupContent}>
          <div className={styles.row}>
            <div className={`${styles.iconBox}`} style={{ background: "#e8f5e9", color: "#34c759" }}>
              <Smartphone size={22} />
            </div>
            <div className={styles.rowLabel}>
              <span className={styles.itemName}>{t("settings.experience.haptics")}</span>
              <span className={styles.itemHint}>{t("settings.experience.hapticsHint")}</span>
            </div>
            <div className={styles.control}>
              <Switch isOn={hapticsEnabled} onToggle={() => setHapticsEnabled(!hapticsEnabled)} />
            </div>
          </div>
          
          <AnimatePresence initial={false}>
            {hapticsEnabled && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div className={styles.sliderWrapper}>
                  <div className={styles.sliderHeader}>
                    <span className={styles.sliderStatus}>{strengthLabel}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="1"
                    className={styles.slider}
                    value={hapticStrength}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setHapticStrength(val);
                      // Improved vibration patterns for Android sensitivity
                      if (navigator.vibrate) {
                        const patterns = [20, 50, 80, 140];
                        navigator.vibrate(patterns[val] || 40);
                      }
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={styles.divider} />
          
          <div className={styles.row}>
            <div className={`${styles.iconBox}`} style={{ background: "#ffebee", color: "#ff3b30" }}>
              <ShieldCheck size={22} />
            </div>
            <div className={styles.rowLabel}>
              <span className={styles.itemName}>{t("settings.experience.reset")}</span>
              <span className={styles.itemHint}>{t("settings.experience.resetHint")}</span>
            </div>
            <div className={styles.control}>
              <Switch isOn={resetMidnight} onToggle={() => setResetMidnight(!resetMidnight)} />
            </div>
          </div>

          <div className={styles.divider} />
          
          <div className={styles.row}>
            <div className={`${styles.iconBox}`} style={{ background: "#ede7f6", color: "#673ab7" }}>
              <ClockIcon size={22} />
            </div>
            <div className={styles.rowLabel}>
              <span className={styles.itemName}>24-Hour Format</span>
              <span className={styles.itemHint}>Toggle between 12h/24h timings</span>
            </div>
            <div className={styles.control}>
              <Switch isOn={use24HourFormat} onToggle={toggleTimeFormat} />
            </div>
          </div>
        </div>
      </div>

      {/* Cloud & Data Group */}
      <div className={styles.group}>
        <p className={styles.groupTitle}>{t("settings.sync.title")}</p>
        <div className={styles.groupContent}>
          <button className={styles.row} onClick={() => void refresh()}>
            <div className={`${styles.iconBox}`} style={{ background: "#e0f2f1", color: "#00c7be" }}>
              <Zap size={22} />
            </div>
            <div className={styles.rowLabel}>
              <span className={styles.itemName}>{t("settings.sync.now")}</span>
              <span className={styles.itemHint}>Update cloud configurations</span>
            </div>
          </button>
          
          <div className={styles.divider} />

          <button className={styles.row} onClick={() => setIsVersionInfoOpen(true)}>
            <div className={`${styles.iconBox}`} style={{ background: "#f5f5f5", color: "#8e8e93" }}>
              <Info size={22} />
            </div>
            <div className={styles.rowLabel}>
              <span className={styles.itemName}>App Version</span>
              <span className={styles.itemHint}>v1.0.0 (Global Release)</span>
            </div>
          </button>

          {user && (
            <>
              <div className={styles.divider} />
              <button className={styles.row} onClick={() => setIsLogoutSheetOpen(true)}>
                <div className={`${styles.iconBox}`} style={{ background: "rgba(255, 59, 48, 0.1)", color: "#ff3b30" }}>
                  <LogOut size={22} />
                </div>
                <div className={styles.rowLabel}>
                  <span className={styles.itemName}>{t("auth.signOut")}</span>
                </div>
              </button>
            </>
          )}

          {!user && (
            <>
              <div className={styles.divider} />
              <Link to="/sign-in" className={styles.row} style={{ textDecoration: "none" }}>
                <div className={`${styles.iconBox}`} style={{ background: "#f5f5f5", color: "#8e8e93" }}>
                  <UserIcon size={22} />
                </div>
                <div className={styles.rowLabel}>
                  <span className={styles.itemName}>{t("settings.account.signInCta")}</span>
                </div>
                <ChevronRight size={20} className={styles.chevron} />
              </Link>
            </>
          )}
        </div>
      </div>

      <div style={{ height: "40px" }} />

      {/* Language Bottom Sheet */}
      <BottomSheet 
        isOpen={isLanguageSheetOpen} 
        onClose={() => setIsLanguageSheetOpen(false)} 
        title={t("settings.remote.locale")}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {supportedLocales.map((code) => (
            <button
              key={code}
              className={`${styles.sheetOption} ${locale === code ? styles.sheetOptionActive : ""}`}
              onClick={() => {
                setLocale(code);
                setTimeout(() => setIsLanguageSheetOpen(false), 200);
              }}
            >
              <span className={styles.optionText}>
                {code === "en" ? "English" : code === "ur" ? "Urdu (اردو)" : "Arabic (العربية)"}
              </span>
              {locale === code && <Check size={22} color="var(--accent)" />}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Edit Profile Bottom Sheet */}
      <BottomSheet 
        isOpen={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)} 
        title="Edit Profile"
      >
        <div style={{ paddingBottom: "24px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", marginLeft: "14px", marginBottom: "10px", display: "block" }}>Full Name</label>
            <div className={styles.row} style={{ background: "var(--bg-tertiary)", borderRadius: "24px" }}>
              <UserIcon size={22} color="var(--accent)" />
              <input 
                type="text" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)}
                style={{ background: "transparent", border: "none", outline: "none", width: "100%", fontSize: "16px", fontWeight: "700", color: "var(--text-primary)" }}
                placeholder="Enter your name"
              />
            </div>
          </div>

          {!isGuest && (
            <div style={{ marginBottom: "32px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", marginLeft: "14px", marginBottom: "10px", display: "block" }}>Email Address</label>
              <div className={styles.row} style={{ background: "var(--bg-primary)", borderRadius: "24px", opacity: 0.6, cursor: "not-allowed" }}>
                <Mail size={22} color="var(--text-muted)" />
                <span className={styles.itemName} style={{ color: "var(--text-muted)" }}>{user?.email}</span>
              </div>
            </div>
          )}

          <button 
            className={styles.row} 
            disabled={isUpdating}
            style={{ 
              background: "var(--accent)", 
              color: "var(--bg-primary)", 
              borderRadius: "24px", 
              justifyContent: "center", 
              padding: "20px", 
              opacity: isUpdating ? 0.7 : 1,
              transition: "transform 0.2s ease"
            }}
            onClick={handleSaveChanges}
          >
            {isUpdating ? (
              <Loader2 className={styles.spin} size={22} />
            ) : null}
            <span className={styles.itemName} style={{ color: "var(--bg-primary)", fontSize: "17px", fontWeight: "800" }}>
              {isUpdating ? "Updating..." : "Update Changes"}
            </span>
          </button>
        </div>
      </BottomSheet>

      {/* Version Info Bottom Sheet */}
      <BottomSheet 
        isOpen={isVersionInfoOpen} 
        onClose={() => setIsVersionInfoOpen(false)} 
        title="App Information"
      >
        <div style={{ padding: "0 8px 32px", textAlign: "center" }}>
          <div style={{ 
            width: "72px", 
            height: "72px", 
            background: "var(--accent-subtle)", 
            borderRadius: "28px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 24px",
            color: "var(--accent)"
          }}>
            <Info size={40} />
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "12px", color: "var(--text-primary)" }}>Tasbeeh Flow v1.0.0</h3>
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: "1.6", fontWeight: "500" }}>
            This version includes the new premium UI updates, enhanced vibration feedback, and cloud sync capabilities. Thank you for being a part of our community.
          </p>
        </div>
      </BottomSheet>

      {/* Logout Confirmation Sheet */}
      <BottomSheet 
        isOpen={isLogoutSheetOpen} 
        onClose={() => setIsLogoutSheetOpen(false)} 
        title={isGuest ? "Delete Guest Data?" : "Signing Out?"}
      >
        <div style={{ padding: "0 8px 12px", textAlign: "center" }}>
          <div style={{ 
            width: "72px", 
            height: "72px", 
            background: "rgba(255, 59, 48, 0.1)", 
            borderRadius: "28px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 24px",
            color: "#ff3b30"
          }}>
            <AlertCircle size={40} />
          </div>
          <p style={{ fontSize: "17px", color: "var(--text-secondary)", marginBottom: "32px", lineHeight: "1.6", fontWeight: "600" }}>
            {isGuest 
              ? "You are using a Guest account. Signing out will permanently delete your counts, streaks, and progress. This cannot be undone."
              : "Your counts and streaks will be saved to your account. Are you sure you want to sign out?"
            }
          </p>
          
          <button 
            className={styles.row} 
            style={{ 
              background: "#ff3b30", 
              color: "#fff", 
              borderRadius: "24px", 
              justifyContent: "center", 
              marginBottom: "16px",
              padding: "20px"
            }}
            onClick={async () => {
              await signOut();
              setIsLogoutSheetOpen(false);
              navigate("/sign-in");
            }}
          >
            <span className={styles.itemName} style={{ color: "#fff", fontSize: "17px", fontWeight: "800" }}>
              {isGuest ? "Delete & Sign Out" : "Sign Out"}
            </span>
          </button>

          
          <button 
            className={styles.row} 
            style={{ 
              background: "var(--bg-tertiary)", 
              borderRadius: "24px", 
              justifyContent: "center",
              padding: "20px"
            }}
            onClick={() => setIsLogoutSheetOpen(false)}
          >
            <span className={styles.itemName} style={{ fontWeight: "700", fontSize: "17px", color: "var(--text-primary)" }}>Cancel</span>
          </button>
        </div>
      </BottomSheet>
    </motion.main>
  );
}
