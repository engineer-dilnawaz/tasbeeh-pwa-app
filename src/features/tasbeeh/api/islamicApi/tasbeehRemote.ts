import type { TasbeehItem } from "@/shared/types/models";
import { DEFAULT_TASBEEH } from "@/shared/config/constants";
import { apiClient } from "../client";

/** Placeholder remote shape — adjust when wiring a real API */
export interface RemoteTasbeehResponse {
  items: TasbeehItem[];
}

/**
 * Fetches tasbeeh phrases from your API.
 * Until a backend exists, resolves to local defaults after a short delay (demo loading state).
 */
export async function fetchRemoteTasbeeh(): Promise<RemoteTasbeehResponse> {
  if (import.meta.env.VITE_ISLAMIC_API_BASE_URL) {
    const { data } = await apiClient.get<RemoteTasbeehResponse>("/tasbeeh");
    return data;
  }
  await new Promise((r) => setTimeout(r, 280));
  return { items: DEFAULT_TASBEEH.map((t) => ({ ...t })) };
}
