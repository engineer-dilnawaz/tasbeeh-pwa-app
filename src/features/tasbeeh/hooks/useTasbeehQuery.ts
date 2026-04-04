import { useQuery } from "@tanstack/react-query";
import { fetchRemoteTasbeeh } from "@/features/tasbeeh/api/islamicApi";

export const tasbeehRemoteQueryKey = ["tasbeeh", "remote"] as const;

export function useTasbeehQuery() {
  return useQuery({
    queryKey: tasbeehRemoteQueryKey,
    queryFn: fetchRemoteTasbeeh,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}
