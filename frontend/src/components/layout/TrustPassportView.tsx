"use client";

import { useTrustPassport } from "@/hooks/useTrustPassport";
import { useEvaluations } from "@/hooks/useEvaluations";
import { useEvidence } from "@/hooks/useEvidence";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TierRing } from "@/components/ui/TierRing";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import Link from "next/link";
import { ArrowLeft, Clock, Shield, AlertTriangle } from "lucide-react";
import type { TrustTier } from "@/lib/genlayer/types";

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function TrustPassportView({ address }: { address: string }) {
  const { data: reputation, isLoading: repLoading } = useTrustPassport(address);
  const { data: evaluations, isLoading: evLoading } = useEvaluations(address);
  const { data: evidence } = useEvidence(address);

  const shortAddr = `${address.slice(0, 8)}...${address.slice(-6)}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link href={`/validators/${address}`}
          className="inline-flex items-center gap-2 text-secondary-text hover:text-primary-text text-sm transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>
        <Link href="/evaluate">
          <Button size="sm" variant="secondary">Request Re-evaluation</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Passport card */}
        <Card glow className="lg:col-span-2">
          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center shrink-0">
              {repLoading ? (
                <div className="w-28 h-28 rounded-full bg-card animate-pulse" />
              ) : reputation ? (
                <>
                  <div className="relative">
                    <TierRing score={reputation.score} tier={reputation.tier as TrustTier} size={120} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-primary-text">{reputation.score}</span>
                      <span className="text-xs text-secondary-text">/ 100</span>
                    </div>
                  </div>
                  <Badge variant="tier" tier={reputation.tier as TrustTier} className="mt-3">{reputation.tier}</Badge>
                </>
              ) : (
                <div className="w-28 h-28 rounded-full bg-card border border-white/10 flex items-center justify-center">
                  <span className="text-secondary-text text-xs text-center px-2">Not evaluated</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-primary-text">
                {evidence?.moniker ?? shortAddr}
              </h1>
              <p className="text-xs font-mono text-secondary-text mt-0.5">{shortAddr}</p>

              {reputation ? (
                <div className="mt-4 space-y-4">
                  <p className="text-sm text-secondary-text leading-relaxed">{reputation.summary}</p>

                  {reputation.strengths?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-2">
                        <Shield size={11} /> Strengths
                      </div>
                      <ul className="space-y-1">
                        {reputation.strengths.map((s, i) => (
                          <li key={i} className="text-xs text-secondary-text flex items-start gap-1.5">
                            <span className="text-emerald-400 mt-0.5">·</span>{s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {reputation.risk_factors?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-2">
                        <AlertTriangle size={11} /> Risk Factors
                      </div>
                      {reputation.risk_factors.map((r, i) => (
                        <Badge key={i} variant="warning" className="mr-1 mb-1">{r}</Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4 pt-2 border-t border-white/5 text-xs text-secondary-text">
                    <span className="capitalize">Confidence: {reputation.confidence}</span>
                    <span>Evaluated {reputation.evaluation_count}x</span>
                    <span>Last: {formatDate(reputation.last_evaluated_at)}</span>
                  </div>
                </div>
              ) : !repLoading ? (
                <div className="mt-4">
                  <p className="text-sm text-secondary-text">No reputation evaluation for this address yet.</p>
                  <Link href="/evaluate">
                    <Button size="sm" className="mt-3">Request Evaluation</Button>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </Card>

        {/* Tier legend */}
        <Card>
          <CardHeader><CardTitle>Tier System</CardTitle></CardHeader>
          <div className="space-y-2">
            {([
              { tier: "Elite"      as TrustTier, range: "80–100" },
              { tier: "Trusted"    as TrustTier, range: "60–79" },
              { tier: "Silver"     as TrustTier, range: "40–59" },
              { tier: "Bronze"     as TrustTier, range: "20–39" },
              { tier: "Unverified" as TrustTier, range: "0–19" },
            ]).map(({ tier, range }) => (
              <div key={tier} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                <Badge variant="tier" tier={tier}>{tier}</Badge>
                <span className="text-xs font-mono text-secondary-text">{range}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Evaluation history */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-ai-cyan" />
            <CardTitle>Evaluation History</CardTitle>
          </div>
        </CardHeader>
        {evLoading ? (
          <Spinner />
        ) : !evaluations || evaluations.length === 0 ? (
          <p className="text-sm text-secondary-text">No evaluation history yet.</p>
        ) : (
          <div className="space-y-3">
            {[...evaluations].reverse().map((ev) => (
              <div key={ev.ev_id} className="bg-surface rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="tier" tier={ev.tier as TrustTier}>{ev.tier}</Badge>
                    <span className="text-sm font-bold text-primary-text">{ev.score}</span>
                    <Badge variant="secondary" className="capitalize">{ev.confidence}</Badge>
                  </div>
                  <span className="text-xs text-secondary-text">{formatDate(ev.evaluated_at)}</span>
                </div>
                <p className="text-sm text-secondary-text">{ev.summary}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
