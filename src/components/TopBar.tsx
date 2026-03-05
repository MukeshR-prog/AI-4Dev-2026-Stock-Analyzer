"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut, ChevronRight, Home } from "lucide-react";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/my-store": "My Store",
  "/dashboard/branch-insights": "Branch Insights",
  "/dashboard/recommendations": "Recommendations",
  "/dashboard/impact": "Waste Impact",
};

export default function TopBar() {
  const { profile, logout } = useAuth();
  const pathname = usePathname();

  if (!profile) return null;

  const crumbs: { label: string; href?: string }[] = [{ label: "Home", href: "/dashboard" }];
  if (pathname !== "/dashboard") {
    const label = breadcrumbMap[pathname] ?? pathname.split("/").pop() ?? "";
    crumbs.push({ label });
  }

  return (
    <header className="fixed left-64 right-0 top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />}
            {crumb.href && i < crumbs.length - 1 ? (
              <Link
                href={crumb.href}
                className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                {i === 0 && <Home className="h-3.5 w-3.5" />}
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* User info */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-foreground leading-tight">
            {profile.name}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {profile.company} &middot; {profile.branch}
          </p>
        </div>

        {profile.photoURL ? (
          <Image
            src={profile.photoURL}
            alt=""
            width={32}
            height={32}
            className="rounded-full ring-2 ring-border"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
            {profile.name[0]?.toUpperCase() || "U"}
          </div>
        )}

        <button
          onClick={logout}
          className="ml-1 flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </header>
  );
}
