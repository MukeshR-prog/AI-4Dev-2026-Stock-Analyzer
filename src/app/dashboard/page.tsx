"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  Package,
  ArrowLeftRight,
  Store,
  BarChart3,
  Lightbulb,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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
            className="rounded-full ring-2 ring-border"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-lg font-bold text-background">
            {profile.name[0]?.toUpperCase() || "U"}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {profile.name.split(" ")[0]}!
          </h1>
          <p className="text-sm text-muted-foreground">
            {profile.company} &middot; {profile.branch} &middot;{" "}
            {profile.role.replace("_", " ")}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Products Near Expiry",
            value: "12",
            icon: AlertTriangle,
            trend: { value: "+3", direction: "up" as const },
            description: "from last week",
          },
          {
            label: "Active SKUs",
            value: "247",
            icon: Package,
            trend: { value: "+12", direction: "up" as const },
            description: "this month",
          },
          {
            label: "Transfer Suggestions",
            value: "3",
            icon: ArrowLeftRight,
            trend: { value: "-1", direction: "down" as const },
            description: "pending actions",
          },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-2xs hover:shadow-xs transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-foreground">
                {stat.value}
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                {stat.trend.direction === "up" ? (
                  <TrendingUp className="h-3 w-3 text-primary" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span
                  className={
                    stat.trend.direction === "up"
                      ? "font-medium text-primary"
                      : "font-medium text-destructive"
                  }
                >
                  {stat.trend.value}
                </span>
                <span className="text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Nav Cards */}
      <div>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
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
            <Link key={card.href} href={card.href}>
              <Card className="group h-full shadow-2xs transition-all hover:shadow-sm hover:border-primary/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <card.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {card.desc}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
