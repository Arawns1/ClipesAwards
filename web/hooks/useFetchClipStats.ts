import { ClipeStatsDTO } from "@/@types/Clipe";
import { getClipStats } from "@/lib/api/clips";
import { useQuery } from "@tanstack/react-query";

export function useFetchClipStats(clipId: string) {
  return useQuery<ClipeStatsDTO>({
    queryKey: ["clip-stats", clipId],
    queryFn: ({ signal }) => getClipStats(clipId, signal),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
