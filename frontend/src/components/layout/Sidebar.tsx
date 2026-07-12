"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, User, Shield, Fingerprint,
  Clock, Sparkles, Settings
} from "lucide-react";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/dashboard",       label: "Dashboard",       icon: LayoutDashboard },
  { href: "/evidence",        label: "Submit Evidence", icon: Fingerprint },
  { href: "/evaluate",        label: "Evaluation",      icon: Clock },
  { href: "/validators",      label: "Validators",      icon: Shield },
  { href: "/recommendations", label: "Recommendations", icon: Sparkles },
  { href: "/profile",         label: "My Profile",      icon: User },
  { href: "/settings",        label: "Settings",        icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen } = useUIStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 bg-surface border-r border-white/5",
        "flex flex-col py-4 z-30 transition-transform duration-200",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}
    >
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active
                  ? "bg-primary-blue/10 text-primary-blue font-medium"
                  : "text-secondary-text hover:text-primary-text hover:bg-card"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 pb-2">
        <p className="text-xs text-secondary-text/50 font-mono">
          ReasonLayer v0.1
        </p>
      </div>
    </aside>
  );
}
