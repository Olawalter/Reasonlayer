"use client";

import { Menu } from "lucide-react";
import { WalletButton } from "@/components/ui/WalletButton";
import { useUIStore } from "@/store/ui";
import Link from "next/link";

export function Topbar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <header className="h-14 bg-surface border-b border-white/5 flex items-center px-4 gap-4 sticky top-0 z-40">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-lg text-secondary-text hover:text-primary-text hover:bg-card transition-colors lg:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu size={18} />
      </button>
      <Link href="/" className="flex items-center gap-2 font-semibold text-primary-text">
        <span className="text-ai-cyan font-mono text-xs">◈</span>
        ReasonLayer
      </Link>
      <div className="flex-1" />
      <WalletButton />
    </header>
  );
}
