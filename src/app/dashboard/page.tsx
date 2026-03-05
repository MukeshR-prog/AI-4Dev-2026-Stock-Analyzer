"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center gap-4">
        {profile.photoURL ? (
          <Image
            src={profile.photoURL}
            alt=""
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
            {profile.name[0]?.toUpperCase() || "U"}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {profile.name.split(" ")[0]}!
          </h1>
          <p className="text-sm text-slate-500">
            {profile.company} — {profile.branch} — {profile.role.replace("_", " ")}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-5 sm:grid-cols-3">
        {[
          { label: "Products Near Expiry", value: "12", color: "text-red-600", bg: "bg-red-50", icon: "⚠️" },
          { label: "Active SKUs", value: "247", color: "text-emerald-600", bg: "bg-emerald-50", icon: "📦" },
          { label: "Transfer Suggestions", value: "3", color: "text-amber-600", bg: "bg-amber-50", icon: "🔄" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-center gap-2">
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg ${stat.bg}`}>
                {stat.icon}
              </span>
            </div>
            <p className={`mt-3 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Nav Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        {[
          {
            href: "/dashboard/my-store",
            title: "My Store",
            desc: "View your branch inventory and expiry risks",
            icon: "🏪",
          },
          {
            href: "/dashboard/branch-insights",
            title: "Branch Insights",
            desc: "Compare data across branches in your company",
            icon: "📊",
          },
          {
            href: "/dashboard/recommendations",
            title: "Recommendations",
            desc: "AI-powered suggestions to reduce waste",
            icon: "💡",
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-xl border border-slate-200 bg-white p-6 transition-all hover:shadow-md hover:border-emerald-200"
          >
            <span className="text-2xl">{card.icon}</span>
            <h3 className="mt-3 font-semibold text-slate-900 group-hover:text-emerald-700">
              {card.title}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
