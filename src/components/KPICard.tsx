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
    iconWrapper: "bg-muted ring-1 ring-border/70",
    iconColor: "text-muted-foreground",
    valueTxt: "text-foreground",
    trendColor: "text-muted-foreground",
  },
  red: {
    iconWrapper: "bg-destructive/10 ring-1 ring-destructive/20",
    iconColor: "text-destructive",
    valueTxt: "text-destructive",
    trendColor: "text-destructive",
  },
  amber: {
    iconWrapper: "bg-chart-4/10 ring-1 ring-chart-4/20",
    iconColor: "text-chart-4",
    valueTxt: "text-chart-4",
    trendColor: "text-chart-4",
  },
  emerald: {
    iconWrapper: "bg-primary/10 ring-1 ring-primary/20",
    iconColor: "text-primary",
    valueTxt: "text-primary",
    trendColor: "text-primary",
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
            accent === "red" && "bg-destructive",
            accent === "amber" && "bg-chart-4",
            accent === "emerald" && "bg-primary",
            accent === "default" && "bg-border",
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
                          trend.direction === "up" && "text-primary",
                          trend.direction === "down" && "text-destructive",
                          trend.direction === "neutral" && "text-muted-foreground",
                        )}
                      />
                    );
                  })()}
                  <span
                    className={cn(
                      "text-xs font-medium",
                      trend.direction === "up" && "text-primary",
                      trend.direction === "down" && "text-destructive",
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
