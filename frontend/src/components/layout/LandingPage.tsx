"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { WalletButton } from "@/components/ui/WalletButton";
import {
  Wallet, FileText, Brain, GitBranch, CheckCircle2,
  Trophy, Sparkles, RotateCcw, Shield, Zap, ArrowRight, Globe
} from "lucide-react";

const FLOW_STEPS = [
  { icon: Wallet,        step: "01", title: "Connect Wallet",          color: "text-ai-cyan",    bg: "bg-ai-cyan/10 border-ai-cyan/20",       description: "Connect your wallet. The protocol retrieves your on-chain identity — no forms, no sign-up." },
  { icon: FileText,      step: "02", title: "Submit Evidence",          color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20",      description: "Provide your on-chain signals: uptime %, governance votes, delegator count, slashing history, and more." },
  { icon: Brain,         step: "03", title: "Evidence Assembled",       color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20",  description: "The Intelligent Contract stores your evidence on-chain. No score exists yet — only verifiable facts." },
  { icon: Zap,           step: "04", title: "AI Reasoning Begins",      color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/20",    description: "GenLayer invokes gl.nondet.exec_prompt() — multiple validator nodes independently evaluate your evidence." },
  { icon: GitBranch,     step: "05", title: "Independent Consensus",    color: "text-pink-400",   bg: "bg-pink-500/10 border-pink-500/20",      description: "Each validator node returns a score, confidence level, and reasoning. No two outputs are identical — that's expected." },
  { icon: CheckCircle2,  step: "06", title: "Equivalence Verified",     color: "text-emerald-400",bg: "bg-emerald-500/10 border-emerald-500/20",description: "GenLayer checks: do the conclusions agree? Tier must match. Scores within ±8. Confidence must align. Consensus reached." },
  { icon: Trophy,        step: "07", title: "Reputation Finalized",     color: "text-ai-cyan",    bg: "bg-ai-cyan/10 border-ai-cyan/20",        description: "A score, tier (Bronze → Elite), and confidence level are written to the blockchain as immutable state." },
  { icon: Shield,        step: "08", title: "Explainable Record",       color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20",      description: "Unlike traditional systems, ReasonLayer stores the AI reasoning — strengths, risk factors, and a full summary." },
  { icon: Sparkles,      step: "09", title: "Validator Recommendation", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20",  description: "Delegators set their preferences (security, governance, decentralization). The AI matches them to the best validator." },
  { icon: RotateCcw,     step: "10", title: "Continuous Reassessment", color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/20",    description: "Reputation is not permanent. New events trigger re-evaluation. The reputation evolves over time." },
];

const CONSENSUS_NODES = [
  { id: "A", score: 88, verdict: "Strong uptime and governance engagement.", delay: 0 },
  { id: "B", score: 91, verdict: "Long-term participation with no penalties.", delay: 0.4 },
  { id: "C", score: 87, verdict: "Reliable history but moderate delegation growth.", delay: 0.8 },
];

function ConsensusDemo() {
  return (
    <div className="py-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-white/10 text-xs font-mono text-secondary-text">
          <span className="text-ai-cyan">gl.nondet</span>.exec_prompt(evidence)
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {CONSENSUS_NODES.map((n) => (
          <motion.div key={n.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: n.delay, duration: 0.5 }}
            className="bg-surface border border-white/8 rounded-xl p-4 text-center">
            <div className="w-8 h-8 rounded-full bg-ai-cyan/10 border border-ai-cyan/30 flex items-center justify-center text-ai-cyan text-xs font-bold mx-auto mb-3">
              {n.id}
            </div>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: n.delay + 0.3, type: "spring" }}
              className="text-2xl font-bold text-primary-text mb-1">{n.score}</motion.div>
            <p className="text-xs text-secondary-text leading-relaxed">{n.verdict}</p>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
          <CheckCircle2 size={12} /> Equivalence verified — tier: Trusted · confidence: high
        </div>
      </motion.div>
    </div>
  );
}

function FlowStep({ step, index }: { step: typeof FLOW_STEPS[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45 }}
      className="flex gap-4 items-start">
      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${step.bg}`}>
        <step.icon size={18} className={step.color} />
      </div>
      <div className="pt-0.5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-secondary-text/50">{step.step}</span>
          <h3 className="text-sm font-semibold text-primary-text">{step.title}</h3>
        </div>
        <p className="text-xs text-secondary-text leading-relaxed">{step.description}</p>
      </div>
    </motion.div>
  );
}

export function LandingPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) router.push("/dashboard");
  }, [isConnected, router]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-ai-cyan/20 border border-ai-cyan/30 flex items-center justify-center">
              <Globe size={13} className="text-ai-cyan" />
            </div>
            <span className="font-semibold text-primary-text text-sm tracking-wide">ReasonLayer</span>
          </div>
          <div className="flex items-center gap-3">
            {isConnected && (
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-ai-cyan border border-ai-cyan/30 hover:bg-ai-cyan/10 transition-colors"
              >
                Go to App <ArrowRight size={13} />
              </button>
            )}
            <WalletButton />
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-ai-cyan/3 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-blue-500/3 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ai-cyan/8 border border-ai-cyan/20 text-xs text-ai-cyan mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-ai-cyan animate-pulse" />
            Built on GenLayer — AI-native blockchain consensus
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-text leading-tight mb-6">
            Decentralized Trust<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ai-cyan to-blue-400">
              Adjudicated by AI
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-base text-secondary-text max-w-2xl mx-auto mb-3 leading-relaxed">
            ReasonLayer is not a reputation calculator. It&apos;s a decentralized trust adjudication protocol
            where multiple GenLayer AI validator nodes reach consensus on trustworthiness itself.
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-sm text-secondary-text/50 mb-10">
            No backend. No oracle. No admin keys. The AI <em>is</em> the validator.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <WalletButton size="lg" />
            <a href="#flow" className="inline-flex items-center gap-2 text-sm text-secondary-text hover:text-primary-text transition-colors">
              See how it works <ArrowRight size={13} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="px-6 pb-20">
        <div className="max-w-xl mx-auto grid grid-cols-3 gap-4">
          {[
            { v: "10-step", l: "On-chain flow" },
            { v: "3-node",  l: "AI consensus" },
            { v: "0",       l: "Backend servers" },
          ].map(({ v, l }) => (
            <div key={l} className="text-center px-4 py-4 rounded-xl bg-card border border-white/8">
              <div className="text-xl font-bold text-ai-cyan">{v}</div>
              <div className="text-xs text-secondary-text mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Consensus demo ── */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-primary-text mb-3">How AI Consensus Works</h2>
            <p className="text-secondary-text text-sm max-w-lg mx-auto">
              Multiple GenLayer AI nodes independently evaluate the same evidence.
              No two outputs are identical — what matters is equivalence.
            </p>
          </div>
          <div className="bg-card border border-white/8 rounded-2xl p-8">
            <ConsensusDemo />
          </div>
        </div>
      </section>

      {/* ── Flow steps ── */}
      <section id="flow" className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-primary-text mb-3">End-to-End Protocol Flow</h2>
            <p className="text-secondary-text text-sm max-w-lg mx-auto">
              From wallet connection to continuous reassessment — every step happens on-chain through GenLayer&apos;s Intelligent Contract.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-10">
            {FLOW_STEPS.map((s, i) => <FlowStep key={s.step} step={s} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── Why GenLayer ── */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-white/8 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-xl font-bold text-primary-text mb-4">Why Traditional Blockchains Can&apos;t Do This</h2>
                <p className="text-secondary-text text-sm leading-relaxed mb-4">
                  Traditional smart contracts are deterministic — every node runs the same code and reaches the exact same result.
                  That means no LLMs, no judgment, no context. Just arithmetic.
                </p>
                <p className="text-secondary-text text-sm leading-relaxed">
                  GenLayer solves this with <strong className="text-primary-text">Optimistic Democracy</strong> — AI-enabled validator
                  nodes independently reason about the same prompt, then vote on whether their conclusions are{" "}
                  <em className="text-primary-text">equivalent</em>, not identical.
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-surface rounded-xl p-4 border border-white/5">
                  <div className="text-xs text-secondary-text mb-2 font-mono">Traditional blockchain</div>
                  <code className="text-xs text-amber-400">score = uptime × 0.5 + votes × 0.3</code>
                  <p className="text-xs text-secondary-text/50 mt-2">Deterministic. No judgment. No context.</p>
                </div>
                <div className="text-center text-xs text-secondary-text/30">vs</div>
                <div className="bg-ai-cyan/5 rounded-xl p-4 border border-ai-cyan/20">
                  <div className="text-xs text-ai-cyan mb-2 font-mono">GenLayer Intelligent Contract</div>
                  <code className="text-xs text-primary-text">&ldquo;Based on all evidence, is this validator trustworthy?&rdquo;</code>
                  <p className="text-xs text-secondary-text/50 mt-2">Interpretation. Judgment. Consensus.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 pb-32">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-primary-text mb-4">Ready to build your on-chain reputation?</h2>
          <p className="text-secondary-text text-sm mb-8">Connect your wallet, submit your evidence, and let the network adjudicate your trust.</p>
          <WalletButton size="lg" />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary-text/40">
          <div className="flex items-center gap-2">
            <Globe size={11} className="text-ai-cyan/40" />
            <span>ReasonLayer — Built on GenLayer StudioNet</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://genlayer.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary-text transition-colors">GenLayer</a>
            <a href="https://docs.genlayer.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary-text transition-colors">Docs</a>
            <a href="https://github.com/Olawalter/Reasonlayer" target="_blank" rel="noopener noreferrer" className="hover:text-secondary-text transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
