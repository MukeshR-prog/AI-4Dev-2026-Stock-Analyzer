"use client";

import type { RecommendationType } from "@/lib/recommendationEngine";
import { ArrowRightLeft, Percent, Heart } from "lucide-react";

const config: Record<
  RecommendationType,
  { label: string; bg: string; text: string; border: string; icon: typeof ArrowRightLeft }
> = {
  transfer: {
    label: "Transfer Inventory",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    icon: ArrowRightLeft,
  },
  discount: {
    label: "Apply Discount",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    icon: Percent,
  },
  donation: {
    label: "Donate Surplus",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
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
