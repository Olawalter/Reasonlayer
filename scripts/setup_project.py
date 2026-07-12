"""
ReasonLayer -- Project Scaffold Script
Run from: C:\\GenB\\ReasonLayer
Command:  python scripts/setup_project.py
"""

import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def mkdir(path):
    os.makedirs(path, exist_ok=True)


def write(path, content):
    mkdir(os.path.dirname(path))
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  created  {os.path.relpath(path, ROOT)}")


def p(*parts):
    return os.path.join(ROOT, *parts)


# ─────────────────────────────────────────────
# DIRECTORIES
# ─────────────────────────────────────────────
dirs = [
    "contracts",
    "frontend/src/app/dashboard",
    "frontend/src/app/profile/[address]",
    "frontend/src/app/validators/[address]",
    "frontend/src/app/passport/[address]",
    "frontend/src/app/evaluations",
    "frontend/src/app/recommendations",
    "frontend/src/app/settings",
    "frontend/src/components/ui",
    "frontend/src/components/layout",
    "frontend/src/components/wallet",
    "frontend/src/components/trust",
    "frontend/src/components/evaluation",
    "frontend/src/components/validator",
    "frontend/src/components/recommendation",
    "frontend/src/components/transaction",
    "frontend/src/lib/genlayer",
    "frontend/src/lib/wallet",
    "frontend/src/lib/utils",
    "frontend/src/store",
    "frontend/src/hooks",
    "frontend/src/styles",
    "frontend/public/fonts",
    "frontend/public/images",
    "tests/contract",
    "tests/frontend",
    "scripts",
    "docs",
    "assets",
]

print("\n[1/5] Creating directories...")
for d in dirs:
    mkdir(p(d))
    print(f"  mkdir    {d}")


# ─────────────────────────────────────────────
# ROOT CONFIG FILES
# ─────────────────────────────────────────────
print("\n[2/5] Writing root config files...")

write(p(".gitignore"), """\
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
.next/
out/
dist/
build/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Python
__pycache__/
*.py[cod]
*.pyo
.pytest_cache/
.venv/
venv/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp

# GenLayer
.genlayer/
""")

write(p(".env.example"), """\
# Set these before running the frontend.
# Copy this file to frontend/.env.local and fill in the values.

# Deployed ReasonLayer contract address (set after Step 15)
NEXT_PUBLIC_CONTRACT_ADDRESS=

# GenLayer StudioNet chain ID
NEXT_PUBLIC_CHAIN_ID=

# GenLayer StudioNet RPC endpoint
NEXT_PUBLIC_RPC_URL=

# App metadata
NEXT_PUBLIC_APP_NAME=ReasonLayer
NEXT_PUBLIC_APP_URL=https://reasonlayer.vercel.app
""")

write(p("pyproject.toml"), """\
[build-system]
requires = ["setuptools"]
build-backend = "setuptools.backends.legacy:build"

[project]
name = "reasonlayer-tests"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "genlayer-test",
]

[tool.pytest.ini_options]
testpaths = ["tests/contract"]
asyncio_mode = "auto"
""")

write(p("contracts/README.md"), """\
# ReasonLayer Intelligent Contract

Single Python Intelligent Contract deployed to GenLayer StudioNet.

## File
- `ReasonLayer.py` -- the contract source

## Deploy
```bash
genlayer deploy --network studionet contracts/ReasonLayer.py
```

## Test (direct mode -- no network)
```bash
pytest tests/contract/ -v
```

## Test (integration mode -- requires localnet)
```bash
genlayer up
pytest tests/contract/ -v --integration
```
""")


# ─────────────────────────────────────────────
# -- INTELLIGENT CONTRACT --
# contracts/ReasonLayer.py was written directly -- skipping to avoid
# triple-quote nesting issues inside this scaffold script.
print("\n[3/5] Intelligent Contract already written to contracts/ReasonLayer.py")

# ─────────────────────────────────────────────
# FRONTEND CONFIG FILES
# ─────────────────────────────────────────────
print("\n[4/5] Writing frontend config and source files...")

write(p("frontend/package.json"), """\
{
  "name": "reasonlayer-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "15.3.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "genlayer-js": "latest",
    "zustand": "^5.0.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "@tanstack/react-query": "^5.0.0",
    "viem": "^2.0.0",
    "wagmi": "^2.0.0",
    "@rainbow-me/rainbowkit": "^2.0.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5",
    "tailwindcss": "^3.4.0",
    "postcss": "^8",
    "autoprefixer": "^10",
    "eslint": "^9",
    "eslint-config-next": "15.3.3"
  }
}
""")

write(p("frontend/tsconfig.json"), """\
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
""")

write(p("frontend/next.config.ts"), """\
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
};

export default nextConfig;
""")

write(p("frontend/tailwind.config.ts"), """\
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B1120",
        surface: "#111827",
        card: "#1F2937",
        "primary-text": "#F8FAFC",
        "secondary-text": "#94A3B8",
        "primary-blue": "#3B82F6",
        "ai-cyan": "#06B6D4",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
""")

write(p("frontend/postcss.config.js"), """\
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
""")

write(p("frontend/.env.local.example"), """\
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_CHAIN_ID=
NEXT_PUBLIC_RPC_URL=
NEXT_PUBLIC_APP_NAME=ReasonLayer
""")

write(p("frontend/.gitignore"), """\
.next/
node_modules/
.env.local
.env.development.local
.env.test.local
.env.production.local
""")

# ─────────────────────────────────────────────
# FRONTEND SOURCE FILES
# ─────────────────────────────────────────────

# globals.css
write(p("frontend/src/styles/globals.css"), """\
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #0B1120;
  --surface: #111827;
  --card: #1F2937;
  --primary-text: #F8FAFC;
  --secondary-text: #94A3B8;
  --primary-blue: #3B82F6;
  --ai-cyan: #06B6D4;
  --success: #22C55E;
  --warning: #F59E0B;
  --danger: #EF4444;
}

html,
body {
  background-color: var(--background);
  color: var(--primary-text);
  font-family: 'Geist', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: var(--surface);
}
::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #4B5563;
}
""")

# Root layout
write(p("frontend/src/app/layout.tsx"), """\
import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ReasonLayer -- AI Validator Intelligence Protocol",
  description:
    "AI-native validator intelligence and trust scoring on GenLayer. Powered by on-chain AI consensus.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-primary-text antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
""")

# Providers
write(p("frontend/src/app/providers.tsx"), """\
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig } from "@/lib/wallet/connector";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
""")

# Landing page
write(p("frontend/src/app/page.tsx"), """\
import { LandingPage } from "@/components/layout/LandingPage";

export default function Home() {
  return <LandingPage />;
}
""")

# Dashboard
write(p("frontend/src/app/dashboard/page.tsx"), """\
import { AppShell } from "@/components/layout/AppShell";
import { DashboardView } from "@/components/layout/DashboardView";

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardView />
    </AppShell>
  );
}
""")

# Profile -- my profile
write(p("frontend/src/app/profile/page.tsx"), """\
import { AppShell } from "@/components/layout/AppShell";
import { MyProfileView } from "@/components/layout/MyProfileView";

export default function ProfilePage() {
  return (
    <AppShell>
      <MyProfileView />
    </AppShell>
  );
}
""")

# Profile -- public
write(p("frontend/src/app/profile/[address]/page.tsx"), """\
import { AppShell } from "@/components/layout/AppShell";
import { PublicProfileView } from "@/components/layout/PublicProfileView";

export default function PublicProfilePage({
  params,
}: {
  params: { address: string };
}) {
  return (
    <AppShell>
      <PublicProfileView address={params.address} />
    </AppShell>
  );
}
""")

# Validators registry
write(p("frontend/src/app/validators/page.tsx"), """\
import { AppShell } from "@/components/layout/AppShell";
import { ValidatorRegistryView } from "@/components/layout/ValidatorRegistryView";

export default function ValidatorsPage() {
  return (
    <AppShell>
      <ValidatorRegistryView />
    </AppShell>
  );
}
""")

# Validator detail
write(p("frontend/src/app/validators/[address]/page.tsx"), """\
import { AppShell } from "@/components/layout/AppShell";
import { ValidatorDetailView } from "@/components/layout/ValidatorDetailView";

export default function ValidatorDetailPage({
  params,
}: {
  params: { address: string };
}) {
  return (
    <AppShell>
      <ValidatorDetailView address={params.address} />
    </AppShell>
  );
}
""")

# Trust Passport
write(p("frontend/src/app/passport/[address]/page.tsx"), """\
import { AppShell } from "@/components/layout/AppShell";
import { TrustPassportView } from "@/components/layout/TrustPassportView";

export default function PassportPage({
  params,
}: {
  params: { address: string };
}) {
  return (
    <AppShell>
      <TrustPassportView address={params.address} />
    </AppShell>
  );
}
""")

# Evaluations
write(p("frontend/src/app/evaluations/page.tsx"), """\
import { AppShell } from "@/components/layout/AppShell";
import { EvaluationsView } from "@/components/layout/EvaluationsView";

export default function EvaluationsPage() {
  return (
    <AppShell>
      <EvaluationsView />
    </AppShell>
  );
}
""")

# Recommendations
write(p("frontend/src/app/recommendations/page.tsx"), """\
import { AppShell } from "@/components/layout/AppShell";
import { RecommendationsView } from "@/components/layout/RecommendationsView";

export default function RecommendationsPage() {
  return (
    <AppShell>
      <RecommendationsView />
    </AppShell>
  );
}
""")

# Settings
write(p("frontend/src/app/settings/page.tsx"), """\
import { AppShell } from "@/components/layout/AppShell";
import { SettingsView } from "@/components/layout/SettingsView";

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsView />
    </AppShell>
  );
}
""")

# 404
write(p("frontend/src/app/not-found.tsx"), """\
"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-ai-cyan font-mono text-sm mb-4">ERROR_404</p>
        <h1 className="text-4xl font-bold text-primary-text mb-2">
          Not Found
        </h1>
        <p className="text-secondary-text mb-8">
          This page does not exist on the network.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-primary-blue text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
""")

# ─── LIB: GenLayer types ───
write(p("frontend/src/lib/genlayer/types.ts"), """\
// On-chain data types -- mirror the contract's dataclasses exactly.

export interface MemberProfile {
  address: string;
  display_name: string;
  bio: string;
  registered_at: bigint;
  is_active: boolean;
  endorsement_count: number;
  dispute_count: number;
}

export interface ValidatorProfile {
  address: string;
  moniker: string;
  website: string;
  is_active: boolean;
  registered_at: bigint;
  uptime_score: number;
  total_evaluations_given: number;
}

export interface TrustScore {
  subject: string;
  score: number;
  tier: TrustTier;
  reasoning: string;
  flags: string; // JSON array string
  last_evaluated_at: bigint;
  evaluation_count: number;
}

export interface EvaluationRecord {
  id: number;
  subject: string;
  requested_by: string;
  score: number;
  tier: TrustTier;
  reasoning: string;
  flags: string;
  evaluated_at: number;
}

export interface Dispute {
  id: number;
  target: string;
  raised_by: string;
  reason: string;
  evidence_url: string;
  resolution: "pending" | "upheld" | "rejected";
  ai_verdict: string;
  raised_at: number;
  resolved_at: number;
}

export interface RecommendationSet {
  for_address: string;
  validator_addresses: string; // JSON array string
  reasoning: string;
  generated_at: bigint;
}

export interface ContractStats {
  total_members: number;
  total_validators: number;
  total_evaluations: number;
  total_disputes: number;
}

export type TrustTier =
  | "Unverified"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum";

export const TIER_COLORS: Record<TrustTier, string> = {
  Unverified: "#94A3B8",
  Bronze:     "#CD7F32",
  Silver:     "#C0C0C0",
  Gold:       "#F59E0B",
  Platinum:   "#06B6D4",
};

export const TIER_BG: Record<TrustTier, string> = {
  Unverified: "bg-secondary-text/10",
  Bronze:     "bg-amber-900/20",
  Silver:     "bg-slate-400/10",
  Gold:       "bg-amber-500/10",
  Platinum:   "bg-ai-cyan/10",
};
""")

# LIB: GenLayer client
write(p("frontend/src/lib/genlayer/client.ts"), """\
"use client";

import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

// Singleton client for read-only (view) calls -- no account needed.
let _readClient: ReturnType<typeof createClient> | null = null;

export function getReadClient() {
  if (!_readClient) {
    _readClient = createClient({
      chain: studionet,
    });
  }
  return _readClient;
}

// Write client -- requires a connected wallet account.
// Call this after wallet is connected; pass the provider's account.
export function createWriteClient(account: Parameters<typeof createClient>[0]["account"]) {
  return createClient({
    chain: studionet,
    account,
  });
}

export const CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "") as `0x${string}`;
""")

# LIB: Contract methods
write(p("frontend/src/lib/genlayer/contract.ts"), """\
"use client";

import { TransactionStatus } from "genlayer-js/types";
import { getReadClient, CONTRACT_ADDRESS } from "./client";
import type {
  MemberProfile,
  ValidatorProfile,
  TrustScore,
  EvaluationRecord,
  RecommendationSet,
  ContractStats,
} from "./types";

// ─── View (read) helpers ─────────────────────────────────────────────────────

const read = () => getReadClient();

export async function fetchMember(address: string): Promise<MemberProfile> {
  return read().readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_member",
    args: [address],
  }) as Promise<MemberProfile>;
}

export async function fetchValidator(address: string): Promise<ValidatorProfile> {
  return read().readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_validator",
    args: [address],
  }) as Promise<ValidatorProfile>;
}

export async function fetchTrustPassport(address: string): Promise<TrustScore> {
  return read().readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_trust_passport",
    args: [address],
  }) as Promise<TrustScore>;
}

export async function fetchEvaluations(
  address: string,
  limit = 10,
  offset = 0
): Promise<EvaluationRecord[]> {
  return read().readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_evaluations",
    args: [address, limit, offset],
  }) as Promise<EvaluationRecord[]>;
}

export async function fetchRecommendations(
  address: string
): Promise<RecommendationSet> {
  return read().readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_recommendations",
    args: [address],
  }) as Promise<RecommendationSet>;
}

export async function fetchValidatorRegistry(
  limit = 20,
  offset = 0
): Promise<ValidatorProfile[]> {
  return read().readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_validator_registry",
    args: [limit, offset],
  }) as Promise<ValidatorProfile[]>;
}

export async function fetchStats(): Promise<ContractStats> {
  return read().readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_stats",
    args: [],
  }) as Promise<ContractStats>;
}

export async function fetchIsRegistered(address: string): Promise<boolean> {
  return read().readContract({
    address: CONTRACT_ADDRESS,
    functionName: "is_registered",
    args: [address],
  }) as Promise<boolean>;
}

// ─── Write (transaction) helpers ─────────────────────────────────────────────

export async function waitForFinalized(
  client: ReturnType<typeof import("./client").createWriteClient>,
  hash: string
) {
  return client.waitForTransactionReceipt({
    hash: hash as `0x${string}`,
    status: TransactionStatus.FINALIZED,
    retries: 60,
    interval: 3000,
  });
}
""")

# LIB: Wallet connector
write(p("frontend/src/lib/wallet/connector.ts"), """\
"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

// StudioNet chain definition
// Update CHAIN_ID and RPC_URL from environment variables before deploy.
const studionetChain = defineChain({
  id: Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 42069),
  name: "GenLayer StudioNet",
  nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL ?? "https://studio.genlayer.com/api"],
    },
  },
});

export const wagmiConfig = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "ReasonLayer",
  projectId: "reasonlayer",  // Replace with WalletConnect project ID from cloud.walletconnect.com
  chains: [studionetChain],
  ssr: true,
});

export { studionetChain };
""")

# LIB: Utils
write(p("frontend/src/lib/utils/address.ts"), """\
export function truncateAddress(address: string, chars = 4): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function isValidAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}
""")

write(p("frontend/src/lib/utils/format.ts"), """\
export function formatTimestamp(ts: number | bigint): string {
  const ms = typeof ts === "bigint" ? Number(ts) * 1000 : ts * 1000;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));
}

export function relativeTime(ts: number | bigint): string {
  const ms = typeof ts === "bigint" ? Number(ts) * 1000 : ts * 1000;
  const diff = Date.now() - ms;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
""")

write(p("frontend/src/lib/utils/trust.ts"), """\
import type { TrustTier } from "@/lib/genlayer/types";

export function scoreToTier(score: number): TrustTier {
  if (score < 20) return "Unverified";
  if (score < 40) return "Bronze";
  if (score < 60) return "Silver";
  if (score < 80) return "Gold";
  return "Platinum";
}

export function tierToRange(tier: TrustTier): [number, number] {
  const map: Record<TrustTier, [number, number]> = {
    Unverified: [0, 19],
    Bronze:     [20, 39],
    Silver:     [40, 59],
    Gold:       [60, 79],
    Platinum:   [80, 100],
  };
  return map[tier];
}

export function parseFlagsList(flagsJson: string): string[] {
  try {
    const parsed = JSON.parse(flagsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseAddressList(addressesJson: string): string[] {
  try {
    const parsed = JSON.parse(addressesJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
""")

# STORE: wallet
write(p("frontend/src/store/wallet.ts"), """\
import { create } from "zustand";

interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  setWallet: (address: string, chainId: number) => void;
  clearWallet: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  chainId: null,
  isConnected: false,
  setWallet: (address, chainId) => set({ address, chainId, isConnected: true }),
  clearWallet: () => set({ address: null, chainId: null, isConnected: false }),
}));
""")

# STORE: profile cache
write(p("frontend/src/store/profile.ts"), """\
import { create } from "zustand";
import type { MemberProfile, TrustScore } from "@/lib/genlayer/types";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface ProfileState {
  member: MemberProfile | null;
  trustScore: TrustScore | null;
  lastFetched: number;
  setMember: (member: MemberProfile) => void;
  setTrustScore: (score: TrustScore) => void;
  isStale: () => boolean;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  member: null,
  trustScore: null,
  lastFetched: 0,
  setMember: (member) => set({ member, lastFetched: Date.now() }),
  setTrustScore: (trustScore) => set({ trustScore }),
  isStale: () => Date.now() - get().lastFetched > CACHE_TTL_MS,
  clearProfile: () => set({ member: null, trustScore: null, lastFetched: 0 }),
}));
""")

# STORE: ui
write(p("frontend/src/store/ui.ts"), """\
import { create } from "zustand";

type ModalId = "connect-wallet" | "confirm-tx" | "register" | null;

interface TxState {
  hash: string;
  status: "pending" | "accepted" | "finalized" | "error";
  method: string;
}

interface UIState {
  sidebarOpen: boolean;
  activeModal: ModalId;
  pendingTx: TxState | null;
  setSidebarOpen: (open: boolean) => void;
  openModal: (id: ModalId) => void;
  closeModal: () => void;
  setPendingTx: (tx: TxState | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeModal: null,
  pendingTx: null,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
  setPendingTx: (tx) => set({ pendingTx: tx }),
}));
""")

# HOOKS
write(p("frontend/src/hooks/useWallet.ts"), """\
"use client";

import { useAccount, useDisconnect } from "wagmi";
import { useWalletStore } from "@/store/wallet";
import { useEffect } from "react";

export function useWallet() {
  const { address, chainId, isConnected } = useAccount();
  const { setWallet, clearWallet } = useWalletStore();

  useEffect(() => {
    if (isConnected && address && chainId) {
      setWallet(address, chainId);
    } else {
      clearWallet();
    }
  }, [isConnected, address, chainId, setWallet, clearWallet]);

  const { disconnect } = useDisconnect();

  return {
    address: address ?? null,
    chainId: chainId ?? null,
    isConnected,
    disconnect,
  };
}
""")

write(p("frontend/src/hooks/useContract.ts"), """\
"use client";

import { useWalletClient } from "wagmi";
import { createWriteClient, CONTRACT_ADDRESS } from "@/lib/genlayer/client";
import { useUIStore } from "@/store/ui";
import { TransactionStatus } from "genlayer-js/types";
import { useMemo } from "react";

export function useContractWrite() {
  const { data: walletClient } = useWalletClient();
  const { setPendingTx } = useUIStore();

  const client = useMemo(() => {
    if (!walletClient) return null;
    return createWriteClient(walletClient as Parameters<typeof createWriteClient>[0]);
  }, [walletClient]);

  async function write(method: string, args: unknown[]) {
    if (!client) throw new Error("Wallet not connected");

    const hash = await client.writeContract({
      address: CONTRACT_ADDRESS,
      functionName: method,
      args,
    });

    setPendingTx({ hash: hash as string, status: "pending", method });

    const receipt = await client.waitForTransactionReceipt({
      hash: hash as `0x${string}`,
      status: TransactionStatus.FINALIZED,
      retries: 60,
      interval: 3000,
    });

    setPendingTx(null);
    return receipt;
  }

  return { write, isReady: !!client };
}
""")

write(p("frontend/src/hooks/useMember.ts"), """\
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMember, fetchIsRegistered } from "@/lib/genlayer/contract";

export function useMember(address: string | null | undefined) {
  return useQuery({
    queryKey: ["member", address],
    queryFn: () => fetchMember(address!),
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useIsRegistered(address: string | null | undefined) {
  return useQuery({
    queryKey: ["is_registered", address],
    queryFn: () => fetchIsRegistered(address!),
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
  });
}
""")

write(p("frontend/src/hooks/useValidator.ts"), """\
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchValidator, fetchValidatorRegistry } from "@/lib/genlayer/contract";

export function useValidator(address: string | null | undefined) {
  return useQuery({
    queryKey: ["validator", address],
    queryFn: () => fetchValidator(address!),
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useValidatorRegistry(limit = 20, offset = 0) {
  return useQuery({
    queryKey: ["validator_registry", limit, offset],
    queryFn: () => fetchValidatorRegistry(limit, offset),
    staleTime: 5 * 60 * 1000,
  });
}
""")

write(p("frontend/src/hooks/useTrustPassport.ts"), """\
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTrustPassport } from "@/lib/genlayer/contract";

export function useTrustPassport(address: string | null | undefined) {
  return useQuery({
    queryKey: ["trust_passport", address],
    queryFn: () => fetchTrustPassport(address!),
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
""")

write(p("frontend/src/hooks/useEvaluations.ts"), """\
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEvaluations } from "@/lib/genlayer/contract";

export function useEvaluations(
  address: string | null | undefined,
  limit = 10,
  offset = 0
) {
  return useQuery({
    queryKey: ["evaluations", address, limit, offset],
    queryFn: () => fetchEvaluations(address!, limit, offset),
    enabled: !!address,
    staleTime: 2 * 60 * 1000,
  });
}
""")

write(p("frontend/src/hooks/useTransaction.ts"), """\
"use client";

import { useUIStore } from "@/store/ui";

export function usePendingTx() {
  const { pendingTx } = useUIStore();
  return {
    pendingTx,
    isPending: !!pendingTx && pendingTx.status === "pending",
    isAccepted: pendingTx?.status === "accepted",
    isFinalized: pendingTx?.status === "finalized",
    isError: pendingTx?.status === "error",
  };
}
""")


# ─── PLACEHOLDER VIEW COMPONENTS ───
# These are minimal stubs that will be fully implemented in Steps 9–14.

views = {
    "LandingPage":          "Landing page -- implemented in Step 9",
    "DashboardView":        "Dashboard -- implemented in Step 10",
    "MyProfileView":        "My Profile -- implemented in Step 11",
    "PublicProfileView":    "Public Profile -- implemented in Step 11",
    "ValidatorRegistryView":"Validator Registry -- implemented in Step 12",
    "ValidatorDetailView":  "Validator Detail -- implemented in Step 12",
    "TrustPassportView":    "Trust Passport -- implemented in Step 13",
    "EvaluationsView":      "Evaluations -- implemented in Step 13",
    "RecommendationsView":  "Recommendations -- implemented in Step 14",
    "SettingsView":         "Settings -- implemented in Step 14",
}

for name, label in views.items():
    folder = "layout"
    write(p(f"frontend/src/components/{folder}/{name}.tsx"), f"""\
"use client";
// {label}
export function {name}(props: Record<string, unknown>) {{
  return (
    <div className="p-8 text-secondary-text font-mono text-sm">
      [{label}]
    </div>
  );
}}
""")

# AppShell skeleton
write(p("frontend/src/components/layout/AppShell.tsx"), """\
"use client";

import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { useUIStore } from "@/store/ui";
import { TxStatusBanner } from "@/components/transaction/TxStatusBanner";
import { cn } from "@/lib/utils/cn";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-200",
            sidebarOpen ? "ml-0 lg:ml-64" : "ml-0"
          )}
        >
          <TxStatusBanner />
          <div className="p-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
""")

# Topbar skeleton
write(p("frontend/src/components/layout/Topbar.tsx"), """\
"use client";

import { Menu } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
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
      <ConnectButton
        accountStatus="address"
        chainStatus="none"
        showBalance={false}
      />
    </header>
  );
}
""")

# Sidebar skeleton
write(p("frontend/src/components/layout/Sidebar.tsx"), """\
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, User, Shield, Fingerprint,
  Clock, Sparkles, Settings
} from "lucide-react";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/dashboard",        label: "Dashboard",      icon: LayoutDashboard },
  { href: "/profile",          label: "My Profile",     icon: User },
  { href: "/validators",       label: "Validators",     icon: Shield },
  { href: "/evaluations",      label: "Evaluations",    icon: Clock },
  { href: "/recommendations",  label: "Recommendations",icon: Sparkles },
  { href: "/settings",         label: "Settings",       icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen } = useUIStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 bg-surface border-r border-white/5",
        "flex flex-col py-4 z-30 transition-transform duration-200",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}
    >
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active
                  ? "bg-primary-blue/10 text-primary-blue font-medium"
                  : "text-secondary-text hover:text-primary-text hover:bg-card"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 pb-2">
        <p className="text-xs text-secondary-text/50 font-mono">
          ReasonLayer v0.1
        </p>
      </div>
    </aside>
  );
}
""")

# TxStatusBanner
write(p("frontend/src/components/transaction/TxStatusBanner.tsx"), """\
"use client";

import { usePendingTx } from "@/hooks/useTransaction";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function TxStatusBanner() {
  const { pendingTx, isPending, isFinalized, isError } = usePendingTx();

  if (!pendingTx) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="mx-6 mt-4 px-4 py-3 rounded-lg border flex items-center gap-3 text-sm"
        style={{
          background: isPending
            ? "rgba(59,130,246,0.08)"
            : isFinalized
            ? "rgba(34,197,94,0.08)"
            : "rgba(239,68,68,0.08)",
          borderColor: isPending
            ? "rgba(59,130,246,0.2)"
            : isFinalized
            ? "rgba(34,197,94,0.2)"
            : "rgba(239,68,68,0.2)",
        }}
      >
        {isPending && (
          <Loader2 size={15} className="text-primary-blue animate-spin" />
        )}
        {isFinalized && <CheckCircle2 size={15} className="text-success" />}
        {isError && <XCircle size={15} className="text-danger" />}
        <span className="text-primary-text font-mono text-xs">
          {pendingTx.method}
        </span>
        <span className="text-secondary-text">
          {isPending && "-- awaiting GenLayer consensus..."}
          {isFinalized && "-- finalized"}
          {isError && "-- failed"}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
""")

# cn utility
write(p("frontend/src/lib/utils/cn.ts"), """\
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
""")

# ─────────────────────────────────────────────
# TEST SKELETONS
# ─────────────────────────────────────────────

write(p("tests/contract/test_registration.py"), """\
\"\"\"
Tests: register_member, register_validator, duplicate prevention.
Run: pytest tests/contract/test_registration.py -v
\"\"\"
import pytest


# Direct mode tests are written once the contract is loaded into the
# genlayer-test runner. These stubs show the intended test structure.

@pytest.mark.skip(reason="Implement after Step 4 contract finalization")
def test_register_member_success():
    pass


@pytest.mark.skip(reason="Implement after Step 4 contract finalization")
def test_register_member_duplicate_fails():
    pass


@pytest.mark.skip(reason="Implement after Step 4 contract finalization")
def test_register_validator_requires_member():
    pass
""")

write(p("tests/contract/test_trust_evaluation.py"), """\
\"\"\"
Tests: request_trust_evaluation, score ranges, tier logic, equivalence.
\"\"\"
import pytest


@pytest.mark.skip(reason="Implement after Step 4 contract finalization")
def test_evaluation_produces_valid_tier():
    pass


@pytest.mark.skip(reason="Implement after Step 4 contract finalization")
def test_evaluation_score_in_range():
    pass


@pytest.mark.skip(reason="Implement after Step 4 contract finalization")
def test_evaluation_stored_in_history():
    pass
""")

write(p("tests/contract/test_endorsements.py"), """\
\"\"\"
Tests: submit_endorsement, double-endorsement prevention, self-endorsement block.
\"\"\"
import pytest


@pytest.mark.skip(reason="Implement after Step 4 contract finalization")
def test_endorsement_increments_count():
    pass


@pytest.mark.skip(reason="Implement after Step 4 contract finalization")
def test_cannot_endorse_self():
    pass


@pytest.mark.skip(reason="Implement after Step 4 contract finalization")
def test_cannot_double_endorse():
    pass
""")

write(p("tests/contract/test_disputes.py"), """\
\"\"\"
Tests: submit_dispute, resolve_dispute AI verdict.
\"\"\"
import pytest


@pytest.mark.skip(reason="Implement after Step 4 contract finalization")
def test_dispute_created_as_pending():
    pass


@pytest.mark.skip(reason="Implement after Step 4 contract finalization")
def test_dispute_resolved_by_admin():
    pass
""")

write(p("tests/contract/test_recommendations.py"), """\
\"\"\"
Tests: generate_recommendations output schema.
\"\"\"
import pytest


@pytest.mark.skip(reason="Implement after Step 4 contract finalization")
def test_recommendations_returns_three_addresses():
    pass


@pytest.mark.skip(reason="Implement after Step 4 contract finalization")
def test_recommendations_addresses_from_registry():
    pass
""")

# ─────────────────────────────────────────────
# DOCS
# ─────────────────────────────────────────────
print("\n[5/5] Writing documentation stubs...")

write(p("docs/README.md"), """\
# ReasonLayer

AI-native Validator Intelligence Protocol built on GenLayer.

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- GenLayer CLI: `npm install -g genlayer`

### 1. Install frontend dependencies
```bash
cd frontend
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_CONTRACT_ADDRESS, CHAIN_ID, RPC_URL after Step 15
```

### 3. Run frontend locally
```bash
npm run dev
```

### 4. Install contract test dependencies
```bash
pip install genlayer-test
```

### 5. Test the contract
```bash
pytest tests/contract/ -v
```

## Documentation
- [Architecture](ARCHITECTURE.md)
- [Contract Specification](CONTRACT_SPEC.md)
- [UI/UX Specification](UI_UX_SPEC.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Testing Guide](TESTING.md)
- [Changelog](CHANGELOG.md)
""")

write(p("docs/ARCHITECTURE.md"), """\
# Architecture

See the full planning document in the project session for details.

## Stack
- **Contract**: Python on GenLayer (single IC, source of truth)
- **Frontend**: Next.js 15, TypeScript, TailwindCSS, Framer Motion, Zustand
- **Auth**: Wallet-based (RainbowKit / WalletConnect)
- **Deploy**: Vercel (frontend), StudioNet (contract)

## Data Flow
Frontend → genlayer-js → GenLayer RPC → Intelligent Contract

No backend. No intermediary.
""")

write(p("docs/CONTRACT_SPEC.md"), """\
# Contract Specification

File: `contracts/ReasonLayer.py`

## State
See contract source for full dataclass definitions.

## View Methods
- get_member(address)
- get_validator(address)
- get_trust_passport(address)
- get_evaluations(address, limit, offset)
- get_recommendations(address)
- get_validator_registry(limit, offset)
- get_endorsements(address)
- get_dispute(dispute_id)
- is_registered(address)
- get_stats()

## Write Methods (Deterministic)
- register_member(display_name, bio)
- register_validator(moniker, website)
- update_profile(display_name, bio)
- submit_endorsement(target)
- submit_dispute(target, reason, evidence_url)
- set_validator_uptime(address, score)  [admin]
- grant_role(address, role)             [owner]
- pause_contract()                      [owner]
- unpause_contract()                    [owner]

## AI Leader Functions
- request_trust_evaluation(address) -- Equivalence: run_nondet_unsafe, partial field match
- generate_recommendations(for_address) -- Equivalence: prompt_non_comparative
- resolve_dispute(dispute_id) -- Equivalence: prompt_comparative
""")

write(p("docs/DEPLOYMENT.md"), """\
# Deployment Guide

## Contract
```bash
genlayer deploy --network studionet contracts/ReasonLayer.py
```
Copy the deployed contract address. Set it as NEXT_PUBLIC_CONTRACT_ADDRESS.

## Frontend
1. Push to GitHub.
2. Connect to Vercel.
3. Set environment variables.
4. Deploy.
""")

write(p("docs/TESTING.md"), """\
# Testing Guide

## Contract Tests (direct mode)
```bash
pip install genlayer-test
pytest tests/contract/ -v
```

## Contract Tests (integration mode -- requires localnet)
```bash
genlayer up
pytest tests/contract/ -v --integration
```

## Frontend Type Check
```bash
cd frontend && npm run type-check
```
""")

write(p("docs/CHANGELOG.md"), """\
# Changelog

## [Unreleased]

### Added
- Project scaffold (Step 1)
- Intelligent Contract skeleton with full state schema, deterministic methods, and AI leader functions
- Frontend project structure: Next.js 15 + TailwindCSS + Zustand + RainbowKit
- genlayer-js client bindings
- Contract type definitions mirroring on-chain dataclasses
- All route pages (stub views, to be implemented Steps 9–14)
- Documentation stubs
""")

write(p("docs/UI_UX_SPEC.md"), """\
# UI/UX Specification

## Design Language
- Dark Mode: background #0B1120
- Premium, minimal, technical
- Data-first -- every screen surfaces contract data

## Pages
See the planning document for the full page map.

## Component Library
Implemented in Steps 5–8.
""")

write(p("docs/PRD.md"), """\
# Product Requirements Document

## Product
ReasonLayer -- AI-native Validator Intelligence Protocol

## Problem
Validator trust in decentralized networks is opaque. No standard on-chain mechanism exists for evaluating, scoring, and recommending validators using AI consensus.

## Solution
A GenLayer Intelligent Contract that runs AI evaluations in consensus, producing on-chain trust scores, evaluation history, and validator recommendations.

## Users
- Members: register, get evaluated, receive recommendations
- Validators: register, build reputation
- Admins: resolve disputes, set uptime scores

## Core Features
1. AI Trust Passport -- on-chain score computed by LLM consensus
2. Validator Registry -- browse active validators
3. Evaluation History -- full audit trail on-chain
4. Recommendation Engine -- AI recommends validators for each member
5. Dispute Resolution -- AI arbitrates disputes via prompt_comparative

## Success Metrics
- Members registered
- Trust evaluations finalized
- Recommendations generated
- Disputes resolved
""")

print("\n✓ ReasonLayer project scaffold complete.")
print(f"\nProject root: {ROOT}")
print("\nNext step:")
print("  cd frontend && npm install")
print("  Then verify the contract loads in GenLayer Studio.")



