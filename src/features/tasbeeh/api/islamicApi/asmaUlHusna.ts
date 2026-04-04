import { islamicApiInstance } from "@/services/api/islamicApiInstance";
import { ISLAMIC_API_ORIGIN } from "./config";
import type { AsmaUlHusnaData, AsmaUlHusnaErrorResponse, AsmaUlHusnaSuccessResponse } from "./types";

/**
 * GET `/asma-ul-husna/?language=`
 * @param language ISO code (e.g. en, ur, ar)
 */
export async function fetchAsmaUlHusna(language: string): Promise<AsmaUlHusnaData> {
  // Using the centralized instance (automatically attaches API key)
  const { data } = await islamicApiInstance.get<AsmaUlHusnaSuccessResponse | AsmaUlHusnaErrorResponse>(
    "/asma-ul-husna/",
    {
      params: { language: language.trim() || "en" },
    }
  );

  if (!data || typeof data !== "object") {
    throw new Error("Invalid Asma-ul-Husna response");
  }

  // Handle API-specific error status even with 2xx HTTP response
  if ("status" in data && data.status === "error") {
    throw new Error(data.message || "Asma-ul-Husna request failed");
  }

  // Success data validation
  if (!("data" in data) || !data.data) {
    throw new Error("Unexpected Asma-ul-Husna response structure");
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
