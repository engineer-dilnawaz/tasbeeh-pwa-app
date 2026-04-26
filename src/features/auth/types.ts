import type {
  AppLanguage,
  AppearanceSettings,
  InteractionSettings,
  NotificationSettings,
  ProfileSettings,
} from "@/features/settings/store/settingsStore";
import { AUTH_METHODS, AUTH_TYPES } from "./constants";

export type AuthMethod = (typeof AUTH_METHODS)[keyof typeof AUTH_METHODS];
export type AuthType = (typeof AUTH_TYPES)[keyof typeof AUTH_TYPES];

/**
 * Represents the structure of a user document in Firestore.
 * Collection: 'users'
 */
export interface UserDocument {
  // Identity
  uid: string;
  email: string;

  // High-level profile info (partially synced with settingsStore)
  profile: ProfileSettings;

  // Aggregated stats (Summary Layer)
  stats: {
    totalTasbeehCount: number;
    currentStreak: number;
    bestStreak: number;
    lastActiveAt: any; // Firestore Timestamp
  };

  // Persisted app settings
  settings: {
    appearance: AppearanceSettings;
    interaction: InteractionSettings;
    notifications: NotificationSettings;
    language: AppLanguage;
  };

  // System metadata
  metadata: {
    createdAt?: any;
    lastLoginAt?: any;
    appVersion?: string;
    platform?: "web" | "ios" | "android";
    isAnonymous: boolean;
  };
}
