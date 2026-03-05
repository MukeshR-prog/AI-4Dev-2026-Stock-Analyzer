"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Package, ArrowLeftRight, Store, BarChart3, Lightbulb } from "lucide-react";

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
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
            {profile.name[0]?.toUpperCase() || "U"}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {profile.name.split(" ")[0]}!
          </h1>
          <p className="text-sm text-muted-foreground">
            {profile.company} — {profile.branch} — {profile.role.replace("_", " ")}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-5 sm:grid-cols-3">
        {[
          { label: "Products Near Expiry", value: "12", color: "text-destructive", bg: "bg-destructive/10", icon: AlertTriangle },
          { label: "Active SKUs", value: "247", color: "text-primary", bg: "bg-primary/10", icon: Package },
          { label: "Transfer Suggestions", value: "3", color: "text-chart-4", bg: "bg-chart-4/10", icon: ArrowLeftRight },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-2">
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </span>
            </div>
            <p className={`mt-3 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
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
            icon: Store,
          },
          {
            href: "/dashboard/branch-insights",
            title: "Branch Insights",
            desc: "Compare data across branches in your company",
            icon: BarChart3,
          },
          {
            href: "/dashboard/recommendations",
            title: "Recommendations",
            desc: "AI-powered suggestions to reduce waste",
            icon: Lightbulb,
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md hover:border-primary/30"
          >
            <card.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            <h3 className="mt-3 font-semibold text-foreground group-hover:text-primary transition-colors">
              {card.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
