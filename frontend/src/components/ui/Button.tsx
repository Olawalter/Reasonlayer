"use client";

import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ai-cyan/40 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:   "bg-ai-cyan text-background hover:bg-ai-cyan/90",
    secondary: "bg-card border border-white/10 text-primary-text hover:bg-white/5",
    ghost:     "text-secondary-text hover:text-primary-text hover:bg-card",
    danger:    "bg-danger/10 border border-danger/20 text-danger hover:bg-danger/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}
