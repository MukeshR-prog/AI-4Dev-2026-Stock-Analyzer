// ── Explainable Insights Engine ──
// Generates human-readable explanations for expiry risks,
// demand differences, and redistribution recommendations.

import type { InventoryItem as DataInventoryItem, ExpiryRisk } from "@/data/inventory";
import { calculateExpiryRisk } from "@/data/inventory";
import type {
  InventoryItem as EngineInventoryItem,
  BranchDemand,
  GeneratedRecommendation,
} from "./recommendationEngine";

export type InsightType = "expiry-risk" | "demand-difference" | "redistribution";

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  product: string;
  bullets: string[];
  conclusion: string;
  severity: "high" | "medium" | "low";
}

// ── 1. Expiry Risk Insights (for My Store page) ──

export function generateExpiryInsights(inventory: DataInventoryItem[]): Insight[] {
  const insights: Insight[] = [];
  let idCounter = 1;

  for (const item of inventory) {
    const risk: ExpiryRisk = calculateExpiryRisk(item);
    if (risk === "Low") continue;

    const daysToSell =
      item.salesPerDay > 0 ? (item.stock / item.salesPerDay).toFixed(1) : "∞";
    const expectedSales = Math.round(item.salesPerDay * item.expiryDays);
    const surplus = Math.max(0, item.stock - expectedSales);

    const bullets: string[] = [
      `Current stock: ${item.stock} units`,
      `Average daily sales: ${item.salesPerDay} units/day`,
      `Remaining shelf life: ${item.expiryDays} day${item.expiryDays !== 1 ? "s" : ""}`,
      `Days needed to sell all stock: ${daysToSell} days`,
      `Expected sales before expiry: ${expectedSales} units`,
    ];

    let conclusion: string;
    if (risk === "High") {
      conclusion = `Inventory exceeds expected demand by ${surplus} units. Waste risk is high — immediate action recommended.`;
    } else {
      conclusion = `Stock is close to the sell-through threshold. Monitor closely and consider proactive measures.`;
    }

    insights.push({
      id: `exp-${idCounter++}`,
      type: "expiry-risk",
      title: `${item.product} — ${risk} Expiry Risk`,
      product: item.product,
      bullets,
      conclusion,
      severity: risk === "High" ? "high" : "medium",
    });
  }

  return insights;
}

// ── 2. Recommendation Explanations (for Recommendations page) ──

export function generateRecommendationInsights(
  recommendations: GeneratedRecommendation[],
  inventory: EngineInventoryItem[],
  branchDemand: BranchDemand[]
): Insight[] {
  const insights: Insight[] = [];
  let idCounter = 1;

  for (const rec of recommendations) {
    const item = inventory.find((i) => i.product === rec.product);
    if (!item) continue;

    const expectedSales = Math.round(item.salesPerDay * item.expiryDays);
    const surplus = Math.max(0, item.stock - expectedSales);

    if (rec.type === "transfer") {
      // Find the target branch from the action text
      const candidates = branchDemand
        .filter((d) => d.product === rec.product && d.currentStock < d.demandPerDay * 2)
        .sort((a, b) => b.demandPerDay - a.demandPerDay);
      const target = candidates[0];

      const avgDemand =
        branchDemand.filter((d) => d.product === rec.product).length > 0
          ? (
              branchDemand
                .filter((d) => d.product === rec.product)
                .reduce((s, d) => s + d.demandPerDay, 0) /
              branchDemand.filter((d) => d.product === rec.product).length
            ).toFixed(1)
          : "N/A";

      const bullets: string[] = [
        `Your branch has ${item.stock} units with ${item.expiryDays} day(s) until expiry`,
        `Local demand is only ${item.salesPerDay} units/day — surplus of ${surplus} units`,
      ];

      if (target) {
        bullets.push(
          `${target.branch} has demand of ${target.demandPerDay}/day but only ${target.currentStock} units in stock`,
          `Company average demand for this product: ${avgDemand} units/day`
        );
      }

      insights.push({
        id: `rec-ins-${idCounter++}`,
        type: "redistribution",
        title: `Transfer ${rec.product}`,
        product: rec.product,
        bullets,
        conclusion: `Redistribution can reduce potential waste by moving surplus to a branch with higher demand and lower inventory.`,
        severity: rec.priority,
      });
    } else if (rec.type === "discount") {
      insights.push({
        id: `rec-ins-${idCounter++}`,
        type: "demand-difference",
        title: `Discount ${rec.product}`,
        product: rec.product,
        bullets: [
          `Your branch has ${surplus} surplus units expiring in ${item.expiryDays} days`,
          `Local demand (${item.salesPerDay}/day) cannot absorb all stock before expiry`,
          `No other branch has significant unmet demand for this product`,
          `A discount can accelerate sales and recover partial revenue`,
        ],
        conclusion: `Since no branch transfer is viable, a price reduction is the best strategy to prevent full waste.`,
        severity: rec.priority,
      });
    } else {
      // donation
      insights.push({
        id: `rec-ins-${idCounter++}`,
        type: "redistribution",
        title: `Donate ${rec.product}`,
        product: rec.product,
        bullets: [
          `${item.stock} units are expiring within ${item.expiryDays} day(s)`,
          `At ${item.salesPerDay} units/day, only ${expectedSales} units can be sold`,
          `Remaining ${surplus} units will likely go to waste`,
          `Donating prevents disposal and supports the community`,
        ],
        conclusion: `With extremely low remaining shelf life, donation is the most responsible and impactful action.`,
        severity: "high",
      });
    }
  }

  return insights;
}
