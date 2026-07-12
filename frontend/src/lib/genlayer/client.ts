"use client";

import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import type { Address } from "viem";

// Singleton read client — no account needed for view calls.
let _readClient: ReturnType<typeof createClient> | null = null;

export function getReadClient() {
  if (!_readClient) {
    _readClient = createClient({ chain: studionet });
  }
  return _readClient;
}

// Write client — pass the connected wallet address as a string.
// genlayer-js detects a string address (isAddress=true) and routes
// eth_sendTransaction through window.ethereum (MetaMask), not the RPC.
export function createWriteClient(address: Address) {
  return createClient({ chain: studionet, account: address });
}

export const CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "") as `0x${string}`;
