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
