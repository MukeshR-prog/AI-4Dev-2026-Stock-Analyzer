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
    iconColor: "text-destructive",
    iconBg: "bg-destructive/10",
    accentBorder: "",
    label: "Expiry Risk",
    labelColor: "text-destructive",
    labelBg: "bg-destructive/10 border-destructive/20",
  },
  "demand-difference": {
    icon: TrendingUp,
    iconColor: "text-chart-4",
    iconBg: "bg-chart-4/10",
    accentBorder: "",
    label: "Demand Insight",
    labelColor: "text-chart-4",
    labelBg: "bg-chart-4/10 border-chart-4/20",
  },
  redistribution: {
    icon: ArrowRightLeft,
    iconColor: "text-chart-2",
    iconBg: "bg-chart-2/10",
    accentBorder: "",
    label: "Redistribution",
    labelColor: "text-chart-2",
    labelBg: "bg-chart-2/10 border-chart-2/20",
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
      className={`rounded-2xl border border-border bg-card p-6 shadow-2xs transition-shadow hover:shadow-xs ${cfg.accentBorder}`}
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
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cfg.labelBg} ${cfg.labelColor}`}
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
      <div className="rounded-xl bg-muted/50 border border-border px-4 py-3">
        <p className="text-sm font-medium text-foreground leading-relaxed">
          {insight.conclusion}
        </p>
      </div>

      {/* Severity */}
      <div className="mt-3 flex justify-end">
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
            insight.severity === "high"
              ? "bg-destructive/10 text-destructive"
              : insight.severity === "medium"
                ? "bg-chart-4/10 text-chart-4"
                : "bg-chart-2/10 text-chart-2"
          }`}
        >
          {insight.severity} severity
        </span>
      </div>
    </div>
  );
}
