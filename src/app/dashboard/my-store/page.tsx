"use client";

import { useAuth } from "@/context/AuthContext";
import StoreTable from "@/components/StoreTable";
import KPICard from "@/components/KPICard";
import { mockInventory, calculateExpiryRisk } from "@/data/inventory";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  ShieldAlert,
  Boxes,
  Store,
  LayoutDashboard,
  Activity,
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
    <div className="space-y-10">
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <Store className="h-6 w-6 text-primary" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-heading text-[22px] font-bold leading-tight tracking-tight text-foreground">
              My Store Dashboard
            </h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-muted-foreground">
              {profile.company}
              <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/40" />
              {profile.branch}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 px-3 py-1 font-normal text-muted-foreground">
            <Activity className="h-3 w-3" />
            Live Inventory
          </Badge>
        </div>
      </motion.div>

      {/* ── KPI Cards ── */}
      <section>
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
            accent="amber"
            description="Expiring within 5 days"
            trend={{ value: `${Math.round((nearExpiryCount / totalProducts) * 100)}%`, direction: nearExpiryCount > 4 ? "up" : "neutral" }}
            index={1}
          />
          <KPICard
            title="High Risk"
            value={highRiskCount}
            icon={ShieldAlert}
            accent="red"
            description="Won't sell before expiry"
            trend={{ value: `${highRiskCount} items`, direction: highRiskCount > 3 ? "up" : "down" }}
            index={2}
          />
          <KPICard
            title="Inventory Units"
            value={totalStock.toLocaleString()}
            icon={Boxes}
            accent="emerald"
            description="Total units in stock"
            index={3}
          />
        </div>
      </section>

      {/* ── Inventory Table ── */}
      <section>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-5 flex items-center gap-2.5"
        >
          <LayoutDashboard className="h-[18px] w-[18px] text-muted-foreground" />
          <h2 className="font-heading text-base font-semibold tracking-tight text-foreground">
            Inventory Overview
          </h2>
          <Badge variant="secondary" className="ml-1 text-xs font-normal">
            {totalProducts} items
          </Badge>
        </motion.div>

        <StoreTable data={mockInventory} />
      </section>
    </div>
  );
}
