"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import StoreTable from "@/components/StoreTable";
import KPICard from "@/components/KPICard";
import InsightCard from "@/components/InsightCard";
import { mockInventory, calculateExpiryRisk } from "@/data/inventory";
import { generateExpiryInsights } from "@/lib/insightEngine";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  ShieldAlert,
  Boxes,
  BrainCircuit,
} from "lucide-react";

export default function MyStorePage() {
  const { profile } = useAuth();

  if (!profile) return null;

  const totalProducts = mockInventory.length;
  const totalStock = mockInventory.reduce((sum, p) => sum + p.stock, 0);
  const nearExpiryCount = mockInventory.filter((p) => p.expiryDays <= 5).length;
  const highRiskCount = mockInventory.filter(
    (p) => calculateExpiryRisk(p) === "High",
  ).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          My Store
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your store inventory and key metrics.
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

      {/* Inventory Table */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4">
          Inventory Overview
        </h2>
        <StoreTable data={mockInventory} />
      </div>

      {/* AI Insights Panel */}
      <InsightsPanel />
    </div>
  );
}

function InsightsPanel() {
  const insights = useMemo(() => generateExpiryInsights(mockInventory), []);

  if (insights.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BrainCircuit className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          AI Insights
        </h2>
      </div>
      <p className="text-sm text-muted-foreground -mt-2">
        Transparent explanations for why items were flagged as at-risk.
      </p>
      <div className="grid gap-5 lg:grid-cols-2">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}
