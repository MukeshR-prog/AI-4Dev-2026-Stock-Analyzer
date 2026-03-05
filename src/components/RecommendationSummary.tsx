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
      iconBg: "bg-blue-50 dark:bg-blue-950/40",
      iconColor: "text-blue-600 dark:text-blue-400",
      valueColor: "text-foreground",
    },
    {
      label: "High Priority Actions",
      value: highPriority,
      icon: AlertTriangle,
      iconBg: "bg-red-50 dark:bg-red-950/40",
      iconColor: "text-red-600 dark:text-red-400",
      valueColor: "text-red-600 dark:text-red-400",
    },
    {
      label: "Potential Waste Reduction",
      value: `${wasteReduction} units`,
      icon: TrendingDown,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      valueColor: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm"
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
