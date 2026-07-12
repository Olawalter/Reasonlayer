"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchReputation } from "@/lib/genlayer/contract";

// TrustPassport now maps to reputation record
export function useTrustPassport(address: string | null | undefined) {
  return useQuery({
    queryKey: ["trust_passport", address],
    queryFn: () => fetchReputation(address!),
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
