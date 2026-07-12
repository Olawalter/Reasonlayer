"use client";

import { getReadClient, CONTRACT_ADDRESS } from "./client";
import type {
  Evidence,
  ReputationRecord,
  EvaluationHistoryEntry,
  ValidatorProfile,
  RecommendationResult,
  ContractStats,
} from "./types";

function cast<T>(p: Promise<unknown>): Promise<T> {
  return p as Promise<T>;
}

async function readJson<T>(functionName: string, args: unknown[]): Promise<T | null> {
  const raw = await cast<string>(
    getReadClient().readContract({
      address: CONTRACT_ADDRESS,
      functionName,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      args: args as any,
    })
  );
  if (!raw || raw === "") return null;
  return JSON.parse(raw) as T;
}

async function readBool(functionName: string, args: unknown[]): Promise<boolean> {
  return cast<boolean>(
    getReadClient().readContract({
      address: CONTRACT_ADDRESS,
      functionName,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      args: args as any,
    })
  );
}

export function fetchEvidence(address: string): Promise<Evidence | null> {
  return readJson<Evidence>("get_evidence", [address]);
}

export function fetchReputation(address: string): Promise<ReputationRecord | null> {
  return readJson<ReputationRecord>("get_reputation", [address]);
}

export async function fetchEvaluationHistory(address: string): Promise<EvaluationHistoryEntry[]> {
  const result = await readJson<EvaluationHistoryEntry[]>("get_evaluation_history", [address]);
  return result ?? [];
}

export function fetchValidator(address: string): Promise<ValidatorProfile | null> {
  return readJson<ValidatorProfile>("get_validator", [address]);
}

export async function fetchValidatorRegistry(limit = 20, offset = 0): Promise<ValidatorProfile[]> {
  const result = await readJson<ValidatorProfile[]>("get_validator_registry", [limit, offset]);
  return result ?? [];
}

export function fetchRecommendation(address: string): Promise<RecommendationResult | null> {
  return readJson<RecommendationResult>("get_recommendation", [address]);
}

export async function fetchEndorsements(address: string): Promise<string[]> {
  const result = await readJson<string[]>("get_endorsements", [address]);
  return result ?? [];
}

export function fetchHasEvidence(address: string): Promise<boolean> {
  return readBool("has_evidence", [address]);
}

export function fetchHasReputation(address: string): Promise<boolean> {
  return readBool("has_reputation", [address]);
}

export function fetchStats(): Promise<ContractStats | null> {
  return readJson<ContractStats>("get_stats", []);
}
