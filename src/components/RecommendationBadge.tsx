"use client";

import type { RecommendationType } from "@/lib/recommendationEngine";
import { ArrowRightLeft, Percent, Heart } from "lucide-react";

const config: Record<
  RecommendationType,
  { label: string; bg: string; text: string; border: string; icon: typeof ArrowRightLeft }
> = {
  transfer: {
    label: "Transfer Inventory",
    bg: "bg-chart-2/10",
    text: "text-chart-2",
    border: "border-chart-2/20",
    icon: ArrowRightLeft,
  },
  discount: {
    label: "Apply Discount",
    bg: "bg-chart-4/10",
    text: "text-chart-4",
    border: "border-chart-4/20",
    icon: Percent,
  },
  donation: {
    label: "Donate Surplus",
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
    icon: Heart,
  },
};

interface Props {
  type: RecommendationType;
}

export default function RecommendationBadge({ type }: Props) {
  const c = config[type];
  const Icon = c.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${c.bg} ${c.text} ${c.border}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {c.label}
    </span>
  );
}
