"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import type { InventoryItem } from "@/data/inventory";
import {
  getMockBranchDemand,
  generateRecommendations,
} from "@/lib/recommendationEngine";
import {
  buildWasteProjections,
  calculateImpactTotals,
  buildRecommendationEffects,
} from "@/lib/wasteSimulation";
import WasteImpactCard from "@/components/WasteImpactCard";
import WasteComparisonChart from "@/components/WasteComparisonChart";
import ImpactSummary from "@/components/ImpactSummary";
import {
  Trash2,
  Leaf,
  TrendingDown,
  BarChart3,
  Loader2,
} from "lucide-react";

export default function ImpactPage() {
  const { profile } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/inventory");
        const data = await res.json();
        if (data.success) setInventory(data.data);
      } catch {
        // Keep defaults
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const { projections, totals, effects } = useMemo(() => {
    if (!profile || inventory.length === 0) {
      return {
        projections: [],
        totals: { totalWasteBefore: 0, totalWasteAfter: 0, totalSaved: 0, reductionPercent: 0 },
        effects: [],
      };
    }
    const demand = getMockBranchDemand(profile.branch);
    const invForEngine = inventory.map((i) => ({
      product: i.product,
      branch: profile.branch,
      stock: i.stock,
      expiryDays: i.expiryDays,
      salesPerDay: i.salesPerDay,
    }));
    const recs = generateRecommendations(invForEngine, demand);
    const proj = buildWasteProjections(inventory, recs);
    const tot = calculateImpactTotals(proj);
    const eff = buildRecommendationEffects(recs);
    return { projections: proj, totals: tot, effects: eff };
  }, [profile, inventory]);

  if (!profile) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Waste Impact Simulation
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Projected impact of recommended actions &mdash;{" "}
          <span className="font-medium text-foreground">
            {profile.company} &middot; {profile.branch}
          </span>
        </p>
      </div>

      {/* ── Before / After / Improvement Cards ── */}
      <div className="grid gap-5 sm:grid-cols-3">
        <WasteImpactCard
          label="Current Predicted Waste"
          value={`${totals.totalWasteBefore} units`}
          subtitle="Without any action taken"
          icon={<Trash2 className="h-6 w-6 text-destructive" />}
          iconBg="bg-destructive/10"
          valueColor="text-destructive"
        />

        <WasteImpactCard
          label="Projected Waste After Actions"
          value={`${totals.totalWasteAfter} units`}
          subtitle="If all recommendations are applied"
          icon={<Leaf className="h-6 w-6 text-primary" />}
          iconBg="bg-primary/10"
          valueColor="text-primary"
        />

        <WasteImpactCard
          label="Waste Reduction"
          value={`${totals.reductionPercent}%`}
          subtitle={`${totals.totalSaved} units saved`}
          icon={<TrendingDown className="h-6 w-6 text-chart-2" />}
          iconBg="bg-chart-2/10"
          valueColor="text-chart-2"
        />
      </div>

      {/* ── Visual Comparison Chart ── */}
      <WasteComparisonChart projections={projections} />

      {/* ── Info Banner ── */}
      <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/10 px-5 py-4">
        <BarChart3 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm text-foreground">
          <span className="font-semibold">How this works:</span> The simulation
          compares your store&apos;s current surplus against expected sales
          before expiry. Then it calculates how many units each recommendation
          would rescue — via transfers, discounts, or donations — and shows the
          net waste reduction.
        </p>
      </div>

      {/* ── Recommendation Effect List ── */}
      <ImpactSummary effects={effects} />

      {/* ── Per-Product Breakdown Table ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">
            Per-Product Waste Projection
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Detailed breakdown for every inventory item
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                  Product
                </th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">
                  Stock
                </th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">
                  Expiry (days)
                </th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">
                  Sales/Day
                </th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">
                  Waste Before
                </th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">
                  Waste After
                </th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">
                  Saved
                </th>
              </tr>
            </thead>
            <tbody>
              {projections.map((p) => (
                <tr
                  key={p.product}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-3 font-medium text-foreground">
                    {p.product}
                  </td>
                  <td className="px-6 py-3 text-right text-muted-foreground">
                    {p.stock}
                  </td>
                  <td className="px-6 py-3 text-right text-muted-foreground">
                    {p.expiryDays}
                  </td>
                  <td className="px-6 py-3 text-right text-muted-foreground">
                    {p.salesPerDay}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        p.predictedWasteBefore > 0
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {p.predictedWasteBefore}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        p.predictedWasteAfter > 0
                          ? "bg-chart-4/10 text-chart-4"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {p.predictedWasteAfter}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    {p.savedUnits > 0 ? (
                      <span className="inline-flex items-center gap-1 text-primary font-semibold">
                        +{p.savedUnits}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
