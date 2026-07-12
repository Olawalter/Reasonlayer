"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchValidator, fetchValidatorRegistry } from "@/lib/genlayer/contract";

export function useValidator(address?: string | null) {
  return useQuery({
    queryKey: ["validator", address],
    queryFn: () => fetchValidator(address!),
    enabled: !!address,
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}

export function useValidatorRegistry(limit = 20, offset = 0) {
  return useQuery({
    queryKey: ["validator_registry", limit, offset],
    queryFn: () => fetchValidatorRegistry(limit, offset),
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}
