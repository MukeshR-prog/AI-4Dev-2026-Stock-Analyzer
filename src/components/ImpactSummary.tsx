"use client";

import type { RecommendationEffect } from "@/lib/wasteSimulation";
import { ArrowRightLeft, Percent, Heart, CheckCircle2 } from "lucide-react";

const typeConfig: Record<
  RecommendationEffect["type"],
  { icon: typeof ArrowRightLeft; bg: string; text: string; border: string; label: string }
> = {
  transfer: {
    icon: ArrowRightLeft,
    bg: "bg-chart-2/10",
    text: "text-chart-2",
    border: "border-chart-2/20",
    label: "Transfer",
  },
  discount: {
    icon: Percent,
    bg: "bg-chart-4/10",
    text: "text-chart-4",
    border: "border-chart-4/20",
    label: "Discount",
  },
  donation: {
    icon: Heart,
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
    label: "Donation",
  },
};

interface Props {
  effects: RecommendationEffect[];
}

export default function ImpactSummary({ effects }: Props) {
  if (effects.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs">
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
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card`}
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

              <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-card px-3 py-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-primary">
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
