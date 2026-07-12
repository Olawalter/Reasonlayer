"use client";

import type { TrustTier } from "@/lib/genlayer/types";
import { TIER_COLORS } from "@/lib/genlayer/types";

interface TierRingProps {
  score: number;
  tier: TrustTier;
  size?: number;
}

export function TierRing({ score, tier, size = 100 }: TierRingProps) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = TIER_COLORS[tier];

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1F2937" strokeWidth={7} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
    </svg>
  );
}
