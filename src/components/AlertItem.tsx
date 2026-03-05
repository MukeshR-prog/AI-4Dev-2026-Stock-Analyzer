"use client";

import type { SmartAlert } from "@/lib/alertEngine";
import {
  AlertTriangle,
  PackageOpen,
  ArrowRightLeft,
  Zap,
} from "lucide-react";

const typeConfig: Record<
  SmartAlert["type"],
  {
    icon: typeof AlertTriangle;
    iconColor: string;
    iconBg: string;
    borderColor: string;
    label: string;
    labelColor: string;
    labelBg: string;
  }
> = {
  "expiry-risk": {
    icon: AlertTriangle,
    iconColor: "text-destructive",
    iconBg: "bg-destructive/10",
    borderColor: "",
    label: "Expiry Risk",
    labelColor: "text-destructive",
    labelBg: "bg-destructive/10 border-destructive/20",
  },
  "surplus-inventory": {
    icon: PackageOpen,
    iconColor: "text-chart-4",
    iconBg: "bg-chart-4/10",
    borderColor: "",
    label: "Surplus",
    labelColor: "text-chart-4",
    labelBg: "bg-chart-4/10 border-chart-4/20",
  },
  "demand-mismatch": {
    icon: ArrowRightLeft,
    iconColor: "text-chart-2",
    iconBg: "bg-chart-2/10",
    borderColor: "",
    label: "Redistribution",
    labelColor: "text-chart-2",
    labelBg: "bg-chart-2/10 border-chart-2/20",
  },
  recommendation: {
    icon: Zap,
    iconColor: "text-chart-3",
    iconBg: "bg-chart-3/10",
    borderColor: "",
    label: "Action Needed",
    labelColor: "text-chart-3",
    labelBg: "bg-chart-3/10 border-chart-3/20",
  },
};

const priorityConfig: Record<
  SmartAlert["priority"],
  { dot: string; text: string; bg: string }
> = {
  high: {
    dot: "bg-destructive",
    text: "text-destructive",
    bg: "bg-destructive/10",
  },
  medium: {
    dot: "bg-chart-4",
    text: "text-chart-4",
    bg: "bg-chart-4/10",
  },
  low: {
    dot: "bg-chart-2",
    text: "text-chart-2",
    bg: "bg-chart-2/10",
  },
};

interface Props {
  alert: SmartAlert;
}

export default function AlertItem({ alert }: Props) {
  const cfg = typeConfig[alert.type];
  const pri = priorityConfig[alert.priority];
  const Icon = cfg.icon;

  return (
    <div
      className={`rounded-2xl border border-border bg-card p-5 shadow-2xs transition-shadow hover:shadow-xs ${cfg.borderColor}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cfg.iconBg}`}
        >
          <Icon className={`h-4.5 w-4.5 ${cfg.iconColor}`} />
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-foreground">
              {alert.title}
            </h4>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${cfg.labelBg} ${cfg.labelColor}`}
            >
              {cfg.label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {alert.message}
          </p>
        </div>

        {/* Right side: metric + priority */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          {alert.metric && (
            <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-bold text-foreground">
              {alert.metric}
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${pri.bg} ${pri.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${pri.dot}`} />
            {alert.priority}
          </span>
        </div>
      </div>
    </div>
  );
}
