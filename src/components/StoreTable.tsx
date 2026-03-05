"use client";

import type { InventoryItem, ExpiryRisk } from "@/data/inventory";
import { calculateExpiryRisk } from "@/data/inventory";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Package,
} from "lucide-react";

const riskConfig: Record<ExpiryRisk, { bg: string; text: string; dot: string; icon: React.ElementType }> = {
  High: {
    bg: "bg-red-50 border-red-200/60",
    text: "text-red-700",
    dot: "bg-red-500",
    icon: ShieldAlert,
  },
  Medium: {
    bg: "bg-amber-50 border-amber-200/60",
    text: "text-amber-700",
    dot: "bg-amber-500",
    icon: AlertTriangle,
  },
  Low: {
    bg: "bg-emerald-50 border-emerald-200/60",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    icon: ShieldCheck,
  },
};

interface Props {
  data: InventoryItem[];
}

export default function StoreTable({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span className="flex items-center gap-2">
                  <Package className="h-3.5 w-3.5" />
                  Product
                </span>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Category
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Stock
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Expiry Days
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span className="flex items-center justify-end gap-2">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Daily Sales
                </span>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Expiry Risk
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, i) => {
              const risk = calculateExpiryRisk(row);
              const config = riskConfig[risk];
              const RiskIcon = config.icon;

              return (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * i }}
                  className="group transition-colors hover:bg-slate-50/80"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">{row.product}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {row.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-700">{row.stock}</td>
                  <td className="px-6 py-4 text-right font-mono text-slate-700">{row.expiryDays}d</td>
                  <td className="px-6 py-4 text-right font-mono text-slate-700">{row.salesPerDay}/day</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                        config.bg,
                        config.text,
                      )}
                    >
                      <RiskIcon className="h-3 w-3" />
                      {risk}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
