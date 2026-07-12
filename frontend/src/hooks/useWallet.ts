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
