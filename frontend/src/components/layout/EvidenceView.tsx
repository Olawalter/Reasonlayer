"use client";

import { useAccount } from "wagmi";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContractWrite } from "@/hooks/useContract";
import { useEvidence } from "@/hooks/useEvidence";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  FileText, CheckCircle2, ChevronRight, ChevronLeft,
  Wifi, Vote, Users, Clock, AlertTriangle, Gavel, Globe, StickyNote
} from "lucide-react";
import Link from "next/link";

interface FieldProps {
  label: string;
  hint: string;
  children: React.ReactNode;
}
function Field({ label, hint, children }: FieldProps) {
  return (
    <div>
      <label className="text-xs font-medium text-primary-text block mb-1">{label}</label>
      <p className="text-xs text-secondary-text mb-2">{hint}</p>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-surface border border-white/10 rounded-lg px-3 py-2.5 text-sm text-primary-text focus:outline-none focus:border-ai-cyan/50 placeholder:text-secondary-text/40 transition-colors";

const STEPS = [
  { id: 1, title: "Identity",    icon: FileText },
  { id: 2, title: "Performance", icon: Wifi },
  { id: 3, title: "Governance",  icon: Vote },
  { id: 4, title: "Network",     icon: Users },
  { id: 5, title: "Disputes",    icon: Gavel },
  { id: 6, title: "Review",      icon: CheckCircle2 },
];

export function EvidenceView() {
  const { address } = useAccount();
  const { data: existing, refetch } = useEvidence(address);
  const { write, isReady } = useContractWrite();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Form fields
  const [moniker, setMoniker] = useState(existing?.moniker ?? "");
  const [website, setWebsite] = useState(existing?.website ?? "");
  const [uptimePct, setUptimePct] = useState(String(existing?.uptime_pct ?? ""));
  const [missedBlocks, setMissedBlocks] = useState(String(existing?.missed_blocks ?? "0"));
  const [slashingEvents, setSlashingEvents] = useState(String(existing?.slashing_events ?? "0"));
  const [govVotes, setGovVotes] = useState(String(existing?.governance_votes ?? "0"));
  const [delegatorCount, setDelegatorCount] = useState(String(existing?.delegator_count ?? "0"));
  const [validatorAge, setValidatorAge] = useState(String(existing?.validator_age_days ?? "0"));
  const [disputesWon, setDisputesWon] = useState(String(existing?.disputes_won ?? "0"));
  const [disputesLost, setDisputesLost] = useState(String(existing?.disputes_lost ?? "0"));
  const [notes, setNotes] = useState(existing?.additional_notes ?? "");

  if (!address) return (
    <div className="text-secondary-text text-sm">Connect your wallet to submit evidence.</div>
  );

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      await write("submit_evidence", [
        moniker.trim(),
        uptimePct,
        Number(slashingEvents),
        Number(govVotes),
        Number(delegatorCount),
        Number(validatorAge),
        Number(missedBlocks),
        Number(disputesWon),
        Number(disputesLost),
        website.trim(),
        notes.trim(),
      ]);
      await refetch();
      setDone(true);
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={28} className="text-emerald-400" />
      </div>
      <h2 className="text-xl font-bold text-primary-text mb-2">Evidence Submitted</h2>
      <p className="text-secondary-text text-sm mb-8">
        Your on-chain evidence is recorded. Now request a reputation evaluation to let the AI adjudicate your trust score.
      </p>
      <Link href="/evaluate">
        <Button size="lg">Request Reputation Evaluation</Button>
      </Link>
    </motion.div>
  );

  const canNext: Record<number, boolean> = {
    1: !!moniker.trim(),
    2: !!uptimePct,
    3: true,
    4: true,
    5: true,
    6: true,
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-text">Submit Evidence</h1>
        <p className="text-secondary-text text-sm mt-1">
          Provide your on-chain signals. No score is generated here — only verifiable facts.
        </p>
      </div>

      {/* Existing badge */}
      {existing && (
        <div className="mb-6 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/8 border border-blue-500/20 text-sm">
          <FileText size={14} className="text-blue-400" />
          <span className="text-primary-text">You have existing evidence on-chain.</span>
          <Badge variant="info" className="ml-auto">Update</Badge>
        </div>
      )}

      {/* Step indicators */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => step > s.id && setStep(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                step === s.id
                  ? "bg-ai-cyan/10 border border-ai-cyan/30 text-ai-cyan"
                  : step > s.id
                  ? "text-emerald-400 cursor-pointer hover:bg-emerald-500/5"
                  : "text-secondary-text/40 cursor-default"
              }`}
            >
              {step > s.id
                ? <CheckCircle2 size={12} />
                : <s.icon size={12} />
              }
              {s.title}
            </button>
            {i < STEPS.length - 1 && (
              <ChevronRight size={12} className="text-secondary-text/20 shrink-0" />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}>

          {step === 1 && (
            <Card>
              <CardHeader><CardTitle>Identity</CardTitle></CardHeader>
              <div className="space-y-4">
                <Field label="Validator Moniker *" hint="Your public name on the network.">
                  <input value={moniker} onChange={e => setMoniker(e.target.value)} maxLength={64}
                    placeholder="e.g. Alpha Prime Node" className={inputCls} />
                </Field>
                <Field label="Website" hint="Optional — your validator's public URL.">
                  <div className="relative">
                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text/40" />
                    <input value={website} onChange={e => setWebsite(e.target.value)} maxLength={256}
                      placeholder="https://..." className={`${inputCls} pl-9`} />
                  </div>
                </Field>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader><CardTitle>Performance Metrics</CardTitle></CardHeader>
              <div className="space-y-4">
                <Field label="Uptime %" hint="Your average block production uptime over your validator lifetime.">
                  <div className="relative">
                    <Wifi size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text/40" />
                    <input value={uptimePct} onChange={e => setUptimePct(e.target.value)} type="number"
                      min="0" max="100" step="0.1" placeholder="e.g. 99.2" className={`${inputCls} pl-9`} />
                  </div>
                </Field>
                <Field label="Missed Blocks" hint="Total missed blocks in your validator history.">
                  <input value={missedBlocks} onChange={e => setMissedBlocks(e.target.value)} type="number" min="0"
                    placeholder="0" className={inputCls} />
                </Field>
                <Field label="Slashing Events" hint="Number of slashing events. A single event is a significant negative signal.">
                  <div className="relative">
                    <AlertTriangle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text/40" />
                    <input value={slashingEvents} onChange={e => setSlashingEvents(e.target.value)} type="number" min="0"
                      placeholder="0" className={`${inputCls} pl-9`} />
                  </div>
                </Field>
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader><CardTitle>Governance Participation</CardTitle></CardHeader>
              <div className="space-y-4">
                <Field label="Governance Votes Cast" hint="Total number of on-chain governance proposals you've voted on.">
                  <div className="relative">
                    <Vote size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text/40" />
                    <input value={govVotes} onChange={e => setGovVotes(e.target.value)} type="number" min="0"
                      placeholder="e.g. 150" className={`${inputCls} pl-9`} />
                  </div>
                </Field>
                <div className="px-4 py-3 rounded-lg bg-blue-500/5 border border-blue-500/15 text-xs text-secondary-text">
                  <span className="text-blue-400 font-medium">Why this matters: </span>
                  Active governance participation (≥100 votes) signals community commitment and adds +10 to your reputation score.
                </div>
              </div>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <CardHeader><CardTitle>Network Presence</CardTitle></CardHeader>
              <div className="space-y-4">
                <Field label="Delegator Count" hint="Number of delegators currently staking with your validator.">
                  <div className="relative">
                    <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text/40" />
                    <input value={delegatorCount} onChange={e => setDelegatorCount(e.target.value)} type="number" min="0"
                      placeholder="e.g. 400" className={`${inputCls} pl-9`} />
                  </div>
                </Field>
                <Field label="Validator Age (days)" hint="How many days your validator has been active on the network.">
                  <div className="relative">
                    <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text/40" />
                    <input value={validatorAge} onChange={e => setValidatorAge(e.target.value)} type="number" min="0"
                      placeholder="e.g. 365" className={`${inputCls} pl-9`} />
                  </div>
                </Field>
              </div>
            </Card>
          )}

          {step === 5 && (
            <Card>
              <CardHeader><CardTitle>Dispute History</CardTitle></CardHeader>
              <div className="space-y-4">
                <Field label="Disputes Won" hint="Disputes raised against others that were upheld in your favour.">
                  <div className="relative">
                    <CheckCircle2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text/40" />
                    <input value={disputesWon} onChange={e => setDisputesWon(e.target.value)} type="number" min="0"
                      placeholder="0" className={`${inputCls} pl-9`} />
                  </div>
                </Field>
                <Field label="Disputes Lost" hint="Disputes where a verdict was upheld against you. Each deducts from your score.">
                  <div className="relative">
                    <AlertTriangle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text/40" />
                    <input value={disputesLost} onChange={e => setDisputesLost(e.target.value)} type="number" min="0"
                      placeholder="0" className={`${inputCls} pl-9`} />
                  </div>
                </Field>
                <Field label="Additional Notes" hint="Any context the AI should know about your operation.">
                  <div className="relative">
                    <StickyNote size={14} className="absolute left-3 top-3 text-secondary-text/40" />
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} maxLength={512}
                      placeholder="e.g. Operated since Cosmos hub genesis, institutional-grade infrastructure..."
                      className={`${inputCls} pl-9 resize-none`} />
                  </div>
                </Field>
              </div>
            </Card>
          )}

          {step === 6 && (
            <Card>
              <CardHeader><CardTitle>Review Your Evidence</CardTitle></CardHeader>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Moniker", value: moniker || "—" },
                  { label: "Website", value: website || "—" },
                  { label: "Uptime %", value: uptimePct ? `${uptimePct}%` : "—" },
                  { label: "Missed Blocks", value: missedBlocks },
                  { label: "Slashing Events", value: slashingEvents },
                  { label: "Governance Votes", value: govVotes },
                  { label: "Delegators", value: delegatorCount },
                  { label: "Validator Age", value: `${validatorAge} days` },
                  { label: "Disputes Won", value: disputesWon },
                  { label: "Disputes Lost", value: disputesLost },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-secondary-text text-xs">{label}</span>
                    <span className="text-primary-text text-xs font-medium">{value}</span>
                  </div>
                ))}
                {notes && (
                  <div className="pt-2">
                    <p className="text-xs text-secondary-text mb-1">Additional Notes</p>
                    <p className="text-xs text-primary-text leading-relaxed">{notes}</p>
                  </div>
                )}
              </div>
              {error && <p className="text-xs text-danger mt-4">{error}</p>}
              <div className="mt-6">
                <Button onClick={submit} loading={submitting} disabled={!isReady} size="lg" className="w-full">
                  Submit Evidence On-Chain
                </Button>
                <p className="text-xs text-secondary-text/50 text-center mt-3">
                  This writes your evidence to the GenLayer Intelligent Contract. No score is assigned yet.
                </p>
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {step < 6 && (
        <div className="flex items-center justify-between mt-6">
          <Button variant="ghost" onClick={() => setStep(s => s - 1)} disabled={step === 1}>
            <ChevronLeft size={14} /> Back
          </Button>
          <Button onClick={() => setStep(s => s + 1)} disabled={!canNext[step]}>
            Continue <ChevronRight size={14} />
          </Button>
        </div>
      )}
      {step === 6 && (
        <div className="mt-4">
          <Button variant="ghost" onClick={() => setStep(5)}>
            <ChevronLeft size={14} /> Back
          </Button>
        </div>
      )}
    </div>
  );
}
