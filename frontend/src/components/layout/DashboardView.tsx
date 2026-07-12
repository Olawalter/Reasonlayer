"use client";

import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { useHasEvidence } from "@/hooks/useEvidence";
import { useTrustPassport } from "@/hooks/useTrustPassport";
import { fetchStats } from "@/lib/genlayer/contract";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TierRing } from "@/components/ui/TierRing";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import Link from "next/link";
import { Users, Shield, Clock, AlertTriangle, ArrowRight, UserPlus, X } from "lucide-react";
import type { TrustTier } from "@/lib/genlayer/types";

function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: React.ElementType }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-secondary-text mb-1">{label}</p>
          <p className="text-2xl font-bold text-primary-text">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-ai-cyan/10 flex items-center justify-center">
          <Icon size={18} className="text-ai-cyan" />
        </div>
      </div>
    </Card>
  );
}

function EvidenceBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="bg-ai-cyan/5 border border-ai-cyan/20 rounded-xl p-5 relative">
      <button onClick={onDismiss} className="absolute top-3 right-3 text-secondary-text hover:text-primary-text transition-colors">
        <X size={14} />
      </button>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-ai-cyan/10 flex items-center justify-center shrink-0 mt-0.5">
          <UserPlus size={15} className="text-ai-cyan" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-primary-text text-sm">Submit your on-chain evidence</p>
          <p className="text-xs text-secondary-text mt-0.5 mb-3">
            Provide your validator signals — uptime, governance votes, delegators, and more — to unlock AI reputation evaluation.
          </p>
          <Link href="/evidence">
            <Button size="sm" className="inline-flex items-center gap-1.5">
              Submit Evidence <ArrowRight size={13} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function DashboardView() {
  const { address } = useAccount();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const { data: hasEvidence, isLoading: regLoading } = useHasEvidence(address);
  const { data: passport } = useTrustPassport(address);
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    staleTime: 60 * 1000,
  });

  if (regLoading) return <Spinner />;

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Dashboard</h1>
        <p className="text-secondary-text text-sm mt-1">Your ReasonLayer overview</p>
      </div>

      {!hasEvidence && !bannerDismissed && <EvidenceBanner onDismiss={() => setBannerDismissed(true)} />}

      {/* Stats — visible to everyone */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Validators"      value={stats?.total_validators  ?? "—"} icon={Users} />
        <StatCard label="AI Evaluations" value={stats?.total_evaluations ?? "—"} icon={Shield} />
        <StatCard label="Evaluations"    value={stats?.total_evaluations ?? "—"} icon={Clock} />
        <StatCard label="Disputes"       value={stats?.total_disputes    ?? "—"} icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card glow>
          <CardHeader><CardTitle>My Trust Score</CardTitle></CardHeader>
          {passport ? (
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <TierRing score={passport.score} tier={passport.tier as TrustTier} size={100} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-primary-text">{passport.score}</span>
                </div>
              </div>
              <div>
                <Badge variant="tier" tier={passport.tier as TrustTier} className="mb-2">{passport.tier}</Badge>
                <p className="text-sm text-secondary-text line-clamp-3">{passport.summary}</p>
                <Link href={`/passport/${address}`} className="inline-flex items-center gap-1 text-ai-cyan text-xs mt-3 hover:underline">
                  Full passport <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-secondary-text text-sm mb-4">No trust evaluation yet.</p>
              {hasEvidence && (
                <Link href={`/passport/${address}`}>
                  <Button size="sm">Request Evaluation</Button>
                </Link>
              )}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <div className="space-y-2">
            {[
              { href: address ? `/passport/${address}` : "/evaluate", label: "Request Trust Evaluation" },
              { href: "/validators",          label: "Browse Validators" },
              { href: "/recommendations",     label: "Get Recommendations" },
              { href: "/evaluations",         label: "View Evaluation History" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-surface hover:bg-white/5 transition-colors text-sm text-primary-text group"
              >
                {label}
                <ArrowRight size={14} className="text-secondary-text group-hover:text-ai-cyan transition-colors" />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
