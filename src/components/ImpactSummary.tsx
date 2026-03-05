"use client";

import type { RecommendationEffect } from "@/lib/wasteSimulation";
import { ArrowRightLeft, Percent, Heart, CheckCircle2 } from "lucide-react";

const typeConfig: Record<
  RecommendationEffect["type"],
  { icon: typeof ArrowRightLeft; bg: string; text: string; border: string; label: string }
> = {
  transfer: {
    icon: ArrowRightLeft,
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    label: "Transfer",
  },
  discount: {
    icon: Percent,
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    label: "Discount",
  },
  donation: {
    icon: Heart,
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    label: "Donation",
  },
};

interface Props {
  effects: RecommendationEffect[];
}

export default function ImpactSummary({ effects }: Props) {
  if (effects.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-1 text-base font-semibold text-foreground">
        Recommendation Effect Breakdown
      </h3>
      <p className="mb-5 text-sm text-muted-foreground">
        How each recommendation contributes to waste reduction
      </p>

      <div className="space-y-3">
        {effects.map((effect) => {
          const cfg = typeConfig[effect.type];
          const Icon = cfg.icon;

          return (
            <div
              key={effect.id}
              className={`flex items-start gap-4 rounded-xl border px-5 py-4 ${cfg.border} ${cfg.bg}`}
            >
              <span
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 dark:bg-white/10`}
              >
                <Icon className={`h-4.5 w-4.5 ${cfg.text}`} />
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {effect.product}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.border} ${cfg.text}`}
                  >
                    {cfg.label}
                  </span>
                </div>
                <p className="mt-1 text-sm text-foreground/80">{effect.action}</p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/60 dark:bg-white/10 px-3 py-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {effect.unitsSaved} units saved
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
