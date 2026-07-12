import type { TrustTier } from "@/lib/genlayer/types";

export function scoreToTier(score: number): TrustTier {
  if (score < 20) return "Unverified";
  if (score < 40) return "Bronze";
  if (score < 60) return "Silver";
  if (score < 80) return "Trusted";
  return "Elite";
}

export function tierToRange(tier: TrustTier): [number, number] {
  const map: Record<TrustTier, [number, number]> = {
    Unverified: [0,  19],
    Bronze:     [20, 39],
    Silver:     [40, 59],
    Trusted:    [60, 79],
    Elite:      [80, 100],
  };
  return map[tier];
}

export function parseFlagsList(flagsJson: string): string[] {
  try {
    const parsed = JSON.parse(flagsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseAddressList(addressesJson: string): string[] {
  try {
    const parsed = JSON.parse(addressesJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
