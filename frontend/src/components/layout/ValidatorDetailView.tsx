"use client";

import { useValidator } from "@/hooks/useValidator";
import { useTrustPassport } from "@/hooks/useTrustPassport";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TierRing } from "@/components/ui/TierRing";
import { Spinner } from "@/components/ui/Spinner";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Wifi, Vote, Users, Clock } from "lucide-react";
import type { TrustTier } from "@/lib/genlayer/types";

export function ValidatorDetailView({ address }: { address: string }) {
  const { data: validator, isLoading } = useValidator(address);
  const { data: reputation } = useTrustPassport(address);
  const shortAddr = `${address.slice(0, 8)}...${address.slice(-6)}`;

  if (isLoading) return <Spinner />;
  if (!validator) return (
    <div className="space-y-4">
      <Link href="/validators" className="inline-flex items-center gap-2 text-ai-cyan hover:underline text-sm">
        <ArrowLeft size={14} /> Back
      </Link>
      <p className="text-secondary-text text-sm">Validator not found.</p>
    </div>
  );

  const uptimeColor = validator.uptime_pct >= 99 ? "text-emerald-400" : validator.uptime_pct >= 95 ? "text-blue-400" : validator.uptime_pct >= 90 ? "text-amber-400" : "text-danger";

  return (
    <div className="space-y-6 animate-fade-in">
      <Link href="/validators" className="inline-flex items-center gap-2 text-secondary-text hover:text-primary-text text-sm transition-colors">
        <ArrowLeft size={14} /> Back to Validators
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card glow className="lg:col-span-2">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-ai-cyan/10 border border-ai-cyan/20 flex items-center justify-center text-ai-cyan font-bold text-xl shrink-0">
              {validator.moniker?.[0]?.toUpperCase() ?? "V"}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-primary-text">{validator.moniker}</h1>
              <p className="text-xs font-mono text-secondary-text mt-0.5">{shortAddr}</p>
              {validator.website && (
                <a href={validator.website} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-ai-cyan hover:underline mt-1">
                  {validator.website.replace(/^https?:\/\//, "")} <ExternalLink size={10} />
                </a>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant={validator.is_active ? "success" : "danger"}>
                  {validator.is_active ? "Active" : "Inactive"}
                </Badge>
                {reputation && <Badge variant="tier" tier={reputation.tier as TrustTier}>{reputation.tier}</Badge>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Uptime",      value: `${validator.uptime_pct}%`,  icon: Wifi,  color: uptimeColor },
              { label: "Gov Votes",   value: validator.governance_votes,   icon: Vote,  color: "text-primary-text" },
              { label: "Delegators",  value: validator.delegator_count,    icon: Users, color: "text-primary-text" },
              { label: "Slashing",    value: validator.slashing_events === 0 ? "None" : validator.slashing_events, icon: Clock, color: validator.slashing_events === 0 ? "text-emerald-400" : "text-danger" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="text-center p-3 rounded-lg bg-surface border border-white/8">
                <Icon size={14} className={`${color} mx-auto mb-1.5`} />
                <p className={`text-sm font-bold ${color}`}>{value}</p>
                <p className="text-xs text-secondary-text mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Reputation</CardTitle></CardHeader>
            {reputation ? (
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <TierRing score={reputation.score} tier={reputation.tier as TrustTier} size={100} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-primary-text">{reputation.score}</span>
                  </div>
                </div>
                <Badge variant="tier" tier={reputation.tier as TrustTier} className="mb-3">{reputation.tier}</Badge>
                <p className="text-xs text-secondary-text capitalize mb-2">Confidence: {reputation.confidence}</p>
                <p className="text-xs text-secondary-text leading-relaxed line-clamp-3">{reputation.summary}</p>
              </div>
            ) : (
              <p className="text-sm text-secondary-text text-center py-4">No reputation evaluation yet.</p>
            )}
          </Card>

          <Link href={`/passport/${address}`}>
            <Card className="hover:border-ai-cyan/20 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <p className="text-sm text-primary-text">View Full Passport</p>
                <ExternalLink size={14} className="text-ai-cyan" />
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
