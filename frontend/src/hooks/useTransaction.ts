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
