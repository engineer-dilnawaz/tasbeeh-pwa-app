import deepmerge from "deepmerge";
import { DEVICE_USER_ID, type AppConfigRow, tasbeehDb } from "@/features/tasbeeh/services/tasbeehDb";
import type {
  AnimationLevel,
  AppLanguage,
  BeadSoundType,
  HapticIntensity,
} from "@/features/settings/store/settingsStore";

export type BottomNavVariant = "bar" | "glass-dock";

export interface AppConfigData {
  appearance: {
    theme: "light" | "dark";
    animationLevel: AnimationLevel;
    bottomNavVariant: BottomNavVariant;
  };
  language: {
    appLanguage: AppLanguage;
  };
  interaction: {
    hapticsEnabled: boolean;
    hapticsIntensity: HapticIntensity;
    beadSoundEnabled: boolean;
    beadSoundType: BeadSoundType;
  };
  accessibility: {
    largeText: boolean;
    highContrast: boolean;
    reduceMotion: boolean;
  };
  notifications: {
    enabled: boolean;
    dailyReminderTime: string; // "HH:MM" (24h internal)
    streakReminderEnabled: boolean;
  };
}

const APP_CONFIG_SCHEMA_VERSION = 1 as const;

export const DEFAULT_APP_CONFIG: AppConfigData = {
  appearance: {
    theme: "light",
    animationLevel: "full",
    bottomNavVariant: "bar",
  },
  language: {
    appLanguage: "english",
  },
  interaction: {
    hapticsEnabled: true,
    hapticsIntensity: "medium",
    beadSoundEnabled: false,
    beadSoundType: "click",
  },
  accessibility: {
    largeText: false,
    highContrast: false,
    reduceMotion: false,
  },
  notifications: {
    enabled: true,
    dailyReminderTime: "05:30",
    streakReminderEnabled: true,
  },
};

export async function getOrCreateAppConfig(
  userId: string = DEVICE_USER_ID,
): Promise<AppConfigRow> {
  const existing = await tasbeehDb.appConfig.get(userId);
  if (existing) return existing;

  const now = new Date().toISOString();
  const row: AppConfigRow = {
    id: userId,
    userId,
    schemaVersion: APP_CONFIG_SCHEMA_VERSION,
    data: DEFAULT_APP_CONFIG as unknown as Record<string, unknown>,
    updatedAt: now,
    syncStatus: "local",
    lastSyncedAt: null,
  };
  await tasbeehDb.appConfig.put(row);
  return row;
}

export async function readAppConfigData(
  userId: string = DEVICE_USER_ID,
): Promise<AppConfigData> {
  const row = await getOrCreateAppConfig(userId);
  const data = normalizeAppConfigData(row.data);
  return data;
}

export async function patchAppConfigData(
  patch: PartialDeep<AppConfigData>,
  userId: string = DEVICE_USER_ID,
): Promise<AppConfigData> {
  const row = await getOrCreateAppConfig(userId);
  const current = normalizeAppConfigData(row.data);
  const next = deepmerge(current, patch as any) as AppConfigData;

  const now = new Date().toISOString();
  await tasbeehDb.appConfig.put({
    ...row,
    data: next as unknown as Record<string, unknown>,
    updatedAt: now,
    syncStatus: "pending",
  });

  return next;
}

type PartialDeep<T> = T extends object
  ? { [K in keyof T]?: PartialDeep<T[K]> }
  : T;

function normalizeAppConfigData(input: Record<string, unknown>): AppConfigData {
  const parsed = input as Partial<AppConfigData>;
  return deepmerge(DEFAULT_APP_CONFIG, parsed as any) as AppConfigData;
}

