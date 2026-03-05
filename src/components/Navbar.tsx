"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/dashboard/my-store", label: "My Store", icon: "🏪" },
  { href: "/dashboard/branch-insights", label: "Branch Insights", icon: "📊" },
  { href: "/dashboard/recommendations", label: "Recommendations", icon: "💡" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { profile, logout } = useAuth();

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white text-sm font-bold">
            RI
          </div>
          <span className="text-lg font-semibold text-slate-900 hidden sm:inline">
            Retail Intelligence
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className="text-base">{link.icon}</span>
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
                <p className="font-medium text-slate-900 leading-tight">{profile.name}</p>
                <p className="text-xs text-slate-500">{profile.company} — {profile.branch}</p>
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  {profile.name[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          )}
          <button
            onClick={logout}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
