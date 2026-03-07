"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import StoreTable from "@/components/StoreTable";
import KPICard from "@/components/KPICard";
import { mockInventory, calculateExpiryRisk } from "@/data/inventory";
import { motion } from "framer-motion";
import { Package, Clock, ShieldAlert, Boxes, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
  const { profile } = useAuth();

  // Calculate category breakdown - must be before any early returns
  const categoryBreakdown = useMemo(() => {
    const categories: Record<string, { count: number; stock: number; highRisk: number }> = {};
    mockInventory.forEach((item) => {
      if (!categories[item.category]) {
        categories[item.category] = { count: 0, stock: 0, highRisk: 0 };
      }
      categories[item.category].count += 1;
      categories[item.category].stock += item.stock;
      if (calculateExpiryRisk(item) === "High") {
        categories[item.category].highRisk += 1;
      }
    });
    return categories;
  }, []);

  if (!profile) return null;

  const totalProducts = mockInventory.length;
  const totalStock = mockInventory.reduce((sum, p) => sum + p.stock, 0);
  const nearExpiryCount = mockInventory.filter((p) => p.expiryDays <= 5).length;
  const highRiskCount = mockInventory.filter(
    (p) => calculateExpiryRisk(p) === "High",
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/dashboard/my-store"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Store
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Inventory Management
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile.company} &middot; {profile.branch} &mdash; Full inventory details with search and pagination
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          description="Tracked in inventory"
          index={0}
        />
        <KPICard
          title="Near Expiry"
          value={nearExpiryCount}
          icon={Clock}
          description="Expiring within 5 days"
          trend={{
            value: `${Math.round((nearExpiryCount / totalProducts) * 100)}%`,
            direction: nearExpiryCount > 4 ? "up" : "neutral",
          }}
          index={1}
        />
        <KPICard
          title="High Risk"
          value={highRiskCount}
          icon={ShieldAlert}
          description="Won't sell before expiry"
          trend={{
            value: `${highRiskCount} items`,
            direction: highRiskCount > 3 ? "up" : "down",
          }}
          index={2}
        />
        <KPICard
          title="Inventory Units"
          value={totalStock.toLocaleString()}
          icon={Boxes}
          description="Total units in stock"
          index={3}
        />
      </div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <h2 className="text-base font-semibold text-foreground mb-4">Category Breakdown</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Object.entries(categoryBreakdown).map(([category, data]) => (
            <div
              key={category}
              className="rounded-xl bg-muted/50 p-4 border border-border/50"
            >
              <p className="text-sm font-medium text-foreground">{category}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{data.count}</p>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{data.stock} units</span>
                {data.highRisk > 0 && (
                  <span className="text-destructive">{data.highRisk} at risk</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Inventory Table */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4">
          Inventory Details
        </h2>
        <StoreTable data={mockInventory} />
      </div>
    </div>
  );
}
