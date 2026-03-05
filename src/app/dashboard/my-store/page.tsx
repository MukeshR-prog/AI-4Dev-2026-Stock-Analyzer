"use client";

import { useAuth } from "@/context/AuthContext";
import StoreTable from "@/components/StoreTable";
import KPICard from "@/components/KPICard";
import { mockInventory, calculateExpiryRisk } from "@/data/inventory";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  ShieldAlert,
  Boxes,
  Store,
  BarChart3,
} from "lucide-react";

export default function MyStorePage() {
  const { profile } = useAuth();

  if (!profile) return null;

  const totalProducts = mockInventory.length;
  const totalStock = mockInventory.reduce((sum, p) => sum + p.stock, 0);
  const nearExpiryCount = mockInventory.filter((p) => p.expiryDays <= 5).length;
  const highRiskCount = mockInventory.filter((p) => calculateExpiryRisk(p) === "High").length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <Store className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              My Store Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{profile.company}</span>
              {" – "}
              <span className="font-medium text-slate-600">{profile.branch}</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Products" value={totalProducts} icon={Package} index={0} />
        <KPICard title="Near Expiry" value={nearExpiryCount} icon={Clock} accent="amber" index={1} />
        <KPICard title="High Risk" value={highRiskCount} icon={ShieldAlert} accent="red" index={2} />
        <KPICard title="Inventory Units" value={totalStock} icon={Boxes} accent="emerald" index={3} />
      </div>

      {/* Inventory Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-800">Inventory Overview</h2>
        </div>
        <StoreTable data={mockInventory} />
      </motion.div>
    </div>
  );
}
