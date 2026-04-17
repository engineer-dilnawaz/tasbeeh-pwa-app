import { useMemo, useState } from "react";
import {
  Brush,
  ChevronRight,
  Globe,
  Info,
  LogOut,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { SettingsActionSheet } from "@/features/settings/components/SettingsActionSheet";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { Avatar } from "@/shared/design-system/ui/Avatar";
import { Badge } from "@/shared/design-system/ui/Badge";
import { Drawer } from "@/shared/design-system/ui/Drawer";
import { List } from "@/shared/design-system/ui/List";
import { Switch } from "@/shared/design-system/ui/Switch";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { SegmentedControl } from "@/shared/design-system/ui/SegmentedControl";
import { Text } from "@/shared/design-system/ui/Text";
import { TimePicker } from "@/shared/design-system/ui/TimePicker";
import { toast } from "@/shared/design-system/ui/useToast";
import { useTheme } from "@/shared/design-system/hooks/useTheme";
import {
  DEVICE_USER_ID,
  tasbeehDb,
} from "@/features/tasbeeh/services/tasbeehDb";
import { readTasbeehSnapshot } from "@/features/tasbeeh/services/tasbeehRepository";
import {
  getCollectionDetails,
  listCollections,
} from "@/features/tasbeeh/services/collectionsRepository";

// const languageLabel: Record<string, string> = {
//   english: "English",
//   arabic: "Arabic",
//   urdu: "Urdu",
// };

interface ToggleRowProps {
  title: string;
  checked: boolean;
  withDivider?: boolean;
  onToggle: (checked: boolean) => void;
}

function ToggleRow({
  title,
  checked,
  withDivider = true,
  onToggle,
}: ToggleRowProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`flex cursor-pointer select-none items-center justify-between py-3 text-left ${
        withDivider ? "border-b border-base-content/8" : ""
      }`}
      onClick={() => onToggle(!checked)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle(!checked);
        }
      }}
    >
      <Text variant="body" weight="medium">
        {title}
      </Text>
      <div
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Switch checked={checked} onChange={onToggle} />
      </div>
    </div>
  );
}

export function SettingsHub() {
  const navigate = useNavigate();
  const isDev = import.meta.env.DEV;
  const [showLogoutSheet, setShowLogoutSheet] = useState(false);
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  const [showThemeSheet, setShowThemeSheet] = useState(false);
  const [showAnimationSheet, setShowAnimationSheet] = useState(false);
  const [showHapticsSheet, setShowHapticsSheet] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [showReminderTimeSheet, setShowReminderTimeSheet] = useState(false);
  const profile = useSettingsStore((state) => state.profile);
  const appearance = useSettingsStore((state) => state.appearance);
  const setAppearance = useSettingsStore((state) => state.setAppearance);
  const interaction = useSettingsStore((state) => state.interaction);
  const setInteraction = useSettingsStore((state) => state.setInteraction);
  const accessibility = useSettingsStore((state) => state.accessibility);
  const setAccessibility = useSettingsStore((state) => state.setAccessibility);
  const notifications = useSettingsStore((state) => state.notifications);
  const setNotifications = useSettingsStore((state) => state.setNotifications);
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const { setTheme } = useTheme();

  const reminderTime = useMemo(() => {
    const [hour, minute] = notifications.dailyReminderTime
      .split(":")
      .map(Number);
    return {
      hour: Number.isFinite(hour) ? hour : 5,
      minute: Number.isFinite(minute) ? minute : 30,
    };
  }, [notifications.dailyReminderTime]);

  const reminderTimeLabel = useMemo(() => {
    const [hourRaw, minuteRaw] = notifications.dailyReminderTime
      .split(":")
      .map(Number);

    const hour = Number.isFinite(hourRaw) ? hourRaw : 7;
    const minute = Number.isFinite(minuteRaw) ? minuteRaw : 30;
    const suffix = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;

    return `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${suffix}`;
  }, [notifications.dailyReminderTime]);

  const animationLabel =
    appearance.animationLevel === "off" ? "None" : appearance.animationLevel;
  const bottomNavVariant = appearance.bottomNavVariant ?? "bar";

  const previewHaptics = (intensity: "light" | "medium" | "strong") => {
    if (
      typeof navigator === "undefined" ||
      typeof navigator.vibrate !== "function"
    ) {
      return;
    }

    const pattern =
      intensity === "light"
        ? [12]
        : intensity === "medium"
          ? [18, 18, 18]
          : [26, 24, 26];
    navigator.vibrate(pattern);
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-[480px] flex-col gap-4 px-4 pt-4 select-none">
        <section className="flex flex-col gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Avatar
              size="lg"
              name={profile.displayName}
              src={profile.avatarUrl || undefined}
              status="online"
            />
            <div className="min-w-0 flex-1">
              <Text variant="heading" weight="semibold" className="truncate">
                {profile.displayName}
              </Text>
              <Text variant="body" color="subtle" className="truncate">
                {profile.email}
              </Text>
            </div>
            <button
              type="button"
              onClick={() => navigate("/settings/profile")}
              aria-label="Edit Profile"
            >
              <Badge variant="primary" size="sm">
                Edit Profile
              </Badge>
            </button>
          </div>
        </section>

        <Squircle
          cornerRadius={30}
          cornerSmoothing={0.99}
          className="surface-card w-full p-5"
        >
          <div className="mb-2 flex items-center gap-2">
            <Brush size={16} className="text-primary" />
            <Text variant="heading" weight="semibold">
              Appearance & Interaction
            </Text>
          </div>
          <List variant="spaced" gap={0}>
            <button
              type="button"
              onClick={() => setShowThemeSheet(true)}
              className="flex w-full select-none items-center justify-between border-b border-base-content/8 py-3 text-left"
            >
              <div>
                <Text variant="body" weight="medium">
                  Theme
                </Text>
                <Text variant="body" color="subtle">
                  {appearance.theme === "light" ? "Light mode" : "Dark mode"}
                </Text>
              </div>
              <ChevronRight size={16} className="text-base-content/30" />
            </button>
            <button
              type="button"
              onClick={() => setShowAnimationSheet(true)}
              className="flex w-full select-none items-center justify-between border-b border-base-content/8 py-3 text-left"
            >
              <div>
                <Text variant="body" weight="medium">
                  Animation Intensity
                </Text>
                <Text variant="body" color="subtle" className="capitalize">
                  {animationLabel}
                </Text>
              </div>
              <ChevronRight size={16} className="text-base-content/30" />
            </button>
            <button
              type="button"
              onClick={() => setShowHapticsSheet(true)}
              className="flex w-full select-none items-center justify-between border-b border-base-content/8 py-3 text-left"
            >
              <div>
                <Text variant="body" weight="medium">
                  Haptics Intensity
                </Text>
                <Text variant="body" color="subtle" className="capitalize">
                  {interaction.hapticsIntensity}
                </Text>
              </div>
              <ChevronRight size={16} className="text-base-content/30" />
            </button>
            <div className="flex items-center justify-between border-b border-base-content/8 py-3">
              <Text variant="body" weight="medium">
                Bottom Tab
              </Text>
              <div className="w-[168px]">
                <SegmentedControl
                  size="sm"
                  uppercase={false}
                  activeItemClassName="bg-white dark:bg-base-100"
                  activeTextClassName="text-base-content"
                  options={[
                    { label: "Bar", value: "bar" },
                    { label: "Glass Dock", value: "glass-dock" },
                  ]}
                  value={bottomNavVariant}
                  onChange={(value) =>
                    setAppearance({
                      bottomNavVariant: value,
                    })
                  }
                />
              </div>
            </div>
            <ToggleRow
              title="Haptics on click"
              checked={interaction.hapticsEnabled}
              onToggle={(checked) =>
                setInteraction({ hapticsEnabled: checked })
              }
            />
            <ToggleRow
              title="Bead sound on count"
              checked={interaction.beadSoundEnabled}
              withDivider={false}
              onToggle={(checked) =>
                setInteraction({ beadSoundEnabled: checked })
              }
            />
          </List>
        </Squircle>

        {isDev ? (
          <Squircle
            cornerRadius={30}
            cornerSmoothing={0.99}
            className="surface-card w-full p-5"
          >
            <div className="mb-2 flex items-center gap-2">
              <Info size={16} className="text-primary" />
              <Text variant="heading" weight="semibold">
                Debug (DEV only)
              </Text>
            </div>
            <List variant="spaced" gap={0}>
              <button
                type="button"
                className="flex w-full items-center justify-between border-b border-base-content/8 py-3 text-left"
                onClick={async () => {
                  const row = await tasbeehDb.appConfig.get(DEVICE_USER_ID);
                  console.log("appConfig row", row);
                  toast("Logged appConfig to console", { variant: "info" });
                }}
              >
                <Text variant="body" weight="medium">
                  Log appConfig row
                </Text>
                <ChevronRight size={16} className="text-base-content/30" />
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between border-b border-base-content/8 py-3 text-left"
                onClick={async () => {
                  const snapshot = await readTasbeehSnapshot();
                  console.log("tasbeeh snapshot", snapshot);
                  toast("Logged tasbeeh snapshot to console", {
                    variant: "info",
                  });
                }}
              >
                <Text variant="body" weight="medium">
                  Log tasbeeh snapshot
                </Text>
                <ChevronRight size={16} className="text-base-content/30" />
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between border-b border-base-content/8 py-3 text-left"
                onClick={async () => {
                  const collections = await listCollections();
                  console.log("tasbeeh collections", collections);
                  const fatima = collections[0]?.id
                    ? await getCollectionDetails(collections[0].id)
                    : null;
                  console.log("first collection details", fatima);
                  toast("Logged collections to console", { variant: "info" });
                }}
              >
                <Text variant="body" weight="medium">
                  Log tasbeeh collections
                </Text>
                <ChevronRight size={16} className="text-base-content/30" />
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between py-3 text-left"
                onClick={async () => {
                  await tasbeehDb.appConfig.delete(DEVICE_USER_ID);
                  toast("Deleted appConfig row", { variant: "warning" });
                }}
              >
                <Text variant="body" weight="medium">
                  Delete appConfig row
                </Text>
                <ChevronRight size={16} className="text-base-content/30" />
              </button>
            </List>
          </Squircle>
        ) : null}

        <Drawer
          isOpen={showThemeSheet}
          onClose={() => setShowThemeSheet(false)}
          title="Theme"
          snapPoints={["34%"]}
        >
          <Squircle
            cornerRadius={22}
            cornerSmoothing={0.9}
            className="mb-4 w-full px-1"
          >
            {[
              { key: "light", label: "Light" },
              { key: "dark", label: "Dark" },
            ].map((item, index, array) => {
              const isSelected = appearance.theme === item.key;
              const isLast = index === array.length - 1;

              return (
                <button
                  key={item.key}
                  type="button"
                  className={`w-full select-none border-base-content/8 py-3.5 text-left transition-colors ${
                    isLast ? "" : "border-b"
                  }`}
                  onClick={() => {
                    setAppearance({ theme: item.key as "light" | "dark" });
                    setTheme(item.key as "light" | "dark");
                    window.setTimeout(() => {
                      setShowThemeSheet(false);
                    }, 280);
                  }}
                >
                  <div
                    className={`flex items-center justify-between rounded-xl px-2 py-3 ${
                      isSelected ? "bg-primary/10" : ""
                    }`}
                  >
                    <Text
                      variant="body"
                      weight={isSelected ? "semibold" : "medium"}
                      className={isSelected ? "text-primary" : undefined}
                    >
                      {item.label}
                    </Text>
                    <ChevronRight
                      size={isSelected ? 18 : 16}
                      className={
                        isSelected ? "text-primary" : "text-base-content/30"
                      }
                    />
                  </div>
                </button>
              );
            })}
          </Squircle>
        </Drawer>

        <Drawer
          isOpen={showAnimationSheet}
          onClose={() => setShowAnimationSheet(false)}
          title="Animation Intensity"
          snapPoints={["40%"]}
        >
          <Squircle
            cornerRadius={22}
            cornerSmoothing={0.9}
            className="mb-4 w-full px-1"
          >
            {[
              { key: "full", label: "Full" },
              { key: "reduced", label: "Reduced" },
              { key: "off", label: "None" },
            ].map((item, index, array) => {
              const isSelected = appearance.animationLevel === item.key;
              const isLast = index === array.length - 1;

              return (
                <button
                  key={item.key}
                  type="button"
                  className={`w-full select-none border-base-content/8 py-3.5 text-left transition-colors ${
                    isLast ? "" : "border-b"
                  }`}
                  onClick={() => {
                    setAppearance({
                      animationLevel:
                        item.key as typeof appearance.animationLevel,
                    });
                    setShowAnimationSheet(false);
                  }}
                >
                  <div
                    className={`flex items-center justify-between rounded-xl px-2 py-3 ${
                      isSelected ? "bg-primary/10" : ""
                    }`}
                  >
                    <Text
                      variant="body"
                      weight={isSelected ? "semibold" : "medium"}
                      className={isSelected ? "text-primary" : undefined}
                    >
                      {item.label}
                    </Text>
                    <ChevronRight
                      size={isSelected ? 18 : 16}
                      className={
                        isSelected ? "text-primary" : "text-base-content/30"
                      }
                    />
                  </div>
                </button>
              );
            })}
          </Squircle>
        </Drawer>

        <Drawer
          isOpen={showHapticsSheet}
          onClose={() => setShowHapticsSheet(false)}
          title="Haptics Intensity"
          snapPoints={["40%"]}
        >
          <Squircle
            cornerRadius={22}
            cornerSmoothing={0.9}
            className="mb-4 w-full px-1"
          >
            {[
              { key: "light", label: "Light" },
              { key: "medium", label: "Medium" },
              { key: "strong", label: "Strong" },
            ].map((item, index, array) => {
              const isSelected = interaction.hapticsIntensity === item.key;
              const isLast = index === array.length - 1;

              return (
                <button
                  key={item.key}
                  type="button"
                  className={`w-full select-none border-base-content/8 py-3.5 text-left transition-colors ${
                    isLast ? "" : "border-b"
                  }`}
                  onClick={() => {
                    const next =
                      item.key as typeof interaction.hapticsIntensity;
                    setInteraction({ hapticsIntensity: next });
                    previewHaptics(next);
                    setShowHapticsSheet(false);
                  }}
                >
                  <div
                    className={`flex items-center justify-between rounded-xl px-2 py-3 ${
                      isSelected ? "bg-primary/10" : ""
                    }`}
                  >
                    <Text
                      variant="body"
                      weight={isSelected ? "semibold" : "medium"}
                      className={isSelected ? "text-primary" : undefined}
                    >
                      {item.label}
                    </Text>
                    <ChevronRight
                      size={isSelected ? 18 : 16}
                      className={
                        isSelected ? "text-primary" : "text-base-content/30"
                      }
                    />
                  </div>
                </button>
              );
            })}
          </Squircle>
        </Drawer>

        <Squircle
          cornerRadius={26}
          cornerSmoothing={0.85}
          className="surface-card w-full p-5"
        >
          <div className="mb-2 flex items-center gap-2">
            <Globe size={16} className="text-primary" />
            <Text variant="heading" weight="semibold">
              App Controls
            </Text>
          </div>
          <List variant="spaced" gap={0}>
            <div className="border-b border-base-content/8 py-3">
              <button
                type="button"
                onClick={() => setShowLanguageSheet(true)}
                className="flex w-full select-none items-center justify-between text-left"
              >
                <div>
                  <Text variant="body" weight="medium">
                    Language
                  </Text>
                  <Text variant="body" color="subtle" className="capitalize">
                    {language}
                  </Text>
                </div>
                <ChevronRight size={16} className="text-base-content/30" />
              </button>
            </div>
            <ToggleRow
              title="Large text mode"
              checked={accessibility.largeText}
              onToggle={(checked) => setAccessibility({ largeText: checked })}
            />
            <ToggleRow
              title="High contrast"
              checked={accessibility.highContrast}
              onToggle={(checked) =>
                setAccessibility({ highContrast: checked })
              }
            />
            <ToggleRow
              title="Reduce motion"
              checked={accessibility.reduceMotion}
              onToggle={(checked) =>
                setAccessibility({ reduceMotion: checked })
              }
            />
            <ToggleRow
              title="Daily reminders"
              checked={notifications.enabled}
              onToggle={(checked) => {
                setNotifications({
                  enabled: checked,
                  streakReminderEnabled: checked
                    ? notifications.streakReminderEnabled
                    : false,
                });
                if (!checked) {
                  setShowReminderTimeSheet(false);
                }
              }}
            />
            <button
              type="button"
              disabled={!notifications.enabled}
              onClick={() => setShowReminderTimeSheet(true)}
              className={`flex w-full select-none items-center justify-between py-3 text-left ${
                notifications.enabled
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-45"
              }`}
            >
              <div>
                <Text variant="body" weight="medium">
                  Daily reminder time
                </Text>
                <Text variant="body" color="subtle">
                  {reminderTimeLabel}
                </Text>
              </div>
              <ChevronRight
                size={16}
                className={
                  notifications.enabled
                    ? "text-base-content/30"
                    : "text-base-content/20"
                }
              />
            </button>
          </List>
        </Squircle>

        <Drawer
          isOpen={showLanguageSheet}
          onClose={() => setShowLanguageSheet(false)}
          title="Language"
          snapPoints={["40%"]}
        >
          <Squircle
            cornerRadius={22}
            cornerSmoothing={0.9}
            className="mb-4 w-full px-1"
          >
            {[
              { key: "english", label: "English" },
              { key: "arabic", label: "Arabic" },
              { key: "urdu", label: "Urdu" },
            ].map((item, index, array) => {
              const isSelected = language === item.key;
              const isLast = index === array.length - 1;

              return (
                <button
                  key={item.key}
                  type="button"
                  className={`w-full select-none border-base-content/8 py-3.5 text-left transition-colors ${
                    isLast ? "" : "border-b"
                  }`}
                  onClick={() => {
                    setLanguage(item.key as typeof language);
                    setShowLanguageSheet(false);
                  }}
                >
                  <div
                    className={`flex items-center justify-between rounded-xl px-2 py-3 ${
                      isSelected ? "bg-primary/10" : ""
                    }`}
                  >
                    <Text
                      variant="body"
                      weight={isSelected ? "semibold" : "medium"}
                      className={isSelected ? "text-primary" : undefined}
                    >
                      {item.label}
                    </Text>
                    <ChevronRight
                      size={isSelected ? 18 : 16}
                      className={
                        isSelected ? "text-primary" : "text-base-content/30"
                      }
                    />
                  </div>
                </button>
              );
            })}
          </Squircle>
        </Drawer>

        <Drawer
          isOpen={showReminderTimeSheet}
          onClose={() => setShowReminderTimeSheet(false)}
          title="Daily Reminder Time"
          snapPoints={["46%"]}
        >
          <Squircle
            cornerRadius={22}
            cornerSmoothing={0.9}
            className="mb-4 w-full px-1"
          >
            <div className="px-2 py-3">
              <TimePicker
                value={reminderTime}
                onChange={(next) =>
                  setNotifications({
                    dailyReminderTime: `${String(next.hour).padStart(2, "0")}:${String(next.minute).padStart(2, "0")}`,
                  })
                }
                hourFormat="12h"
              />
            </div>
          </Squircle>
        </Drawer>

        <Squircle
          cornerRadius={26}
          cornerSmoothing={0.85}
          className="surface-card w-full p-5"
        >
          <div className="mb-2 flex items-center gap-2">
            <Info size={16} className="text-primary" />
            <Text variant="heading" weight="semibold">
              Support & Trust
            </Text>
          </div>
          <List variant="spaced" gap={0}>
            <button
              type="button"
              onClick={() => navigate("/settings/feedback")}
              className="flex w-full select-none items-center justify-between border-b border-base-content/8 py-3 text-left"
            >
              <Text variant="body" weight="medium">
                App feedback
              </Text>
              <ChevronRight size={16} className="text-base-content/30" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/settings/about")}
              className="flex w-full select-none items-center justify-between border-b border-base-content/8 py-3 text-left"
            >
              <Text variant="body" weight="medium">
                About app
              </Text>
              <ChevronRight size={16} className="text-base-content/30" />
            </button>
            <button
              type="button"
              onClick={() => setShowLogoutSheet(true)}
              className="flex w-full select-none items-center justify-between border-b border-base-content/8 py-3 text-left"
            >
              <Text variant="body" weight="medium">
                Log out
              </Text>
              <ChevronRight size={16} className="text-base-content/30" />
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteSheet(true)}
              className="flex w-full select-none items-center justify-between py-3 text-left"
            >
              <Text variant="body" weight="medium" className="text-error">
                Delete account
              </Text>
              <ChevronRight size={16} className="text-error/70" />
            </button>
          </List>
        </Squircle>

        <Squircle
          cornerRadius={26}
          cornerSmoothing={0.85}
          className="surface-card w-full p-5"
        >
          <div className="mb-2 flex items-center gap-3">
            <ShieldAlert size={18} className="text-warning" />
            <Text variant="body" weight="medium">
              Upcoming Improvements
            </Text>
          </div>
          <div className="divide-y divide-base-content/8">
            {[
              "Quiet Hours / Focus Mode",
              "Data Export / Import",
              "Privacy Blur Mode",
              "Haptic Pattern Preview",
              "Adaptive Reminder Frequency",
              "Reset Controls",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between py-3"
              >
                <Text variant="body">{item}</Text>
                <Badge variant="neutral" size="sm">
                  Coming soon
                </Badge>
              </div>
            ))}
          </div>
        </Squircle>
      </div>

      <SettingsActionSheet
        isOpen={showLogoutSheet}
        onClose={() => setShowLogoutSheet(false)}
        icon={LogOut}
        title="Logout"
        description="Logging out will end your current session on this device. You can sign in again anytime."
        primaryButtonTitle="Logout"
        onPrimaryPress={() => {
          setShowLogoutSheet(false);
          toast("Logged out", {
            variant: "success",
            description: "You have been signed out from this device.",
          });
        }}
      />

      <SettingsActionSheet
        isOpen={showDeleteSheet}
        onClose={() => setShowDeleteSheet(false)}
        icon={Trash2}
        title="Delete account"
        description="This action is irreversible. Please review carefully before proceeding."
        primaryButtonTitle="Delete"
        primaryCooldownSeconds={5}
        onPrimaryPress={() => {
          setShowDeleteSheet(false);
          toast("Delete account", {
            variant: "warning",
            description:
              "Delete flow placeholder. We can wire the full flow next.",
          });
        }}
        iconWrapperClassName="border border-error/45 bg-error/12 text-error"
        primaryButtonClassName="bg-error text-white"
      />
    </>
  );
}
