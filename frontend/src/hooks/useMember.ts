"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEvidence, fetchHasEvidence } from "@/lib/genlayer/contract";

// In the new flow "member" maps to evidence record
export function useMember(address: string | null | undefined) {
  return useQuery({
    queryKey: ["member", address],
    queryFn: () => fetchEvidence(address!),
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useIsRegistered(address: string | null | undefined) {
  return useQuery({
    queryKey: ["is_registered", address],
    queryFn: () => fetchHasEvidence(address!),
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
  });
}
