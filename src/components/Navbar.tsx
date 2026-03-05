"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Store, BarChart3, Lightbulb } from "lucide-react";

const navLinks = [
  { href: "/dashboard/my-store", label: "My Store", icon: Store },
  { href: "/dashboard/branch-insights", label: "Branch Insights", icon: BarChart3 },
  { href: "/dashboard/recommendations", label: "Recommendations", icon: Lightbulb },
];

export default function Navbar() {
  const pathname = usePathname();
  const { profile, logout } = useAuth();

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            RI
          </div>
          <span className="font-heading text-lg font-semibold text-foreground hidden sm:inline">
            Retail Intelligence
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          {profile && (
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <div className="text-right">
                <p className="font-medium text-foreground leading-tight">{profile.name}</p>
                <p className="text-xs text-muted-foreground">{profile.company} — {profile.branch}</p>
              </div>
              {profile.photoURL ? (
                <Image
                  src={profile.photoURL}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {profile.name[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          )}
          <button
            onClick={logout}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
