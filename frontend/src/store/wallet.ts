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
