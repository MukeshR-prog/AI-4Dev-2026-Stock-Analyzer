"use client";

import { ListChecks, AlertTriangle, TrendingDown } from "lucide-react";

interface Props {
  total: number;
  highPriority: number;
  wasteReduction: number;
}

export default function RecommendationSummary({ total, highPriority, wasteReduction }: Props) {
  const cards = [
    {
      label: "Total Recommendations",
      value: total,
      icon: ListChecks,
      iconBg: "bg-muted",
      iconColor: "text-foreground",
      valueColor: "text-foreground",
    },
    {
      label: "High Priority Actions",
      value: highPriority,
      icon: AlertTriangle,
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
      valueColor: "text-destructive",
    },
    {
      label: "Potential Waste Reduction",
      value: `${wasteReduction} units`,
      icon: TrendingDown,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      valueColor: "text-primary",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-2xs transition-shadow hover:shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconBg}`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </span>
            </div>
            <p className={`mt-3 text-3xl font-bold ${card.valueColor}`}>{card.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}
