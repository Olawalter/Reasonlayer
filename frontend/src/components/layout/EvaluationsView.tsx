"use client";

import { useAccount } from "wagmi";
import { useEvaluations } from "@/hooks/useEvaluations";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Clock, Zap } from "lucide-react";
import Link from "next/link";
import type { TrustTier } from "@/lib/genlayer/types";

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function EvaluationsView() {
  const { address } = useAccount();
  const { data: evaluations, isLoading } = useEvaluations(address);

  if (!address) return (
    <div className="text-secondary-text text-sm">Connect your wallet to view evaluations.</div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Evaluation History</h1>
        <p className="text-secondary-text text-sm mt-1">AI trust evaluations performed on your address</p>
      </div>

      {isLoading ? (
        <Spinner />
      ) : !evaluations || evaluations.length === 0 ? (
        <div className="text-center py-16">
          <Clock size={40} className="text-secondary-text/30 mx-auto mb-4" />
          <p className="text-secondary-text text-sm">No evaluations yet.</p>
          <Link href={`/passport/${address}`} className="mt-4 inline-flex items-center gap-2 text-ai-cyan hover:underline text-sm">
            <Zap size={14} /> Request your first evaluation
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {evaluations.map((ev) => (
            <Card key={ev.ev_id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="tier" tier={ev.tier as TrustTier}>{ev.tier}</Badge>
                    <span className="text-xs text-secondary-text font-mono">
                      {ev.address.slice(0, 6)}…{ev.address.slice(-4)}
                    </span>
                  </div>
                  <p className="text-sm text-primary-text">{ev.summary}</p>
                  {ev.risk_factors?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ev.risk_factors.map((f, i) => <Badge key={i} variant="warning">{f}</Badge>)}
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-primary-text">{ev.score}</p>
                  <p className="text-xs text-secondary-text">/ 100</p>
                  <p className="text-xs text-secondary-text mt-1">{formatDate(ev.evaluated_at)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
