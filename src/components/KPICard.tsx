"use client";

import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
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

export default function KPICard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  accent = "default",
  index = 0,
}: KPICardProps) {
  const TrendIcon = trend
    ? trend.direction === "up"
      ? TrendingUp
      : trend.direction === "down"
        ? TrendingDown
        : Minus
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card className="bg-card shadow-2xs hover:shadow-xs transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </div>
          {(trend || description) && (
            <div className="mt-1 flex items-center gap-1">
              {trend && TrendIcon && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-xs font-medium",
                    trend.direction === "up" && "text-primary",
                    trend.direction === "down" && "text-destructive",
                    trend.direction === "neutral" && "text-muted-foreground",
                  )}
                >
                  <TrendIcon className="h-3 w-3" />
                  {trend.value}
                </span>
              )}
              {description && (
                <span className="text-xs text-muted-foreground">
                  {trend ? " " : ""}{description}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
