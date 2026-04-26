import { create } from "zustand";

import {
  patchAppConfigData,
  readAppConfigData,
} from "@/features/settings/services/appConfigRepository";
import { updateUserSettings } from "@/services/firebase/userService";
import { auth } from "@/services/firebase/config";

export type AnimationLevel = "full" | "reduced" | "off";
export type HapticIntensity = "light" | "medium" | "strong";
export type BeadSoundType = "click" | "wood" | "soft";
export type AppLanguage = "english" | "arabic" | "urdu";

export interface ProfileSettings {
  displayName: string;
  email: string;
  username: string;
  avatarUrl: string;
  bio: string;
  profileVisible: boolean;
}

export interface AppearanceSettings {
  theme: "light" | "dark";
  animationLevel: AnimationLevel;
  bottomNavVariant: "bar" | "glass-dock";
}

export interface InteractionSettings {
  hapticsEnabled: boolean;
  hapticsIntensity: HapticIntensity;
  beadSoundEnabled: boolean;
  beadSoundType: BeadSoundType;
}

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
}

export interface NotificationSettings {
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
      displayName: "Guest",
      email: "guest@example.com",
      username: "@traveler",
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
      beadSoundEnabled: true,
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
      
      // Sync theme to localStorage cache for flash prevention on next load
      if (data.appearance.theme) {
        localStorage.setItem("tasbeeh-theme", data.appearance.theme);
      }
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

    setProfile: (patch) => {
      set((state) => ({ profile: { ...state.profile, ...patch } }));
      const user = auth.currentUser;
      if (user) {
        void updateUserSettings(user.uid, { profile: { ...get().profile } });
      }
    },
    setAppearance: (patch) => {
      set((state) => ({ appearance: { ...state.appearance, ...patch } }));
      const next = { ...get().appearance };

      // Sync theme to localStorage cache for flash prevention on next load
      if (patch.theme) {
        localStorage.setItem("tasbeeh-theme", patch.theme);
      }

      void patchAppConfigData({
        appearance: next,
      });

      const user = auth.currentUser;
      if (user) {
        void updateUserSettings(user.uid, { "settings.appearance": next });
      }
    },
    setInteraction: (patch) => {
      set((state) => ({ interaction: { ...state.interaction, ...patch } }));
      const next = { ...get().interaction };
      void patchAppConfigData({
        interaction: next,
      });

      const user = auth.currentUser;
      if (user) {
        void updateUserSettings(user.uid, { "settings.interaction": next });
      }
    },
    setLanguage: (language) => {
      set({ language });
      void patchAppConfigData({
        language: {
          appLanguage: language,
        },
      });

      const user = auth.currentUser;
      if (user) {
        void updateUserSettings(user.uid, { "settings.language": language });
      }
    },
    setAccessibility: (patch) => {
      set((state) => ({ accessibility: { ...state.accessibility, ...patch } }));
      const next = { ...get().accessibility };
      void patchAppConfigData({
        accessibility: next,
      });

      const user = auth.currentUser;
      if (user) {
        void updateUserSettings(user.uid, { "settings.accessibility": next });
      }
    },
    setNotifications: (patch) => {
      set((state) => ({ notifications: { ...state.notifications, ...patch } }));
      const next = { ...get().notifications };
      void patchAppConfigData({
        notifications: next,
      });

      const user = auth.currentUser;
      if (user) {
        void updateUserSettings(user.uid, { "settings.notifications": next });
      }
    },
  }),
);
