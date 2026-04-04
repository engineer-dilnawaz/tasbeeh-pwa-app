import axios from "axios";
import { getIslamicApiKey, ISLAMIC_API_ORIGIN, ISLAMIC_API_V1_BASE } from "./config";
import type { AsmaUlHusnaData, AsmaUlHusnaErrorResponse, AsmaUlHusnaSuccessResponse } from "./types";

/**
 * GET `/asma-ul-husna/?language=&api_key=`
 * @param language ISO code (e.g. en, ur, ar) — see API docs for full list.
 */
export async function fetchAsmaUlHusna(language: string): Promise<AsmaUlHusnaData> {
  const apiKey = getIslamicApiKey();
  if (!apiKey) {
    throw new Error("Missing VITE_ISLAMIC_API_KEY");
  }

  const { data } = await axios.get<AsmaUlHusnaSuccessResponse | AsmaUlHusnaErrorResponse>(
    `${ISLAMIC_API_V1_BASE}/asma-ul-husna/`,
    {
      params: {
        language: language.trim() || "en",
        api_key: apiKey,
      },
      timeout: 25_000,
      validateStatus: () => true,
    },
  );

  if (!data || typeof data !== "object") {
    throw new Error("Invalid Asma-ul-Husna response");
  }
  if (data.status === "error") {
    throw new Error(data.message || "Asma-ul-Husna request failed");
  }
  if (data.status !== "success" || !data.data) {
    throw new Error("Unexpected Asma-ul-Husna response");
  }

  return data.data;
}

/** Turn relative `audio` paths into absolute URLs for `<audio src>` or links. */
export function resolveAsmaAudioUrl(relativeOrAbsolute: string): string {
  if (!relativeOrAbsolute) return "";
  if (/^https?:\/\//i.test(relativeOrAbsolute)) return relativeOrAbsolute;
  const path = relativeOrAbsolute.startsWith("/") ? relativeOrAbsolute : `/${relativeOrAbsolute}`;
  return `${ISLAMIC_API_ORIGIN}${path}`;
}
