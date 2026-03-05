"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Building2,
  Lightbulb,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/my-store", label: "My Store", icon: Store },
];

const analyticsNav = [
  { href: "/dashboard/branch-insights", label: "Branch Insights", icon: Building2 },
  { href: "/dashboard/recommendations", label: "Recommendations", icon: Lightbulb },
  { href: "/dashboard/impact", label: "Waste Impact", icon: BarChart3 },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 px-3 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
      {children}
    </p>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  const renderLink = (link: (typeof mainNav)[0]) => {
    const isActive =
      link.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(link.href);
    const Icon = link.icon;

    return (
      <Link
        key={link.href}
        href={link.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
        )}
      >
        <Icon className="h-4 w-4" />
        {link.label}
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Brand */}
      <div className="flex h-14 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
          <Sparkles className="h-4 w-4 text-background" />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Retail Intelligence
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <SectionLabel>Overview</SectionLabel>
        <div className="space-y-0.5">
          {mainNav.map(renderLink)}
        </div>

        <SectionLabel>Analytics</SectionLabel>
        <div className="space-y-0.5">
          {analyticsNav.map(renderLink)}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-5 py-4">
        <p className="text-[11px] text-muted-foreground">
          &copy; 2025 Retail Intelligence
        </p>
      </div>
    </aside>
  );
}
