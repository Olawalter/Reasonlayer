"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEvidence, fetchHasEvidence } from "@/lib/genlayer/contract";

export function useEvidence(address?: string) {
  return useQuery({
    queryKey: ["evidence", address],
    queryFn: () => fetchEvidence(address!),
    enabled: !!address,
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}

export function useHasEvidence(address?: string) {
  return useQuery({
    queryKey: ["has_evidence", address],
    queryFn: () => fetchHasEvidence(address!),
    enabled: !!address,
    staleTime: 60 * 1000,
    retry: false,
  });
}
