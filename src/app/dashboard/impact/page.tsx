"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getMockInventory,
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
} from "lucide-react";

export default function ImpactPage() {
  const { profile } = useAuth();

  const { projections, totals, effects } = useMemo(() => {
    if (!profile) {
      return {
        projections: [],
        totals: { totalWasteBefore: 0, totalWasteAfter: 0, totalSaved: 0, reductionPercent: 0 },
        effects: [],
      };
    }
    const inventory = getMockInventory(profile.branch);
    const demand = getMockBranchDemand(profile.branch);
    const recs = generateRecommendations(inventory, demand);
    const proj = buildWasteProjections(inventory, recs);
    const tot = calculateImpactTotals(proj);
    const eff = buildRecommendationEffects(recs);
    return { projections: proj, totals: tot, effects: eff };
  }, [profile]);

  if (!profile) return null;

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
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
          icon={<Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />}
          iconBg="bg-red-50 dark:bg-red-950/40"
          valueColor="text-red-600 dark:text-red-400"
          borderColor="border-l-red-500"
        />

        <WasteImpactCard
          label="Projected Waste After Actions"
          value={`${totals.totalWasteAfter} units`}
          subtitle="If all recommendations are applied"
          icon={<Leaf className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/40"
          valueColor="text-emerald-600 dark:text-emerald-400"
          borderColor="border-l-emerald-500"
        />

        <WasteImpactCard
          label="Waste Reduction"
          value={`${totals.reductionPercent}%`}
          subtitle={`${totals.totalSaved} units saved`}
          icon={<TrendingDown className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          iconBg="bg-blue-50 dark:bg-blue-950/40"
          valueColor="text-blue-600 dark:text-blue-400"
          borderColor="border-l-blue-500"
        />
      </div>

      {/* ── Visual Comparison Chart ── */}
      <WasteComparisonChart projections={projections} />

      {/* ── Info Banner ── */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/10 px-5 py-4">
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
      <div className="rounded-xl border border-border bg-card overflow-hidden">
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
                          ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      }`}
                    >
                      {p.predictedWasteBefore}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        p.predictedWasteAfter > 0
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      }`}
                    >
                      {p.predictedWasteAfter}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    {p.savedUnits > 0 ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
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
