"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchReputation, fetchEvaluationHistory, fetchHasReputation } from "@/lib/genlayer/contract";

export function useReputation(address?: string) {
  return useQuery({
    queryKey: ["reputation", address],
    queryFn: () => fetchReputation(address!),
    enabled: !!address,
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}

export function useEvaluationHistory(address?: string) {
  return useQuery({
    queryKey: ["eval_history", address],
    queryFn: () => fetchEvaluationHistory(address!),
    enabled: !!address,
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}

export function useHasReputation(address?: string) {
  return useQuery({
    queryKey: ["has_reputation", address],
    queryFn: () => fetchHasReputation(address!),
    enabled: !!address,
    staleTime: 60 * 1000,
    retry: false,
  });
}
