import { create } from "zustand";

import {
  patchAppConfigData,
  readAppConfigData,
} from "@/features/settings/services/appConfigRepository";

export type AnimationLevel = "full" | "reduced" | "off";
export type HapticIntensity = "light" | "medium" | "strong";
export type BeadSoundType = "click" | "wood" | "soft";
export type AppLanguage = "english" | "arabic" | "urdu";

interface ProfileSettings {
  displayName: string;
  email: string;
  username: string;
  avatarUrl: string;
  bio: string;
  profileVisible: boolean;
}

interface AppearanceSettings {
  theme: "light" | "dark";
  animationLevel: AnimationLevel;
  bottomNavVariant: "bar" | "glass-dock";
}

interface InteractionSettings {
  hapticsEnabled: boolean;
  hapticsIntensity: HapticIntensity;
  beadSoundEnabled: boolean;
  beadSoundType: BeadSoundType;
}

interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
}

interface NotificationSettings {
  enabled: boolean;
  dailyReminderTime: string;
  streakReminderEnabled: boolean;
  hourFormat: "12h" | "24h";
}

interface SettingsState {
  profile: ProfileSettings;
  appearance: AppearanceSettings;
  interaction: InteractionSettings;
  language: AppLanguage;
  accessibility: AccessibilitySettings;
  notifications: NotificationSettings;
  isHydrated: boolean;
  hydrateFromDb: () => Promise<void>;
  setProfile: (patch: Partial<ProfileSettings>) => void;
  setAppearance: (patch: Partial<AppearanceSettings>) => void;
  setInteraction: (patch: Partial<InteractionSettings>) => void;
  setLanguage: (language: AppLanguage) => void;
  setAccessibility: (patch: Partial<AccessibilitySettings>) => void;
  setNotifications: (patch: Partial<NotificationSettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  (set, get) => ({
    profile: {
      displayName: "Dilnawaz Khan",
      email: "dilnawaz@example.com",
      username: "@dilnawaz",
      avatarUrl: "",
      bio: "",
      profileVisible: true,
    },
    appearance: {
      theme: "light",
      animationLevel: "full",
      bottomNavVariant: "bar",
    },
    interaction: {
      hapticsEnabled: true,
      hapticsIntensity: "medium",
      beadSoundEnabled: false,
      beadSoundType: "click",
    },
    language: "english",
    accessibility: {
      largeText: false,
      highContrast: false,
      reduceMotion: false,
    },
    notifications: {
      enabled: true,
      dailyReminderTime: "05:30",
      streakReminderEnabled: true,
      hourFormat: "24h",
    },
    isHydrated: false,

    hydrateFromDb: async () => {
      const data = await readAppConfigData();
      set({
        appearance: {
          ...get().appearance,
          theme: data.appearance.theme,
          animationLevel: data.appearance.animationLevel,
          bottomNavVariant: data.appearance.bottomNavVariant,
        },
        interaction: {
          ...get().interaction,
          hapticsEnabled: data.interaction.hapticsEnabled,
          hapticsIntensity: data.interaction.hapticsIntensity,
          beadSoundEnabled: data.interaction.beadSoundEnabled,
          beadSoundType: data.interaction.beadSoundType,
        },
        accessibility: {
          ...get().accessibility,
          largeText: data.accessibility.largeText,
          highContrast: data.accessibility.highContrast,
          reduceMotion: data.accessibility.reduceMotion,
        },
        notifications: {
          ...get().notifications,
          enabled: data.notifications.enabled,
          dailyReminderTime: data.notifications.dailyReminderTime,
          streakReminderEnabled: data.notifications.streakReminderEnabled,
        },
        language: data.language.appLanguage,
        isHydrated: true,
      });
    },

    setProfile: (patch) => set((state) => ({ profile: { ...state.profile, ...patch } })),
    setAppearance: (patch) => {
      set((state) => ({ appearance: { ...state.appearance, ...patch } }));
      const next = { ...get().appearance, ...patch };
      void patchAppConfigData({
        appearance: {
          theme: next.theme,
          animationLevel: next.animationLevel,
          bottomNavVariant: next.bottomNavVariant,
        },
      });
    },
    setInteraction: (patch) => {
      set((state) => ({ interaction: { ...state.interaction, ...patch } }));
      const next = { ...get().interaction, ...patch };
      void patchAppConfigData({
        interaction: {
          hapticsEnabled: next.hapticsEnabled,
          hapticsIntensity: next.hapticsIntensity,
          beadSoundEnabled: next.beadSoundEnabled,
          beadSoundType: next.beadSoundType,
        },
      });
    },
    setLanguage: (language) => {
      set({ language });
      void patchAppConfigData({
        language: {
          appLanguage: language,
        },
      });
    },
    setAccessibility: (patch) => {
      set((state) => ({ accessibility: { ...state.accessibility, ...patch } }));
      const next = { ...get().accessibility, ...patch };
      void patchAppConfigData({
        accessibility: {
          largeText: next.largeText,
          highContrast: next.highContrast,
          reduceMotion: next.reduceMotion,
        },
      });
    },
    setNotifications: (patch) => {
      set((state) => ({ notifications: { ...state.notifications, ...patch } }));
      const next = { ...get().notifications, ...patch };
      void patchAppConfigData({
        notifications: {
          enabled: next.enabled,
          dailyReminderTime: next.dailyReminderTime,
          streakReminderEnabled: next.streakReminderEnabled,
        },
      });
    },
  }),
);

