"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import StoreTable from "@/components/StoreTable";
import KPICard from "@/components/KPICard";
import InsightCard from "@/components/InsightCard";
import AlertBanner from "@/components/AlertBanner";
import AlertList from "@/components/AlertList";
import { mockInventory, calculateExpiryRisk } from "@/data/inventory";
import { generateExpiryInsights } from "@/lib/insightEngine";
import { generateAlerts, getCriticalAlert } from "@/lib/alertEngine";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  ShieldAlert,
  Boxes,
  BrainCircuit,
  LayoutGrid,
  Bell,
  Sparkles,
} from "lucide-react";

export default function MyStorePage() {
  const { profile } = useAuth();

  const alerts = useMemo(
    () => generateAlerts(mockInventory, profile?.branch || ""),
    [profile?.branch],
  );
  const criticalAlert = getCriticalAlert(alerts);

  const insights = useMemo(() => generateExpiryInsights(mockInventory), []);

  const highAlertCount = alerts.filter((a) => a.priority === "high").length;

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
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          My Store
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile.company} &middot; {profile.branch} &mdash; Inventory overview
          and key metrics
        </p>
      </motion.div>

      {/* Critical Alert Banner — always visible above tabs */}
      {criticalAlert && <AlertBanner alert={criticalAlert} />}

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">
            <LayoutGrid className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <Bell className="h-4 w-4" />
            Alerts
            {highAlertCount > 0 && (
              <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[11px] font-bold text-destructive-foreground">
                {highAlertCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Sparkles className="h-4 w-4" />
            AI Insights
            {insights.length > 0 && (
              <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                {insights.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── Overview Tab ── */}
        <TabsContent value="overview" className="space-y-6">
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
        </TabsContent>

        {/* ── Alerts Tab ── */}
        <TabsContent value="alerts" className="space-y-6">
          {alerts.length > 0 ? (
            <AlertList alerts={alerts} />
          ) : (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <Bell className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">
                No alerts at this time. Your inventory looks healthy!
              </p>
            </div>
          )}
        </TabsContent>

        {/* ── AI Insights Tab ── */}
        <TabsContent value="insights" className="space-y-5">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              AI Insights
            </h2>
          </div>
          <p className="text-sm text-muted-foreground -mt-3">
            Transparent explanations for why items were flagged as at-risk.
          </p>
          {insights.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {insights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">
                No insights to display. All products are within safe thresholds.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
