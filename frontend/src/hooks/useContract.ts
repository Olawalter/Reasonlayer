"use client";

import { useAccount } from "wagmi";
import { createWriteClient, CONTRACT_ADDRESS } from "@/lib/genlayer/client";
import { useUIStore } from "@/store/ui";
import { TransactionStatus } from "genlayer-js/types";
import { useMemo } from "react";

const STUDIONET_CHAIN_ID = 61999;
const STUDIONET_HEX = "0xF22F"; // 61999 in hex

async function ensureStudioNet() {
  const ethereum = (window as { ethereum?: { request: (a: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum;
  if (!ethereum) return;
  const chainId = await ethereum.request({ method: "eth_chainId" }) as string;
  if (parseInt(chainId, 16) === STUDIONET_CHAIN_ID) return;
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: STUDIONET_HEX }],
    });
  } catch (err: unknown) {
    // 4902 = chain not added yet
    if ((err as { code?: number })?.code === 4902) {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: STUDIONET_HEX,
          chainName: "Genlayer Studio Network",
          nativeCurrency: { name: "GEN Token", symbol: "GEN", decimals: 18 },
          rpcUrls: ["https://studio.genlayer.com/api"],
          blockExplorerUrls: ["https://genlayer-explorer.vercel.app"],
        }],
      });
    } else {
      throw err;
    }
  }
}

export function useContractWrite() {
  const { address } = useAccount();
  const { setPendingTx } = useUIStore();

  const client = useMemo(() => {
    if (!address) return null;
    return createWriteClient(address);
  }, [address]);

  async function write(method: string, args: unknown[]) {
    if (!client) throw new Error("Wallet not connected");
    await ensureStudioNet();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hash: any = await client.writeContract({
      address: CONTRACT_ADDRESS,
      functionName: method,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      args: args as any,
      value: BigInt(0),
    });

    setPendingTx({ hash: String(hash), status: "pending", method });

    try {
      const receipt = await client.waitForTransactionReceipt({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hash: hash as any,
        status: TransactionStatus.FINALIZED,
        retries: 80,
        interval: 4000,
      });
      setPendingTx(null);
      return receipt;
    } catch (err: unknown) {
      setPendingTx(null);
      // Extract a readable message from the GenLayer/viem error
      const msg =
        (err as { details?: string })?.details ??
        (err as { shortMessage?: string })?.shortMessage ??
        (err as Error)?.message ??
        "Transaction failed";
      throw new Error(msg);
    }
  }

  return { write, isReady: !!client };
}
