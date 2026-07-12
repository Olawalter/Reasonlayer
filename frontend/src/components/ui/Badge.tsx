"use client";

import { cn } from "@/lib/utils/cn";
import type { TrustTier } from "@/lib/genlayer/types";
import { TIER_COLORS } from "@/lib/genlayer/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "cyan" | "info" | "tier";
  tier?: TrustTier;
  className?: string;
}

export function Badge({ children, variant = "default", tier, className }: BadgeProps) {
  const base = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";
  const variants = {
    default:   "bg-card text-secondary-text",
    secondary: "bg-white/5 text-secondary-text",
    success:   "bg-success/10 text-success",
    warning:   "bg-warning/10 text-warning",
    danger:    "bg-danger/10 text-danger",
    cyan:      "bg-ai-cyan/10 text-ai-cyan",
    info:      "bg-blue-500/10 text-blue-400",
  };

  if (variant === "tier" && tier !== undefined) {
    return (
      <span
        className={cn(base, className)}
        style={{ color: TIER_COLORS[tier], background: `${TIER_COLORS[tier]}18` }}
      >
        {children}
      </span>
    );
  }

  return <span className={cn(base, variants[variant as keyof typeof variants], className)}>{children}</span>;
}
