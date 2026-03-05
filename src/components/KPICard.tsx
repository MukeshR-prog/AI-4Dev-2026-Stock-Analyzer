"use client";

import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: { value: string; direction: "up" | "down" | "neutral" };
  accent?: "default" | "red" | "amber" | "emerald";
  index?: number;
}

const accentMap = {
  default: {
    iconWrapper: "bg-slate-50 ring-1 ring-slate-200/70",
    iconColor: "text-slate-500",
    valueTxt: "text-foreground",
    trendColor: "text-muted-foreground",
  },
  red: {
    iconWrapper: "bg-red-50 ring-1 ring-red-200/70",
    iconColor: "text-red-500",
    valueTxt: "text-red-600",
    trendColor: "text-red-500",
  },
  amber: {
    iconWrapper: "bg-amber-50 ring-1 ring-amber-200/70",
    iconColor: "text-amber-500",
    valueTxt: "text-amber-600",
    trendColor: "text-amber-500",
  },
  emerald: {
    iconWrapper: "bg-emerald-50 ring-1 ring-emerald-200/70",
    iconColor: "text-emerald-500",
    valueTxt: "text-emerald-600",
    trendColor: "text-emerald-500",
  },
} as const;

const TrendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

export default function KPICard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  accent = "default",
  index = 0,
}: KPICardProps) {
  const a = accentMap[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-border hover:shadow-md">
        {/* Decorative accent bar */}
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-1 rounded-l-xl transition-all duration-300 group-hover:w-1.5",
            accent === "red" && "bg-red-400",
            accent === "amber" && "bg-amber-400",
            accent === "emerald" && "bg-emerald-400",
            accent === "default" && "bg-slate-300",
          )}
        />

        <div className="p-5 pl-6">
          {/* Top row: title + icon */}
          <div className="flex items-start justify-between">
            <span className="text-[13px] font-medium leading-none text-muted-foreground">
              {title}
            </span>
            <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", a.iconWrapper)}>
              <Icon className={cn("h-[18px] w-[18px]", a.iconColor)} strokeWidth={1.8} />
            </div>
          </div>

          {/* Value */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.08 + 0.15 }}
            className="mt-3"
          >
            <span className={cn("font-heading text-[28px] font-bold leading-none tracking-tight", a.valueTxt)}>
              {value}
            </span>
          </motion.div>

          {/* Bottom row: trend or description */}
          {(trend || description) && (
            <div className="mt-2.5 flex items-center gap-1.5">
              {trend && (
                <>
                  {(() => {
                    const TIcon = TrendIcon[trend.direction];
                    return (
                      <TIcon
                        className={cn(
                          "h-3.5 w-3.5",
                          trend.direction === "up" && "text-emerald-500",
                          trend.direction === "down" && "text-red-500",
                          trend.direction === "neutral" && "text-muted-foreground",
                        )}
                      />
                    );
                  })()}
                  <span
                    className={cn(
                      "text-xs font-medium",
                      trend.direction === "up" && "text-emerald-600",
                      trend.direction === "down" && "text-red-600",
                      trend.direction === "neutral" && "text-muted-foreground",
                    )}
                  >
                    {trend.value}
                  </span>
                </>
              )}
              {description && (
                <span className="text-xs text-muted-foreground">{description}</span>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
