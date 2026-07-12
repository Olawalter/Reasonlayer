"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState, useRef, useEffect } from "react";
import { Wallet, ChevronDown, LogOut, Copy, Check } from "lucide-react";

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

interface WalletButtonProps {
  size?: "sm" | "lg";
}

export function WalletButton({ size = "sm" }: WalletButtonProps) {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function copy() {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (isConnected && address) {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className={
            size === "lg"
              ? "inline-flex items-center gap-3 px-8 py-4 bg-ai-cyan/10 border border-ai-cyan/30 text-ai-cyan font-bold text-lg rounded-xl hover:bg-ai-cyan/15 transition-all font-mono"
              : "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ai-cyan/10 border border-ai-cyan/20 text-ai-cyan text-sm font-mono hover:bg-ai-cyan/15 transition-colors"
          }
        >
          <span className="w-2 h-2 rounded-full bg-ai-cyan animate-pulse" />
          {shortAddr(address)}
          <ChevronDown size={size === "lg" ? 16 : 12} />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 z-50 w-52 bg-surface border border-white/10 rounded-xl shadow-2xl py-1 overflow-hidden">
            <div className="px-4 py-2 border-b border-white/5">
              <p className="text-xs text-secondary-text font-mono truncate">{address}</p>
            </div>
            <button
              onClick={() => { copy(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary-text hover:bg-white/5 transition-colors"
            >
              {copied ? <Check size={14} className="text-ai-cyan" /> : <Copy size={14} className="text-secondary-text" />}
              Copy address
            </button>
            <div className="h-px bg-white/5" />
            <button
              onClick={() => { disconnect(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors"
            >
              <LogOut size={14} />
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(true)}
        disabled={isPending}
        className={
          size === "lg"
            ? "inline-flex items-center gap-3 px-8 py-4 bg-ai-cyan text-background font-bold text-lg rounded-xl hover:bg-ai-cyan/90 transition-all shadow-[0_0_32px_rgba(6,182,212,0.3)] hover:shadow-[0_0_48px_rgba(6,182,212,0.5)] disabled:opacity-60"
            : "flex items-center gap-2 px-4 py-2 rounded-lg bg-ai-cyan text-background font-semibold text-sm hover:bg-ai-cyan/90 transition-colors disabled:opacity-60"
        }
      >
        <Wallet size={size === "lg" ? 20 : 14} />
        {isPending ? "Connecting…" : "Connect Wallet"}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-60 bg-surface border border-white/10 rounded-xl shadow-2xl py-2 overflow-hidden">
          <p className="px-4 py-1.5 text-xs text-secondary-text font-mono border-b border-white/5 mb-1">
            Browser Wallets
          </p>
          {connectors.length === 0 && (
            <p className="px-4 py-3 text-sm text-secondary-text">
              No wallets detected. Install MetaMask or Rabby.
            </p>
          )}
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => { connect({ connector }); setOpen(false); }}
              disabled={isPending}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary-text hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <div className="w-7 h-7 rounded-lg bg-ai-cyan/10 flex items-center justify-center shrink-0">
                <Wallet size={13} className="text-ai-cyan" />
              </div>
              <span>{connector.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
