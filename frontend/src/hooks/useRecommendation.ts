"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRecommendation } from "@/lib/genlayer/contract";

export function useRecommendation(address?: string) {
  return useQuery({
    queryKey: ["recommendation", address],
    queryFn: () => fetchRecommendation(address!),
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
