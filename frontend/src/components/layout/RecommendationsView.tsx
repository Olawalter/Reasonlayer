"use client";

import { useAccount } from "wagmi";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContractWrite } from "@/hooks/useContract";
import { useRecommendation } from "@/hooks/useRecommendation";
import { useReputation } from "@/hooks/useReputation";
import { useValidator } from "@/hooks/useValidator";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TierRing } from "@/components/ui/TierRing";
import { Spinner } from "@/components/ui/Spinner";
import { TIER_BG, type TrustTier } from "@/lib/genlayer/types";
import {
  Sparkles, Shield, Vote, GitBranch, Brain,
  CheckCircle2, ExternalLink, RotateCcw, ChevronRight
} from "lucide-react";
import Link from "next/link";

type PrefLevel = "high" | "medium" | "low";

const PREF_OPTIONS: { value: PrefLevel; label: string }[] = [
  { value: "high",   label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low",    label: "Low" },
];

interface PrefSelectProps {
  label: string;
  icon: React.ElementType;
  value: PrefLevel;
  onChange: (v: PrefLevel) => void;
  hint: string;
}
function PrefSelect({ label, icon: Icon, value, onChange, hint }: PrefSelectProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className="text-secondary-text" />
        <span className="text-sm font-medium text-primary-text">{label}</span>
      </div>
      <p className="text-xs text-secondary-text mb-3">{hint}</p>
      <div className="flex gap-2">
        {PREF_OPTIONS.map((o) => (
          <button key={o.value} onClick={() => onChange(o.value)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
              value === o.value
                ? "bg-ai-cyan/10 border-ai-cyan/40 text-ai-cyan"
                : "bg-surface border-white/8 text-secondary-text hover:border-white/20"
            }`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function RecommendedValidatorCard({ address }: { address: string }) {
  const { data: rep, isLoading: repLoading } = useReputation(address);
  const { data: validator, isLoading: valLoading } = useValidator(address);
  const isLoading = repLoading || valLoading;
  const short = `${address.slice(0, 6)}…${address.slice(-4)}`;

  if (isLoading) return (
    <div className="bg-surface rounded-xl p-4 animate-pulse">
      <div className="h-4 bg-card rounded w-1/2 mb-2" />
      <div className="h-3 bg-card rounded w-1/3" />
    </div>
  );

  const tier = (rep?.tier ?? "Unverified") as TrustTier;
  const moniker = validator?.moniker ?? short;

  return (
    <div className="bg-surface border border-white/8 rounded-xl p-4 flex items-center gap-4">
      {rep && (
        <div className="relative shrink-0">
          <TierRing score={rep.score} tier={tier} size={54} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-primary-text">{rep.score}</span>
          </div>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-semibold text-primary-text text-sm truncate">{moniker}</p>
          {rep && <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${TIER_BG[tier]}`}>{tier}</span>}
        </div>
        <p className="text-xs font-mono text-secondary-text">{short}</p>
        {validator && (
          <p className="text-xs text-secondary-text mt-1">
            Uptime <span className={validator.uptime_pct >= 95 ? "text-emerald-400" : "text-amber-400"}>
              {validator.uptime_pct}%
            </span>
            {" · "}{validator.governance_votes} governance votes
          </p>
        )}
      </div>
      <Link href={`/validators/${address}`} className="shrink-0">
        <Button variant="ghost" size="sm"><ExternalLink size={12} /></Button>
      </Link>
    </div>
  );
}

export function RecommendationsView() {
  const { address } = useAccount();
  const { data: rec, isLoading, refetch } = useRecommendation(address);
  const { write, isReady } = useContractWrite();

  const [security,         setSecurity]         = useState<PrefLevel>("high");
  const [governance,       setGovernance]       = useState<PrefLevel>("medium");
  const [decentralization, setDecentralization] = useState<PrefLevel>("medium");
  const [notes,            setNotes]            = useState("");
  const [generating,       setGenerating]       = useState(false);
  const [error,            setError]            = useState<string | null>(null);
  const [showPrefs,        setShowPrefs]        = useState(!rec);

  if (!address) return (
    <div className="text-secondary-text text-sm">Connect your wallet to get recommendations.</div>
  );

  async function generate() {
    setGenerating(true);
    setError(null);
    try {
      await write("generate_recommendation", [address, security, governance, decentralization, notes.trim()]);
      await refetch();
      setShowPrefs(false);
    } catch (err: unknown) {
      const msg = (err as Error)?.message ?? "Failed to generate recommendation";
      setError(
        msg.includes("No active validators")
          ? "No active validators with evidence on record yet."
          : msg
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Validator Recommendation</h1>
          <p className="text-secondary-text text-sm mt-1">
            Set your preferences. The AI picks the best-matching validator through multi-node consensus.
          </p>
        </div>
        {rec && (
          <Button variant="secondary" size="sm" onClick={() => setShowPrefs(p => !p)}>
            <RotateCcw size={12} /> Refresh
          </Button>
        )}
      </div>

      {/* Preferences form */}
      <AnimatePresence>
        {showPrefs && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card glow>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-ai-cyan" />
                  <CardTitle>Your Preferences</CardTitle>
                </div>
              </CardHeader>
              <div className="space-y-6">
                <PrefSelect label="Security Priority" icon={Shield} value={security} onChange={setSecurity}
                  hint="How important is uptime and zero-slashing history?" />
                <PrefSelect label="Governance Priority" icon={Vote} value={governance} onChange={setGovernance}
                  hint="Do you want a validator that actively participates in governance?" />
                <PrefSelect label="Decentralization Priority" icon={GitBranch} value={decentralization} onChange={setDecentralization}
                  hint="Do you prefer smaller community-run validators over institutional nodes?" />
                <div>
                  <label className="text-sm font-medium text-primary-text block mb-1">Additional Context</label>
                  <p className="text-xs text-secondary-text mb-2">Any other preferences the AI should consider.</p>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} maxLength={256}
                    placeholder="e.g. Prefer validators with a public track record…"
                    className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2.5 text-sm text-primary-text focus:outline-none focus:border-ai-cyan/50 resize-none placeholder:text-secondary-text/40" />
                </div>
                {error && <p className="text-xs text-danger">{error}</p>}
                <Button onClick={generate} loading={generating} disabled={!isReady} size="lg" className="w-full">
                  <Brain size={15} /> Generate AI Recommendation
                </Button>
                <p className="text-xs text-secondary-text/40 text-center">
                  Runs gl.eq_principle.prompt_non_comparative through 3-node consensus. ~30 seconds.
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generating animation */}
      {generating && (
        <Card>
          <div className="flex flex-col items-center py-10 gap-4">
            <div className="flex items-center gap-3">
              {["A", "B", "C"].map((n, i) => (
                <motion.div key={n}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity }}
                  className="w-10 h-10 rounded-xl bg-ai-cyan/8 border border-ai-cyan/20 flex items-center justify-center text-xs font-bold text-ai-cyan">
                  {n}
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-secondary-text">AI nodes evaluating validator candidates…</p>
          </div>
        </Card>
      )}

      {isLoading && <Spinner />}

      {/* Result */}
      {!isLoading && rec && !showPrefs && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/8 border border-emerald-500/20 text-xs text-emerald-400">
            <CheckCircle2 size={13} />
            AI consensus reached · Confidence: <span className="font-semibold capitalize ml-1">{rec.confidence}</span>
          </div>
          <Card glow>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-ai-cyan" />
                <CardTitle>Recommended Validator</CardTitle>
              </div>
            </CardHeader>
            <RecommendedValidatorCard address={rec.recommended_address} />
          </Card>
          <Card>
            <CardHeader><CardTitle>AI Reasoning</CardTitle></CardHeader>
            <p className="text-sm text-secondary-text leading-relaxed">{rec.reasoning}</p>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-secondary-text/40">
              <span>
                Security: {rec.preferences.security_priority} · Governance: {rec.preferences.governance_priority} · Decentralization: {rec.preferences.decentralization_priority}
              </span>
              <span>{new Date(rec.generated_at * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Preferences Used</CardTitle></CardHeader>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Security",         value: rec.preferences.security_priority,         icon: Shield },
                { label: "Governance",       value: rec.preferences.governance_priority,       icon: Vote },
                { label: "Decentralization", value: rec.preferences.decentralization_priority, icon: GitBranch },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="text-center p-3 rounded-lg bg-surface border border-white/8">
                  <Icon size={14} className="text-secondary-text mx-auto mb-2" />
                  <p className="text-xs text-secondary-text mb-1">{label}</p>
                  <Badge variant={value === "high" ? "success" : value === "medium" ? "info" : "secondary"}>{value}</Badge>
                </div>
              ))}
            </div>
            {rec.preferences.notes && (
              <p className="text-xs text-secondary-text mt-3 pt-3 border-t border-white/5">{rec.preferences.notes}</p>
            )}
          </Card>
          <button onClick={() => setShowPrefs(true)}
            className="flex items-center gap-1.5 text-xs text-secondary-text hover:text-primary-text transition-colors">
            <ChevronRight size={12} /> Update preferences and regenerate
          </button>
        </motion.div>
      )}

      {!isLoading && !rec && !showPrefs && !generating && (
        <Card>
          <div className="text-center py-16">
            <Sparkles size={40} className="text-secondary-text/20 mx-auto mb-4" />
            <p className="text-secondary-text text-sm mb-6">Set your preferences above to get a recommendation.</p>
            <Button onClick={() => setShowPrefs(true)}>Set Preferences</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
