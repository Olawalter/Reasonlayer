"use client";

import { useEvidence } from "@/hooks/useEvidence";
import { useTrustPassport } from "@/hooks/useTrustPassport";
import { useContractWrite } from "@/hooks/useContract";
import { useAccount } from "wagmi";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TierRing } from "@/components/ui/TierRing";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ThumbsUp, AlertTriangle, ExternalLink, Wifi, Vote, Users } from "lucide-react";
import type { TrustTier } from "@/lib/genlayer/types";

export function PublicProfileView({ address }: { address: string }) {
  const { address: myAddress } = useAccount();
  const { data: evidence, isLoading } = useEvidence(address);
  const { data: reputation } = useTrustPassport(address);
  const { write, isReady } = useContractWrite();

  const [disputing,       setDisputing]       = useState(false);
  const [reason,          setReason]          = useState("");
  const [evidenceUrl,     setEvidenceUrl]     = useState("");
  const [submitting,      setSubmitting]      = useState(false);
  const [disputeError,    setDisputeError]    = useState<string | null>(null);

  const isOwnProfile = myAddress?.toLowerCase() === address.toLowerCase();
  const shortAddr = `${address.slice(0, 8)}...${address.slice(-6)}`;

  if (isLoading) return <Spinner />;
  if (!evidence) return (
    <div className="space-y-4">
      <Link href="/validators" className="inline-flex items-center gap-2 text-ai-cyan hover:underline text-sm">
        <ArrowLeft size={14} /> Back
      </Link>
      <p className="text-secondary-text text-sm">No evidence submitted by this address.</p>
    </div>
  );

  async function submitDispute() {
    if (!reason.trim()) return;
    setSubmitting(true);
    setDisputeError(null);
    try {
      await write("submit_dispute", [address, reason.trim(), evidenceUrl.trim()]);
      setDisputing(false);
      setReason("");
      setEvidenceUrl("");
    } catch (err: unknown) {
      setDisputeError((err as Error)?.message ?? "Dispute submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Link href="/validators" className="inline-flex items-center gap-2 text-secondary-text hover:text-primary-text text-sm transition-colors">
        <ArrowLeft size={14} /> Back to Validators
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card glow className="lg:col-span-2">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-ai-cyan/10 border border-ai-cyan/20 flex items-center justify-center text-ai-cyan font-bold text-xl shrink-0">
              {evidence.moniker?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-primary-text">{evidence.moniker}</h1>
              <p className="text-xs font-mono text-secondary-text mt-0.5">{shortAddr}</p>
              {reputation && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="tier" tier={reputation.tier as TrustTier}>{reputation.tier}</Badge>
                  <Badge variant="secondary" className="capitalize">Confidence: {reputation.confidence}</Badge>
                </div>
              )}
            </div>
          </div>

          {/* Evidence metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: "Uptime",     value: `${evidence.uptime_pct}%`,      icon: Wifi,  color: evidence.uptime_pct >= 99 ? "text-emerald-400" : evidence.uptime_pct >= 95 ? "text-blue-400" : "text-amber-400" },
              { label: "Gov Votes",  value: evidence.governance_votes,       icon: Vote,  color: "text-primary-text" },
              { label: "Delegators", value: evidence.delegator_count,        icon: Users, color: "text-primary-text" },
              { label: "Slashing",   value: evidence.slashing_events === 0 ? "None" : evidence.slashing_events, icon: AlertTriangle, color: evidence.slashing_events === 0 ? "text-emerald-400" : "text-danger" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="text-center p-3 rounded-lg bg-surface border border-white/8">
                <Icon size={14} className={`${color} mx-auto mb-1.5`} />
                <p className={`text-sm font-bold ${color}`}>{value}</p>
                <p className="text-xs text-secondary-text mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {evidence.additional_notes && (
            <p className="text-sm text-secondary-text border-t border-white/5 pt-4">{evidence.additional_notes}</p>
          )}

          {!isOwnProfile && myAddress && (
            <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-3">
              <Button variant="danger" size="sm" onClick={() => setDisputing(v => !v)}>
                <AlertTriangle size={14} /> Raise Dispute
              </Button>
              <Link href={`/evaluate`}>
                <Button variant="secondary" size="sm"><ExternalLink size={14} /> View Evaluation</Button>
              </Link>
            </div>
          )}

          {disputing && (
            <div className="mt-4 space-y-3 bg-danger/5 border border-danger/20 rounded-lg p-4">
              <p className="text-sm font-medium text-danger">Raise Dispute</p>
              <textarea value={reason} onChange={e => setReason(e.target.value)} maxLength={1024} rows={3}
                placeholder="Describe the issue..."
                className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-primary-text focus:outline-none focus:border-danger/40 resize-none" />
              <input value={evidenceUrl} onChange={e => setEvidenceUrl(e.target.value)} maxLength={512}
                placeholder="Evidence URL (optional)"
                className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-primary-text focus:outline-none focus:border-danger/40" />
              {disputeError && <p className="text-xs text-danger">{disputeError}</p>}
              <div className="flex gap-2">
                <Button variant="danger" size="sm" onClick={submitDispute} loading={submitting} disabled={!reason.trim()}>Submit</Button>
                <Button variant="ghost" size="sm" onClick={() => setDisputing(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader><CardTitle>Reputation Score</CardTitle></CardHeader>
          {reputation ? (
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <TierRing score={reputation.score} tier={reputation.tier as TrustTier} size={100} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-primary-text">{reputation.score}</span>
                </div>
              </div>
              <Badge variant="tier" tier={reputation.tier as TrustTier} className="mb-3">{reputation.tier}</Badge>
              <p className="text-xs text-secondary-text leading-relaxed">{reputation.summary}</p>
              {reputation.strengths?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5 w-full text-left">
                  <p className="text-xs text-emerald-400 mb-2">Strengths</p>
                  {reputation.strengths.slice(0, 3).map((s, i) => (
                    <p key={i} className="text-xs text-secondary-text mb-1">· {s}</p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-secondary-text text-center py-4">No reputation evaluation yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
