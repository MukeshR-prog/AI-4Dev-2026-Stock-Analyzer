"use client";

import type { Insight } from "@/lib/insightEngine";
import { AlertTriangle, TrendingUp, ArrowRightLeft } from "lucide-react";

const typeConfig: Record<
  Insight["type"],
  {
    icon: typeof AlertTriangle;
    iconColor: string;
    iconBg: string;
    accentBorder: string;
    label: string;
    labelColor: string;
    labelBg: string;
  }
> = {
  "expiry-risk": {
    icon: AlertTriangle,
    iconColor: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-50 dark:bg-red-950/40",
    accentBorder: "border-l-red-500",
    label: "Expiry Risk",
    labelColor: "text-red-700 dark:text-red-300",
    labelBg: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800",
  },
  "demand-difference": {
    icon: TrendingUp,
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    accentBorder: "border-l-amber-400",
    label: "Demand Insight",
    labelColor: "text-amber-700 dark:text-amber-300",
    labelBg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
  },
  redistribution: {
    icon: ArrowRightLeft,
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-50 dark:bg-blue-950/40",
    accentBorder: "border-l-blue-500",
    label: "Redistribution",
    labelColor: "text-blue-700 dark:text-blue-300",
    labelBg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
  },
};

interface Props {
  insight: Insight;
}

export default function InsightCard({ insight }: Props) {
  const cfg = typeConfig[insight.type];
  const Icon = cfg.icon;

  return (
    <div
      className={`rounded-xl border border-border border-l-4 ${cfg.accentBorder} bg-card p-5 transition-shadow hover:shadow-md`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cfg.iconBg}`}
          >
            <Icon className={`h-4.5 w-4.5 ${cfg.iconColor}`} />
          </span>
          <h4 className="text-sm font-semibold text-foreground leading-tight">
            {insight.title}
          </h4>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.labelBg} ${cfg.labelColor}`}
        >
          {cfg.label}
        </span>
      </div>

      {/* Bullet points */}
      <ul className="space-y-1.5 mb-4">
        {insight.bullets.map((bullet, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
            {bullet}
          </li>
        ))}
      </ul>

      {/* Conclusion */}
      <div className="rounded-lg bg-muted/50 border border-border px-4 py-3">
        <p className="text-sm font-medium text-foreground leading-relaxed">
          {insight.conclusion}
        </p>
      </div>

      {/* Severity */}
      <div className="mt-3 flex justify-end">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            insight.severity === "high"
              ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
              : insight.severity === "medium"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                : "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
          }`}
        >
          {insight.severity} severity
        </span>
      </div>
    </div>
  );
}
