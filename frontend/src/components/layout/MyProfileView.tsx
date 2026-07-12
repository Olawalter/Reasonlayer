"use client";

import { useAccount } from "wagmi";
import { useEvidence, useHasEvidence } from "@/hooks/useEvidence";
import { useTrustPassport } from "@/hooks/useTrustPassport";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TierRing } from "@/components/ui/TierRing";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useState } from "react";
import Link from "next/link";
import { Copy, Check, ExternalLink, FileText, Brain } from "lucide-react";
import type { TrustTier } from "@/lib/genlayer/types";

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return { copy, copied };
}

export function MyProfileView() {
  const { address } = useAccount();
  const { data: evidence, isLoading: evLoading } = useEvidence(address);
  const { data: hasEvidence, isLoading: hasEvLoading } = useHasEvidence(address);
  const { data: reputation } = useTrustPassport(address);
  const { copy, copied } = useCopy(address ?? "");

  if (!address) return <div className="text-secondary-text text-sm">Connect your wallet to view your profile.</div>;
  if (evLoading || hasEvLoading) return <Spinner />;

  const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">My Profile</h1>
        <p className="text-secondary-text text-sm mt-1">Your on-chain validator identity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Identity */}
        <Card glow className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Identity</CardTitle>
              <Link href="/evidence">
                <Button variant="secondary" size="sm"><FileText size={13} /> {hasEvidence ? "Update Evidence" : "Submit Evidence"}</Button>
              </Link>
            </div>
          </CardHeader>

          {evidence ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-ai-cyan/10 border border-ai-cyan/20 flex items-center justify-center text-ai-cyan font-bold text-xl shrink-0">
                  {evidence.moniker?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-primary-text">{evidence.moniker}</p>
                  <button onClick={copy} className="flex items-center gap-1.5 text-xs text-secondary-text mt-0.5 hover:text-primary-text transition-colors">
                    <span className="font-mono">{shortAddr}</span>
                    {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                  </button>
                  {evidence.website && (
                    <a href={evidence.website} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-ai-cyan mt-1 hover:underline">
                      {evidence.website} <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { label: "Uptime",    value: `${evidence.uptime_pct}%` },
                  { label: "Slashing",  value: evidence.slashing_events },
                  { label: "Gov Votes", value: evidence.governance_votes },
                  { label: "Delegators",value: evidence.delegator_count },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center p-3 rounded-lg bg-surface border border-white/8">
                    <p className="text-sm font-bold text-primary-text">{value}</p>
                    <p className="text-xs text-secondary-text mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {evidence.additional_notes && (
                <p className="text-sm text-secondary-text">{evidence.additional_notes}</p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText size={32} className="text-secondary-text/30 mx-auto mb-3" />
              <p className="text-secondary-text text-sm mb-4">No evidence submitted yet.</p>
              <Link href="/evidence">
                <Button>Submit Evidence</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Trust Score */}
        <Card>
          <CardHeader><CardTitle>Reputation</CardTitle></CardHeader>
          {reputation ? (
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <TierRing score={reputation.score} tier={reputation.tier as TrustTier} size={110} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-primary-text">{reputation.score}</span>
                  <span className="text-xs text-secondary-text">/ 100</span>
                </div>
              </div>
              <Badge variant="tier" tier={reputation.tier as TrustTier} className="mb-3">{reputation.tier}</Badge>
              <p className="text-xs text-secondary-text capitalize mb-1">Confidence: {reputation.confidence}</p>
              <p className="text-xs text-secondary-text line-clamp-3">{reputation.summary}</p>
              <Link href={`/evaluate`} className="mt-3">
                <Button variant="ghost" size="sm">
                  <ExternalLink size={12} /> Re-evaluate
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-4">
              <Brain size={28} className="text-secondary-text/30 mx-auto mb-3" />
              <p className="text-secondary-text text-sm mb-4">No reputation score yet.</p>
              <Link href="/evaluate">
                <Button size="sm">Request Evaluation</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
