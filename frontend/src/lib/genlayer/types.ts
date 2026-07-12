// On-chain data types — mirrors JSON returned by contract view methods.

export type TrustTier = "Unverified" | "Bronze" | "Silver" | "Trusted" | "Elite";
export type Confidence = "high" | "medium" | "low" | "High" | "Medium" | "Low";
export type Priority = "high" | "medium" | "low";

export interface Evidence {
  address: string;
  moniker: string;
  uptime_pct: number;
  slashing_events: number;
  governance_votes: number;
  delegator_count: number;
  validator_age_days: number;
  missed_blocks: number;
  disputes_won: number;
  disputes_lost: number;
  website: string;
  additional_notes: string;
  submitted_at: number;
}

export interface ReputationRecord {
  address: string;
  score: number;
  tier: TrustTier;
  confidence: string;
  summary: string;
  strengths: string[];
  risk_factors: string[];
  last_evaluated_at: number;
  evaluation_count: number;
}

export interface EvaluationHistoryEntry {
  ev_id: number;
  address: string;
  score: number;
  tier: TrustTier;
  confidence: string;
  summary: string;
  strengths: string[];
  risk_factors: string[];
  evaluated_at: number;
}

export interface ValidatorProfile {
  address: string;
  moniker: string;
  website: string;
  is_active: boolean;
  registered_at: number;
  uptime_pct: number;
  slashing_events: number;
  governance_votes: number;
  delegator_count: number;
}

export interface RecommendationResult {
  for_address: string;
  preferences: {
    security_priority: Priority;
    governance_priority: Priority;
    decentralization_priority: Priority;
    notes: string;
  };
  recommended_address: string;
  confidence: string;
  reasoning: string;
  generated_at: number;
}

export interface Dispute {
  d_id: number;
  target: string;
  raised_by: string;
  reason: string;
  evidence_url: string;
  resolution: "pending" | "upheld" | "rejected";
  ai_verdict: string;
  raised_at: number;
  resolved_at: number;
}

export interface ContractStats {
  total_evaluations: number;
  total_validators: number;
  total_disputes: number;
}

export const TIER_ORDER: TrustTier[] = ["Unverified", "Bronze", "Silver", "Trusted", "Elite"];

export const TIER_COLOR: Record<TrustTier, string> = {
  Unverified: "#94A3B8",
  Bronze:     "#CD7F32",
  Silver:     "#C0C0C0",
  Trusted:    "#3B82F6",
  Elite:      "#06B6D4",
};

// Alias for Badge component
export const TIER_COLORS = TIER_COLOR;

export const TIER_GLOW: Record<TrustTier, string> = {
  Unverified: "shadow-slate-500/20",
  Bronze:     "shadow-amber-700/30",
  Silver:     "shadow-slate-400/30",
  Trusted:    "shadow-blue-500/30",
  Elite:      "shadow-cyan-400/40",
};

export const TIER_BG: Record<TrustTier, string> = {
  Unverified: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  Bronze:     "bg-amber-900/20 text-amber-600 border-amber-700/30",
  Silver:     "bg-slate-400/10 text-slate-300 border-slate-400/30",
  Trusted:    "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Elite:      "bg-cyan-400/10 text-ai-cyan border-ai-cyan/30",
};
