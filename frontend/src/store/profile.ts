import { create } from "zustand";
import type { Evidence, ReputationRecord } from "@/lib/genlayer/types";

const CACHE_TTL_MS = 5 * 60 * 1000;

interface ProfileState {
  evidence: Evidence | null;
  reputation: ReputationRecord | null;
  lastFetched: number;
  setEvidence: (ev: Evidence) => void;
  setReputation: (rep: ReputationRecord) => void;
  isStale: () => boolean;
  clear: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  evidence: null,
  reputation: null,
  lastFetched: 0,
  setEvidence:   (evidence)   => set({ evidence, lastFetched: Date.now() }),
  setReputation: (reputation) => set({ reputation }),
  isStale: () => Date.now() - get().lastFetched > CACHE_TTL_MS,
  clear:   () => set({ evidence: null, reputation: null, lastFetched: 0 }),
}));
