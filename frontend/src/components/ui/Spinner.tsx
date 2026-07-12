import { cn } from "@/lib/utils/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-ai-cyan animate-spin" />
    </div>
  );
}

export function InlineSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("w-4 h-4 rounded-full border-2 border-white/10 border-t-ai-cyan animate-spin", className)} />
  );
}
