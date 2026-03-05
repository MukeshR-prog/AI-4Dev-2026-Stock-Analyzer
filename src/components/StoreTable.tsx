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

const riskConfig: Record<ExpiryRisk, {
  variant: "danger" | "warning" | "success";
  dotColor: string;
}> = {
  High: { variant: "danger", dotColor: "bg-destructive" },
  Medium: { variant: "warning", dotColor: "bg-chart-4" },
  Low: { variant: "success", dotColor: "bg-primary" },
};

interface Props {
  data: InventoryItem[];
}

export default function StoreTable({ data }: Props) {
  const maxStock = Math.max(...data.map((d) => d.stock));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
    >
      <Card className="overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[200px]">Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Velocity</TableHead>
              <TableHead>Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => {
              const risk = calculateExpiryRisk(row);
              const config = riskConfig[risk];
              const stockPercent = Math.round((row.stock / maxStock) * 100);

              return (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.03 * i }}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{row.product}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {row.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 text-right font-mono text-sm tabular-nums">
                        {row.stock}
                      </span>
                      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stockPercent}%` }}
                          transition={{ duration: 0.5, delay: 0.03 * i + 0.15 }}
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
                      row.expiryDays <= 3 ? "font-medium text-destructive" : "text-muted-foreground",
                    )}>
                      {row.expiryDays}d
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm tabular-nums text-muted-foreground">
                      {row.salesPerDay}/day
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
