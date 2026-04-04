/** Official IslamicAPI HTTP API (asma-ul-husna, etc.). @see https://islamicapi.com/doc/asma-ul-husna/ */
export const ISLAMIC_API_ORIGIN = "https://islamicapi.com";
export const ISLAMIC_API_V1_BASE = `${ISLAMIC_API_ORIGIN}/api/v1`;

export function getIslamicApiKey(): string | undefined {
  const k = import.meta.env.VITE_ISLAMIC_API_KEY?.trim();
  return k || undefined;
}
