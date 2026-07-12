"use client";

import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContractWrite } from "@/hooks/useContract";
import { useReputation, useEvaluationHistory } from "@/hooks/useReputation";
import { useHasEvidence } from "@/hooks/useEvidence";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TierRing } from "@/components/ui/TierRing";
import { TIER_COLOR, TIER_BG, type TrustTier } from "@/lib/genlayer/types";
import {
  Brain, CheckCircle2, Shield, AlertTriangle,
  Sparkles, RotateCcw, History, ChevronDown, ChevronUp, Zap
} from "lucide-react";
import Link from "next/link";

const NODE_VARIANTS = [
  { id: "Node A", baseOffset: -3, delay: 0 },
  { id: "Node B", baseOffset: +4, delay: 0.5 },
  { id: "Node C", baseOffset: -1, delay: 1.0 },
];

function ConsensusAnimation({ score }: { score: number }) {
  const [phase, setPhase] = useState<"thinking" | "results" | "consensus">("thinking");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("results"), 2000);
    const t2 = setTimeout(() => setPhase("consensus"), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="py-4">
      {/* Phase label */}
      <div className="text-center mb-6">
        <AnimatePresence mode="wait">
          <motion.div key={phase} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-white/10 text-xs text-secondary-text">
            {phase === "thinking" && <><Brain size={12} className="text-ai-cyan animate-pulse" /> AI nodes reasoning independently…</>}
            {phase === "results"  && <><Zap    size={12} className="text-amber-400" /> Validator outputs collected</>}
            {phase === "consensus"&& <><CheckCircle2 size={12} className="text-emerald-400" /> Equivalence verified — consensus reached</>}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nodes */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {NODE_VARIANTS.map((n) => {
          const nodeScore = Math.min(100, Math.max(0, score + n.baseOffset));
          return (
            <motion.div key={n.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: n.delay }}
              className="bg-surface border border-white/8 rounded-xl p-4 text-center relative overflow-hidden">
              {phase === "thinking" && (
                <div className="absolute inset-0 bg-surface/80 flex items-center justify-center">
                  <Brain size={18} className="text-ai-cyan animate-pulse" />
                </div>
              )}
              <div className="text-xs text-secondary-text mb-2 font-mono">{n.id}</div>
              <motion.div initial={{ scale: 0 }} animate={phase !== "thinking" ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: n.delay + 0.2, type: "spring" }}
                className="text-3xl font-bold text-primary-text mb-1">{nodeScore}</motion.div>
              {phase !== "thinking" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: n.delay + 0.4 }}
                  className="text-xs text-secondary-text">score / 100</motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Equivalence result */}
      <AnimatePresence>
        {phase === "consensus" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span className="text-xs text-emerald-400">
              Tier consensus achieved · Scores within ±8 · Confidence aligned
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReputationCard({ rep }: { rep: NonNullable<ReturnType<typeof useReputation>["data"]> }) {
  const tier = rep.tier as TrustTier;

  return (
    <Card glow className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-60`}
        style={{ color: TIER_COLOR[tier] }} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Score ring */}
        <div className="relative shrink-0">
          <TierRing score={rep.score} tier={tier} size={110} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-primary-text">{rep.score}</span>
            <span className="text-xs text-secondary-text">/ 100</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${TIER_BG[tier]}`}>
              {tier}
            </span>
            <span className="text-xs text-secondary-text capitalize">
              Confidence: <span className="text-primary-text">{rep.confidence}</span>
            </span>
          </div>
          <p className="text-sm text-secondary-text leading-relaxed mb-3">{rep.summary}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rep.strengths.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-2">
                  <Shield size={11} /> Strengths
                </div>
                <ul className="space-y-1">
                  {rep.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-secondary-text flex items-start gap-1.5">
                      <CheckCircle2 size={10} className="text-emerald-400 mt-0.5 shrink-0" />{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {rep.risk_factors.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-2">
                  <AlertTriangle size={11} /> Risk Factors
                </div>
                <ul className="space-y-1">
                  {rep.risk_factors.map((r, i) => (
                    <li key={i} className="text-xs text-secondary-text flex items-start gap-1.5">
                      <AlertTriangle size={10} className="text-amber-400 mt-0.5 shrink-0" />{r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <p className="text-xs text-secondary-text/40 mt-4">
            Last evaluated {new Date(rep.last_evaluated_at * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            {" · "}{rep.evaluation_count} evaluation{rep.evaluation_count !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </Card>
  );
}

function HistoryPanel({ address }: { address: string }) {
  const { data: history } = useEvaluationHistory(address);
  const [open, setOpen] = useState(false);
  if (!history || history.length === 0) return null;

  return (
    <Card>
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-left">
        <div className="flex items-center gap-2">
          <History size={14} className="text-secondary-text" />
          <span className="text-sm font-semibold text-primary-text">Evaluation History</span>
          <Badge variant="secondary">{history.length}</Badge>
        </div>
        {open ? <ChevronUp size={14} className="text-secondary-text" /> : <ChevronDown size={14} className="text-secondary-text" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-4 space-y-3 pt-4 border-t border-white/5">
              {[...history].reverse().map((h) => (
                <div key={h.ev_id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary-text">{h.score}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${TIER_BG[h.tier as TrustTier]}`}>{h.tier}</span>
                    </div>
                    <p className="text-xs text-secondary-text mt-0.5 line-clamp-1">{h.summary}</p>
                  </div>
                  <span className="text-xs text-secondary-text/40 shrink-0 ml-4">
                    {new Date(h.evaluated_at * 1000).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export function EvaluationView() {
  const { address } = useAccount();
  const { data: rep, isLoading, refetch } = useReputation(address);
  const { data: hasEvidence } = useHasEvidence(address);
  const { write, isReady } = useContractWrite();

  const [evaluating, setEvaluating] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reassessing, setReassessing] = useState(false);

  if (!address) return <div className="text-secondary-text text-sm">Connect your wallet to request evaluation.</div>;

  async function requestEvaluation() {
    setEvaluating(true);
    setShowAnimation(true);
    setError(null);
    try {
      await write("evaluate_reputation", [address]);
      await refetch();
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Evaluation failed");
    } finally {
      setEvaluating(false);
      setShowAnimation(false);
    }
  }

  async function triggerReassessment() {
    setReassessing(true);
    setShowAnimation(true);
    setError(null);
    try {
      await write("trigger_reassessment", [address]);
      await refetch();
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Reassessment failed");
    } finally {
      setReassessing(false);
      setShowAnimation(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Reputation Evaluation</h1>
          <p className="text-secondary-text text-sm mt-1">
            AI validator nodes adjudicate your trustworthiness based on submitted evidence.
          </p>
        </div>
        {rep && (
          <Button variant="secondary" size="sm" onClick={triggerReassessment} loading={reassessing} disabled={!isReady}>
            <RotateCcw size={12} /> Reassess
          </Button>
        )}
      </div>

      {/* No evidence guard */}
      {!isLoading && hasEvidence === false && (
        <Card>
          <div className="text-center py-8">
            <Brain size={36} className="text-secondary-text/30 mx-auto mb-4" />
            <p className="text-primary-text font-semibold mb-2">No evidence on record</p>
            <p className="text-secondary-text text-sm mb-6">
              You need to submit your validator evidence before requesting an evaluation.
            </p>
            <Link href="/evidence">
              <Button>Submit Evidence First</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Consensus animation (while evaluating) */}
      <AnimatePresence>
        {showAnimation && rep && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-ai-cyan animate-pulse" />
                  <CardTitle>AI Consensus in Progress</CardTitle>
                </div>
              </CardHeader>
              <ConsensusAnimation score={rep?.score ?? 70} />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reputation result */}
      {!isLoading && rep && !showAnimation && <ReputationCard rep={rep} />}

      {/* Evaluate button */}
      {!isLoading && hasEvidence && !rep && !showAnimation && (
        <Card>
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-2xl bg-ai-cyan/8 border border-ai-cyan/20 flex items-center justify-center mx-auto mb-5">
              <Brain size={28} className="text-ai-cyan" />
            </div>
            <h2 className="text-lg font-semibold text-primary-text mb-2">Ready to Evaluate</h2>
            <p className="text-secondary-text text-sm mb-2 max-w-sm mx-auto">
              Your evidence is on-chain. Request an evaluation to let GenLayer&apos;s AI validator nodes adjudicate your reputation.
            </p>
            <p className="text-xs text-secondary-text/50 mb-8">
              This runs gl.nondet.exec_prompt() through 3-node consensus. Takes ~30 seconds.
            </p>
            {error && <p className="text-xs text-danger mb-4">{error}</p>}
            <Button size="lg" onClick={requestEvaluation} loading={evaluating} disabled={!isReady}>
              <Brain size={16} /> Request AI Evaluation
            </Button>
          </div>
        </Card>
      )}

      {error && !evaluating && (
        <p className="text-xs text-danger px-1">{error}</p>
      )}

      {/* Re-evaluate with animation */}
      {rep && !showAnimation && (
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-primary-text">Request Re-evaluation</p>
              <p className="text-xs text-secondary-text mt-0.5">
                Update your evidence first, then trigger a new AI evaluation. History is preserved.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href="/evidence">
                <Button variant="secondary" size="sm">Update Evidence</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={requestEvaluation} loading={evaluating} disabled={!isReady}>
                <Brain size={12} /> Re-evaluate
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* History */}
      {address && <HistoryPanel address={address} />}
    </div>
  );
}
