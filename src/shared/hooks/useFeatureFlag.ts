import type { FeatureFlags } from "@/services/remoteConfig/types";
import { useRemoteConfig } from "./useRemoteConfig";

export function useFeatureFlag<K extends keyof FeatureFlags>(key: K): boolean {
  return useRemoteConfig().flags[key];
}
