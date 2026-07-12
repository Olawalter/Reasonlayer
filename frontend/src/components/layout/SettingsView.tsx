"use client";

import { useAccount } from "wagmi";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WalletButton } from "@/components/ui/WalletButton";
import { useContractWrite } from "@/hooks/useContract";
import { Copy, Check, ExternalLink, Zap } from "lucide-react";
import { useState } from "react";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return { copy, copied };
}

const OWNER_ADDRESS = "0xD9368922786222Ad59fA9C54769927C6DBddB109";

export function SettingsView() {
  const { address, isConnected } = useAccount();
  const { copy: copyAddr, copied: copiedAddr } = useCopy(address ?? "");
  const { copy: copyContract, copied: copiedContract } = useCopy(CONTRACT_ADDRESS);
  const { write, isReady } = useContractWrite();
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);

  const isOwner = address?.toLowerCase() === OWNER_ADDRESS.toLowerCase();

  async function seedValidators() {
    setSeeding(true);
    setSeedError(null);
    try {
      await write("seed_test_validators", []);
      setSeedDone(true);
    } catch (err: unknown) {
      setSeedError((err as Error)?.message ?? "Seeding failed");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Settings</h1>
        <p className="text-secondary-text text-sm mt-1">Account and network configuration</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Wallet</CardTitle></CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-text mb-1">Status</p>
              <Badge variant={isConnected ? "success" : "warning"}>
                {isConnected ? "Connected" : "Not Connected"}
              </Badge>
            </div>
            <WalletButton />
          </div>
          {address && (
            <div>
              <p className="text-xs text-secondary-text mb-1">Address</p>
              <button onClick={copyAddr} className="flex items-center gap-2 text-sm font-mono text-primary-text hover:text-ai-cyan transition-colors">
                {address}
                {copiedAddr ? <Check size={14} className="text-success" /> : <Copy size={14} />}
              </button>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle>Network</CardTitle></CardHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-secondary-text mb-1">Network</p>
              <p className="text-sm text-primary-text">GenLayer StudioNet</p>
            </div>
            <div>
              <p className="text-xs text-secondary-text mb-1">Chain ID</p>
              <p className="text-sm font-mono text-primary-text">{process.env.NEXT_PUBLIC_CHAIN_ID ?? "961"}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-secondary-text mb-1">RPC URL</p>
            <p className="text-sm font-mono text-secondary-text break-all">
              {process.env.NEXT_PUBLIC_RPC_URL ?? "https://studio.genlayer.com/api"}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle>Contract</CardTitle></CardHeader>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-secondary-text mb-1">ReasonLayer Contract Address</p>
            <button onClick={copyContract} className="flex items-center gap-2 text-sm font-mono text-primary-text hover:text-ai-cyan transition-colors break-all text-left">
              {CONTRACT_ADDRESS || "Not configured"}
              {copiedContract ? <Check size={14} className="text-success shrink-0" /> : <Copy size={14} className="shrink-0" />}
            </button>
          </div>
          {CONTRACT_ADDRESS && (
            <a
              href={`https://studio.genlayer.com/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-ai-cyan hover:underline"
            >
              View in GenLayer Studio <ExternalLink size={10} />
            </a>
          )}
        </div>
      </Card>

      {isOwner && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-ai-cyan" />
              <CardTitle>Demo Data</CardTitle>
            </div>
          </CardHeader>
          <p className="text-sm text-secondary-text mb-4">
            Seed 5 demo validators with pre-built reputation scores so recommendations work immediately.
          </p>
          {seedDone ? (
            <p className="text-sm text-success">✓ 5 demo validators seeded successfully. Go to Validators or Recommendations.</p>
          ) : (
            <>
              {seedError && <p className="text-xs text-danger mb-2">{seedError}</p>}
              <Button onClick={seedValidators} loading={seeding} disabled={!isReady}>
                <Zap size={14} /> Seed Demo Validators
              </Button>
            </>
          )}
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Resources</CardTitle></CardHeader>
        <div className="space-y-2">
          {[
            { label: "GenLayer Documentation", href: "https://docs.genlayer.com" },
            { label: "GenLayer Studio",        href: "https://studio.genlayer.com" },
            { label: "GenLayer Skills",        href: "https://skills.genlayer.com" },
          ].map(({ label, href }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-surface hover:bg-white/5 transition-colors text-sm text-primary-text group">
              {label}
              <ExternalLink size={12} className="text-secondary-text group-hover:text-ai-cyan transition-colors" />
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
