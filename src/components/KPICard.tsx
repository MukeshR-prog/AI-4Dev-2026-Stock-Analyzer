"use client";

import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "default" | "red" | "amber" | "emerald";
  index?: number;
}

const accentStyles = {
  default: {
    card: "border-slate-200/60 bg-white",
    iconBg: "bg-slate-100 text-slate-600",
    title: "text-slate-500",
    value: "text-slate-900",
    glow: "",
  },
  red: {
    card: "border-red-200/60 bg-gradient-to-br from-red-50 to-white",
    iconBg: "bg-red-100 text-red-600",
    title: "text-red-500",
    value: "text-red-700",
    glow: "shadow-red-100/50",
  },
  amber: {
    card: "border-amber-200/60 bg-gradient-to-br from-amber-50 to-white",
    iconBg: "bg-amber-100 text-amber-600",
    title: "text-amber-500",
    value: "text-amber-700",
    glow: "shadow-amber-100/50",
  },
  emerald: {
    card: "border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white",
    iconBg: "bg-emerald-100 text-emerald-600",
    title: "text-emerald-500",
    value: "text-emerald-700",
    glow: "shadow-emerald-100/50",
  },
} as const;

export default function KPICard({ title, value, icon: Icon, accent = "default", index = 0 }: KPICardProps) {
  const styles = accentStyles[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -2, scale: 1.02 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg",
        styles.card,
        styles.glow,
      )}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/60 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative flex items-center justify-between">
        <p className={cn("text-sm font-medium tracking-wide uppercase", styles.title)}>{title}</p>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", styles.iconBg)}>
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring" }}
        className={cn("relative mt-3 text-3xl font-bold tracking-tight", styles.value)}
      >
        {value}
      </motion.p>
    </motion.div>
  );
}
