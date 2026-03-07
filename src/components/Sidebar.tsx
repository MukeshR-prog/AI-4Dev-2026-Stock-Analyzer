"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Store,
  Building2,
  Lightbulb,
  BarChart3,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Package,
  Bell,
  BrainCircuit,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  children?: NavItem[];
}

const mainNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/dashboard/my-store",
    label: "My Store",
    icon: Store,
    children: [
      { href: "/dashboard/my-store", label: "Overview", icon: LayoutGrid },
      { href: "/dashboard/my-store/inventory", label: "Inventory", icon: Package },
      { href: "/dashboard/my-store/alerts", label: "Alerts", icon: Bell },
      { href: "/dashboard/my-store/insights", label: "AI Insights", icon: BrainCircuit },
    ],
  },
];

const analyticsNav: NavItem[] = [
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

interface NavLinkProps {
  link: NavItem;
  pathname: string;
  isChild?: boolean;
}

function NavLink({ link, pathname, isChild = false }: NavLinkProps) {
  const isActive = link.href === "/dashboard"
    ? pathname === "/dashboard"
    : link.href === "/dashboard/my-store"
      ? pathname === "/dashboard/my-store"
      : pathname.startsWith(link.href);
  const Icon = link.icon;

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isChild && "pl-10 text-[13px]",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className={cn("h-4 w-4", isChild && "h-3.5 w-3.5")} />
      {link.label}
    </Link>
  );
}

interface CollapsibleNavProps {
  link: NavItem;
  pathname: string;
}

function CollapsibleNav({ link, pathname }: CollapsibleNavProps) {
  const isParentActive = pathname.startsWith(link.href);
  const [isOpen, setIsOpen] = useState(isParentActive);
  const Icon = link.icon;

  return (
    <div className="space-y-0.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isParentActive
            ? "bg-sidebar-accent/50 text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
        )}
      >
        <span className="flex items-center gap-3">
          <Icon className="h-4 w-4" />
          {link.label}
        </span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      
      {isOpen && link.children && (
        <div className="ml-2 space-y-0.5 border-l border-sidebar-border pl-2">
          {link.children.map((child) => (
            <NavLink key={child.href} link={child} pathname={pathname} isChild />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  const renderNavItem = (link: NavItem) => {
    if (link.children) {
      return <CollapsibleNav key={link.href} link={link} pathname={pathname} />;
    }
    return <NavLink key={link.href} link={link} pathname={pathname} />;
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
          {mainNav.map(renderNavItem)}
        </div>

        <SectionLabel>Analytics</SectionLabel>
        <div className="space-y-0.5">
          {analyticsNav.map(renderNavItem)}
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
