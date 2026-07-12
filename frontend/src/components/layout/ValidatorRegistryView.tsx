"use client";

import { useValidatorRegistry } from "@/hooks/useValidator";
import { useTrustPassport } from "@/hooks/useTrustPassport";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { TierRing } from "@/components/ui/TierRing";
import Link from "next/link";
import { Shield, ExternalLink } from "lucide-react";
import type { ValidatorProfile, TrustTier } from "@/lib/genlayer/types";

function ValidatorCard({ validator }: { validator: ValidatorProfile }) {
  const { data: passport } = useTrustPassport(validator.address);
  const shortAddr = `${validator.address.slice(0, 6)}...${validator.address.slice(-4)}`;

  return (
    <Card className="hover:border-ai-cyan/20 transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-ai-cyan/10 border border-ai-cyan/20 flex items-center justify-center text-ai-cyan font-bold shrink-0">
          {validator.moniker?.[0]?.toUpperCase() ?? "V"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-primary-text truncate">{validator.moniker}</p>
            {passport && (
              <Badge variant="tier" tier={passport.tier as TrustTier}>{passport.tier}</Badge>
            )}
          </div>
          <p className="text-xs font-mono text-secondary-text mt-0.5">{shortAddr}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-secondary-text">
              Uptime: <span className={(validator.uptime_pct ?? 0) >= 90 ? "text-success" : (validator.uptime_pct ?? 0) >= 70 ? "text-warning" : "text-danger"}>
                {validator.uptime_pct ?? "—"}%
              </span>
            </span>
            {passport && (
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-xs text-secondary-text">Score: <span className="text-primary-text">{passport.score}</span></span>
              </div>
            )}
          </div>
        </div>
        {passport && (
          <div className="shrink-0">
            <TierRing score={passport.score} tier={passport.tier as TrustTier} size={48} />
          </div>
        )}
      </div>
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        {validator.website ? (
          <a href={validator.website} target="_blank" rel="noopener noreferrer"
            className="text-xs text-ai-cyan hover:underline flex items-center gap-1">
            {validator.website.replace(/^https?:\/\//, "").slice(0, 32)}
            <ExternalLink size={10} />
          </a>
        ) : (
          <span />
        )}
        <Link href={`/validators/${validator.address}`}
          className="text-xs text-secondary-text hover:text-ai-cyan transition-colors flex items-center gap-1">
          View profile <ExternalLink size={10} />
        </Link>
      </div>
    </Card>
  );
}

export function ValidatorRegistryView() {
  const { data: validators, isLoading } = useValidatorRegistry(20, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Validators</h1>
          <p className="text-secondary-text text-sm mt-1">Active validators on ReasonLayer</p>
        </div>
        <div className="flex items-center gap-2 text-secondary-text text-sm">
          <Shield size={14} className="text-ai-cyan" />
          {validators?.length ?? 0} active
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : !validators || validators.length === 0 ? (
        <div className="text-center py-16">
          <Shield size={40} className="text-secondary-text/30 mx-auto mb-4" />
          <p className="text-secondary-text text-sm">No validators registered yet.</p>
          <p className="text-secondary-text/60 text-xs mt-1">Register as a validator from your profile page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {validators.map(v => <ValidatorCard key={v.address} validator={v} />)}
        </div>
      )}
    </div>
  );
}
