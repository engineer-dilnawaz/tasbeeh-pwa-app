import { motion, AnimatePresence } from "framer-motion";
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
  Clock as ClockIcon,
} from "lucide-react";
import { DaisyThemeSwatch } from "@/features/settings/components/DaisyThemeSwatch";
import { FontOptionCards } from "@/features/settings/components/FontOptionCards";
import {
  SettingsPageCanvas,
  SettingsElevatedSurface,
  SettingsSection,
  SettingsIconTile,
  SettingsRowStatic,
  SettingsRowButton,
  SettingsRowLink,
  SettingsRowDivider,
  SettingsHapticSlider,
  SettingsEmbed,
} from "@/features/settings/components/SettingsPrimitives";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import {
  DAISY_UI_THEME_NAMES,
  formatDaisyThemeLabel,
  type DaisyUiThemeName,
} from "@/shared/config/daisyUiThemes";
import { useAuth } from "@/services/auth/useAuth";
import { useRemoteConfig } from "@/shared/hooks/useRemoteConfig";
import { useFont } from "@/shared/hooks/useFont";
import {
  applyThemeToDocument,
  persistDaisyTheme,
  readStoredDaisyTheme,
} from "@/shared/lib/theme";
import clsx from "clsx";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";

const EDIT_BTN_CLASS =
  "shrink-0 rounded-full border-0 bg-base-100 px-4 py-2 text-[0.8125rem] font-bold shadow-md transition active:scale-95 dark:bg-base-300";
const CHEVRON_CLASS = "shrink-0 text-base-content/50";
import { Switch } from "@/shared/components/forms/Switch";
import {
  SheetOptionRow,
  SquircleSheet,
} from "@/shared/components/SquircleSheet";
import { SmoothSquircle } from "@/shared/components/ui/SmoothSquircle";
import { UiButton } from "@/shared/components/ui/UiButton";
import { UiTextField } from "@/shared/components/ui/UiTextField";
import {
  getHapticsBlockedReason,
  HAPTIC_TAP_MS,
  readUserVibrationDisabled,
  safeVibrate,
  writeUserVibrationDisabled,
} from "@/shared/utils/haptics";

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t, locale, supportedLocales, setLocale, refresh } = useRemoteConfig();
  const { use24HourFormat, toggleTimeFormat } = useSettingsStore();
  const { fontId, selectFont, options: fontOptions } = useFont();

  const [daisyTheme, setDaisyTheme] =
    useState<DaisyUiThemeName>(readStoredDaisyTheme);
  const [hapticsEnabled, setHapticsEnabled] = useState(
    () => !readUserVibrationDisabled(),
  );
  const [hapticStrength, setHapticStrength] = useState(1);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [resetMidnight, setResetMidnight] = useState(true);

  const [isLanguageSheetOpen, setIsLanguageSheetOpen] = useState(false);
  const [isDaisyThemeSheetOpen, setIsDaisyThemeSheetOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isLogoutSheetOpen, setIsLogoutSheetOpen] = useState(false);
  const [isVersionInfoOpen, setIsVersionInfoOpen] = useState(false);

  const [editName, setEditName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    applyThemeToDocument(daisyTheme);
    if (user?.displayName) setEditName(user.displayName);
  }, [daisyTheme, user]);

  const onSelectDaisyTheme = (name: DaisyUiThemeName) => {
    setDaisyTheme(name);
    persistDaisyTheme(name);
    applyThemeToDocument(name);
    setTimeout(() => setIsDaisyThemeSheetOpen(false), 180);
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
    return raw
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }, [user?.displayName, isGuest]);

  const strengthLabel = useMemo(() => {
    const labels = ["Light", "Medium", "Strong", "Very Strong"];
    return labels[hapticStrength] || "Medium";
  }, [hapticStrength]);

  const onHapticStrengthChange = (val: number) => {
    setHapticStrength(val);
    if (!hapticsEnabled) return;
    const patterns = [20, 50, 80, 140];
    safeVibrate(patterns[val] ?? 40);
  };

  return (
    <SettingsPageCanvas>
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={clsx("w-full max-w-full")}
      >
        <SettingsElevatedSurface
          cornerRadius={36}
          padding={24}
          style={{ marginBottom: 18, marginTop: 18 }}
        >
          <div className="flex w-full flex-col items-stretch gap-4">
            <div className="flex justify-center">
              <SmoothSquircle
                cornerRadius={26}
                cornerSmoothing={1}
                style={{
                  width: 70,
                  height: 70,
                  backgroundColor: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-primary-content)",
                  fontSize: 23,
                  fontWeight: 800,
                  letterSpacing: -0.5,
                  flexShrink: 0,
                  boxShadow:
                    "0 0 0 3px var(--color-base-100), 0 14px 32px -10px color-mix(in oklab, var(--color-base-content) 28%, transparent)",
                }}
              >
                {getInitials(user?.displayName || (isGuest ? "G" : null))}
              </SmoothSquircle>
            </div>

            <div className="flex min-w-0 w-full flex-col gap-1 px-0.5">
              <h3 className="m-0 min-w-0 text-center text-lg font-extrabold capitalize leading-snug tracking-tight text-base-content">
                {formattedName}
              </h3>
              <p className="m-0 min-w-0 wrap-anywhere text-center text-sm font-medium leading-tight text-base-content/65">
                {user?.email ||
                  (isGuest ? "Temporary Guest Account" : "Join our community")}
              </p>
            </div>

            <div className="flex justify-center pt-0.5">
              <button
                type="button"
                className={EDIT_BTN_CLASS}
                onClick={() => setIsEditProfileOpen(true)}
              >
                Edit
              </button>
            </div>
          </div>
        </SettingsElevatedSurface>

        <SettingsSection title={t("settings.remind.title")}>
          <SettingsRowStatic
            icon={
              <SettingsIconTile
                background="var(--color-warning)"
                color="var(--color-warning-content)"
              >
                <Bell size={22} />
              </SettingsIconTile>
            }
            title={t("settings.remind.daily")}
            hint={t("settings.remind.dailyHint")}
            trailing={
              <Switch
                isOn={dailyReminder}
                onToggle={() => setDailyReminder(!dailyReminder)}
              />
            }
          />
        </SettingsSection>

        <SettingsSection title={t("settings.appearance.title")}>
          <SettingsRowButton
            icon={
              <SettingsIconTile
                background="var(--color-accent)"
                color="var(--color-accent-content)"
              >
                <Palette size={22} />
              </SettingsIconTile>
            }
            title="App theme"
            hint={formatDaisyThemeLabel(daisyTheme)}
            onClick={() => setIsDaisyThemeSheetOpen(true)}
            trailing={<ChevronRight size={20} className={CHEVRON_CLASS} />}
          />
          <SettingsRowDivider />
          <SettingsRowButton
            icon={
              <SettingsIconTile
                background="var(--color-info)"
                color="var(--color-info-content)"
              >
                <Globe size={22} />
              </SettingsIconTile>
            }
            title={t("settings.remote.locale")}
            hint={locale.toUpperCase().replace("_", "-")}
            onClick={() => setIsLanguageSheetOpen(true)}
            trailing={<ChevronRight size={20} className={CHEVRON_CLASS} />}
          />
        </SettingsSection>

        <SettingsSection title="Font settings">
          <SettingsEmbed variant="bottom">
            <FontOptionCards
              options={fontOptions}
              selectedId={fontId}
              onSelect={selectFont}
            />
          </SettingsEmbed>
        </SettingsSection>

        <SettingsSection title={t("settings.experience.title")}>
          <SettingsRowStatic
            icon={
              <SettingsIconTile
                background="var(--color-success)"
                color="var(--color-success-content)"
              >
                <Smartphone size={22} />
              </SettingsIconTile>
            }
            title={t("settings.experience.haptics")}
            hint={t("settings.experience.hapticsHint")}
            trailing={
              <Switch
                isOn={hapticsEnabled}
                onToggle={() => {
                  const next = !hapticsEnabled;
                  setHapticsEnabled(next);
                  writeUserVibrationDisabled(!next);
                  if (next) safeVibrate(HAPTIC_TAP_MS);
                }}
              />
            }
          />
          {getHapticsBlockedReason() === "insecure" ? (
            <p className="mt-2 mb-0 px-1 text-center text-[0.75rem] font-semibold leading-snug text-warning">
              {t("settings.experience.hapticsInsecureContext")}
            </p>
          ) : getHapticsBlockedReason() === "unsupported" ? (
            <p className="mt-2 mb-0 px-1 text-center text-[0.75rem] font-semibold leading-snug text-base-content/60">
              {t("settings.experience.hapticsUnsupported")}
            </p>
          ) : null}
          <AnimatePresence initial={false}>
            {hapticsEnabled ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: "hidden" }}
              >
                <SettingsHapticSlider
                  strengthLabel={strengthLabel}
                  value={hapticStrength}
                  onChange={onHapticStrengthChange}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
          <SettingsRowDivider />
          <SettingsRowStatic
            icon={
              <SettingsIconTile
                background="var(--color-error)"
                color="var(--color-error-content)"
              >
                <ShieldCheck size={22} />
              </SettingsIconTile>
            }
            title={t("settings.experience.reset")}
            hint={t("settings.experience.resetHint")}
            trailing={
              <Switch
                isOn={resetMidnight}
                onToggle={() => setResetMidnight(!resetMidnight)}
              />
            }
          />
          <SettingsRowDivider />
          <SettingsRowStatic
            icon={
              <SettingsIconTile
                background="var(--color-neutral)"
                color="var(--color-neutral-content)"
              >
                <ClockIcon size={22} />
              </SettingsIconTile>
            }
            title="24-Hour Format"
            hint="Toggle between 12h/24h timings"
            trailing={
              <Switch isOn={use24HourFormat} onToggle={toggleTimeFormat} />
            }
          />
        </SettingsSection>

        <SettingsSection title={t("settings.sync.title")}>
          <SettingsRowButton
            icon={
              <SettingsIconTile
                background="var(--color-accent)"
                color="var(--color-accent-content)"
              >
                <Zap size={22} />
              </SettingsIconTile>
            }
            title={t("settings.sync.now")}
            hint="Update cloud configurations"
            onClick={() => void refresh()}
          />
          <SettingsRowDivider />
          <SettingsRowButton
            icon={
              <SettingsIconTile
                background="var(--color-base-300)"
                color="var(--color-base-content)"
              >
                <Info size={22} />
              </SettingsIconTile>
            }
            title="App Version"
            hint="v1.0.0 (Global Release)"
            onClick={() => setIsVersionInfoOpen(true)}
          />
          {user ? (
            <>
              <SettingsRowDivider />
              <SettingsRowButton
                icon={
                  <SettingsIconTile
                    background="color-mix(in oklab, var(--color-error) 18%, transparent)"
                    color="var(--color-error)"
                  >
                    <LogOut size={22} />
                  </SettingsIconTile>
                }
                title={t("auth.signOut")}
                onClick={() => setIsLogoutSheetOpen(true)}
              />
            </>
          ) : null}
          {!user ? (
            <>
              <SettingsRowDivider />
              <SettingsRowLink
                icon={
                  <SettingsIconTile
                    background="var(--color-base-300)"
                    color="var(--color-base-content)"
                  >
                    <UserIcon size={22} />
                  </SettingsIconTile>
                }
                title={t("settings.account.signInCta")}
                to="/sign-in"
                trailing={<ChevronRight size={20} className={CHEVRON_CLASS} />}
              />
            </>
          ) : null}
        </SettingsSection>

        <div className="h-10" />

        <SquircleSheet
          isOpen={isDaisyThemeSheetOpen}
          onClose={() => setIsDaisyThemeSheetOpen(false)}
          title="Choose theme"
        >
          <div className="max-h-[min(52dvh,480px)] overflow-y-auto overscroll-contain pr-0.5 [-webkit-overflow-scrolling:touch]">
            {DAISY_UI_THEME_NAMES.map((name) => (
              <SheetOptionRow
                key={name}
                active={daisyTheme === name}
                leading={<DaisyThemeSwatch theme={name} />}
                label={formatDaisyThemeLabel(name)}
                trailing={
                  daisyTheme === name ? (
                    <Check
                      className="text-primary-content"
                      size={22}
                      strokeWidth={2.5}
                    />
                  ) : null
                }
                onClick={() => onSelectDaisyTheme(name)}
              />
            ))}
          </div>
        </SquircleSheet>

        <SquircleSheet
          isOpen={isLanguageSheetOpen}
          onClose={() => setIsLanguageSheetOpen(false)}
          title={t("settings.remote.locale")}
        >
          {supportedLocales.map((code) => (
            <SheetOptionRow
              key={code}
              active={locale === code}
              label={
                code === "en"
                  ? "English"
                  : code === "ur"
                    ? "Urdu (اردو)"
                    : "Arabic (العربية)"
              }
              trailing={
                locale === code ? (
                  <Check
                    className="text-primary-content"
                    size={22}
                    strokeWidth={2.5}
                  />
                ) : null
              }
              onClick={() => {
                setLocale(code);
                setTimeout(() => setIsLanguageSheetOpen(false), 200);
              }}
            />
          ))}
        </SquircleSheet>

        <SquircleSheet
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          title="Edit profile"
        >
          <div className="flex flex-col gap-5 pb-2">
            <UiTextField
              label="Full name"
              placeholder="Enter your name"
              icon={<UserIcon size={18} strokeWidth={2.2} />}
              value={editName}
              onChange={setEditName}
            />
            {!isGuest && user?.email ? (
              <UiTextField
                label="Email"
                value={user.email}
                disabled
                icon={<Mail size={18} strokeWidth={2.2} />}
              />
            ) : null}
            <UiButton
              label={isUpdating ? "Updating…" : "Update changes"}
              variant="primary"
              fullWidth
              loading={isUpdating}
              onClick={() => void handleSaveChanges()}
            />
          </div>
        </SquircleSheet>

        <SquircleSheet
          isOpen={isVersionInfoOpen}
          onClose={() => setIsVersionInfoOpen(false)}
          title="App information"
        >
          <div className="py-1 text-center">
            <div className="mx-auto mb-5 flex size-[72px] items-center justify-center rounded-3xl bg-primary/20 text-primary">
              <Info size={40} />
            </div>
            <h3 className="mb-3 text-xl font-extrabold tracking-tight text-base-content">
              Tasbeeh Flow v1.0.0
            </h3>
            <p className="text-base font-medium leading-relaxed text-base-content/70">
              Premium UI, haptic feedback, and cloud-friendly preferences. Thank
              you for being part of the community.
            </p>
          </div>
        </SquircleSheet>

        <SquircleSheet
          isOpen={isLogoutSheetOpen}
          onClose={() => setIsLogoutSheetOpen(false)}
          title={isGuest ? "Delete guest data?" : "Sign out?"}
        >
          <div className="py-1 text-center">
            <div className="mx-auto mb-5 flex size-[72px] items-center justify-center rounded-3xl bg-error/20 text-error">
              <AlertCircle size={40} />
            </div>
            <p className="mb-6 text-base font-semibold leading-snug text-base-content/80">
              {isGuest
                ? "Signing out permanently deletes your counts, streaks, and on-device progress. This cannot be undone."
                : "Your counts and streaks stay on your account. You can sign in again anytime."}
            </p>
            <div className="flex flex-col gap-3">
              <UiButton
                label={isGuest ? "Delete & sign out" : "Sign out"}
                variant="danger"
                fullWidth
                onClick={async () => {
                  await signOut();
                  setIsLogoutSheetOpen(false);
                  navigate("/sign-in");
                }}
              />
              <UiButton
                label="Cancel"
                variant="secondary"
                fullWidth
                onClick={() => setIsLogoutSheetOpen(false)}
              />
            </div>
          </div>
        </SquircleSheet>
      </motion.main>
    </SettingsPageCanvas>
  );
}
