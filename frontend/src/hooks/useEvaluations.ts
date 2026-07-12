"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEvaluationHistory } from "@/lib/genlayer/contract";

export function useEvaluations(address: string | null | undefined) {
  return useQuery({
    queryKey: ["evaluations", address],
    queryFn: () => fetchEvaluationHistory(address!),
    enabled: !!address,
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}
