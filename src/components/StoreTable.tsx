"use client";

import type { InventoryItem, ExpiryRisk } from "@/data/inventory";
import { calculateExpiryRisk } from "@/data/inventory";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  ArrowUpRight,
  Timer,
  Hash,
} from "lucide-react";

const riskConfig: Record<ExpiryRisk, {
  variant: "danger" | "warning" | "success";
  icon: React.ElementType;
  dotColor: string;
}> = {
  High: { variant: "danger", icon: ShieldAlert, dotColor: "bg-destructive" },
  Medium: { variant: "warning", icon: AlertTriangle, dotColor: "bg-chart-4" },
  Low: { variant: "success", icon: ShieldCheck, dotColor: "bg-primary" },
};

interface Props {
  data: InventoryItem[];
}

export default function StoreTable({ data }: Props) {
  const maxStock = Math.max(...data.map((d) => d.stock));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="overflow-hidden border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[200px] text-xs font-semibold uppercase tracking-wider">
                Product
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                Category
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Hash className="h-3 w-3" />
                  Stock
                </span>
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Timer className="h-3 w-3" />
                  Expiry
                </span>
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <ArrowUpRight className="h-3 w-3" />
                  Velocity
                </span>
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                Risk
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => {
              const risk = calculateExpiryRisk(row);
              const config = riskConfig[risk];
              const RiskIcon = config.icon;
              const stockPercent = Math.round((row.stock / maxStock) * 100);

              return (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: 0.04 * i }}
                  className={cn(
                    "border-b transition-colors hover:bg-muted/30",
                    risk === "High" && "bg-destructive/10"
                  )}
                >
                  <TableCell className="font-medium text-foreground">
                    {row.product}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-md font-normal">
                      {row.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="w-8 text-right font-mono text-sm tabular-nums text-foreground">
                        {row.stock}
                      </span>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stockPercent}%` }}
                          transition={{ duration: 0.6, delay: 0.04 * i + 0.2 }}
                          className={cn(
                            "h-full rounded-full",
                            stockPercent > 60 ? "bg-primary" : stockPercent > 30 ? "bg-chart-4" : "bg-destructive",
                          )}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "font-mono text-sm tabular-nums",
                      row.expiryDays <= 3 ? "font-semibold text-destructive" : "text-muted-foreground",
                    )}>
                      {row.expiryDays}d
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm tabular-nums text-muted-foreground">
                      {row.salesPerDay}
                      <span className="text-xs text-muted-foreground/60">/day</span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={config.variant} className="gap-1 rounded-full">
                      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)} />
                      {risk}
                    </Badge>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </motion.div>
  );
}
