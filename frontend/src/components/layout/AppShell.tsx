"use client";

import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { useUIStore } from "@/store/ui";
import { TxStatusBanner } from "@/components/transaction/TxStatusBanner";
import { cn } from "@/lib/utils/cn";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-200",
            "lg:ml-64",
            sidebarOpen ? "ml-64" : "ml-0"
          )}
        >
          <TxStatusBanner />
          <div className="p-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
