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
