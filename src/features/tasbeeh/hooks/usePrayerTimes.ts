import { useQuery } from "@tanstack/react-query";
import { fetchPrayerTimes } from "@/features/tasbeeh/api/islamicApi";

export const prayerTimesQueryKey = ["islamicapi", "prayer-times"] as const;

/**
 * Hook to retrieve monthly prayer times for the user's current coordinates OR address.
 */
export function usePrayerTimes(lat?: number | null, lon?: number | null, address?: string) {
  return useQuery({
    queryKey: [...prayerTimesQueryKey, lat, lon, address],
    queryFn: () => fetchPrayerTimes(lat, lon, address),
    // Cache for 24 hours as timings rarely shift mid-month
    staleTime: 1000 * 60 * 60 * 24,
    retry: 1,
  });
}
