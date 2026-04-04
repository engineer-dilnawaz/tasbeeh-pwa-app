import { useQuery } from "@tanstack/react-query";
import { fetchAsmaUlHusna, getIslamicApiKey } from "@/features/tasbeeh/api/islamicApi";
import type { LocaleCode } from "@/services/remoteConfig/types";

export const asmaUlHusnaQueryKey = ["islamicapi", "asma-ul-husna"] as const;

export function useAsmaUlHusna(locale: LocaleCode) {
  const hasKey = Boolean(getIslamicApiKey());

  return useQuery({
    queryKey: [...asmaUlHusnaQueryKey, locale],
    queryFn: () => fetchAsmaUlHusna(locale),
    staleTime: 1000 * 60 * 60 * 6,
    retry: 1,
    enabled: hasKey,
  });
}
