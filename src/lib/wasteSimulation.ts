// ── Waste Impact Simulation Engine ──
// Uses mock data + recommendations to project before/after waste.

import type { GeneratedRecommendation } from "./recommendationEngine";

export interface WasteProjection {
  product: string;
  stock: number;
  expiryDays: number;
  salesPerDay: number;
  predictedWasteBefore: number;
  predictedWasteAfter: number;
  savedUnits: number;
}

export interface ImpactTotals {
  totalWasteBefore: number;
  totalWasteAfter: number;
  totalSaved: number;
  reductionPercent: number;
}

export interface RecommendationEffect {
  id: string;
  product: string;
  action: string;
  type: "transfer" | "discount" | "donation";
  unitsSaved: number;
}

// ── Realistic effectiveness rates for each action type ──
const EFFECTIVENESS_RATES: Record<string, number> = {
  transfer: 0.85,  // 85% - some logistics delays, minor spoilage in transit
  discount: 0.65,  // 65% - not all discounted items sell, some customers skip
  donation: 0.90,  // 90% - most donated, small portion may be rejected
};

// ── Build per-product waste projections ──

export function buildWasteProjections(
  inventory: { product: string; stock: number; expiryDays: number; salesPerDay: number }[],
  recommendations: GeneratedRecommendation[]
): WasteProjection[] {
  return inventory.map((item) => {
    // Predicted waste = surplus that won't sell before expiry
    const sellableUnits = Math.min(item.stock, Math.round(item.salesPerDay * item.expiryDays));
    const wasteBefore = Math.max(0, item.stock - sellableUnits);

    // Find recommendations that address this product with realistic effectiveness
    const productRecs = recommendations.filter((r) => r.product === item.product);
    const unitsAddressed = productRecs.reduce((sum, r) => {
      const rate = EFFECTIVENESS_RATES[r.type] ?? 0.7;
      return sum + Math.round(r.units * rate);
    }, 0);

    // After applying recommendations, waste is reduced (but not perfectly)
    const wasteAfter = Math.max(0, wasteBefore - unitsAddressed);

    return {
      product: item.product,
      stock: item.stock,
      expiryDays: item.expiryDays,
      salesPerDay: item.salesPerDay,
      predictedWasteBefore: wasteBefore,
      predictedWasteAfter: wasteAfter,
      savedUnits: wasteBefore - wasteAfter,
    };
  });
}

// ── Calculate totals ──

export function calculateImpactTotals(projections: WasteProjection[]): ImpactTotals {
  const totalWasteBefore = projections.reduce((s, p) => s + p.predictedWasteBefore, 0);
  const totalWasteAfter = projections.reduce((s, p) => s + p.predictedWasteAfter, 0);
  const totalSaved = totalWasteBefore - totalWasteAfter;
  const reductionPercent =
    totalWasteBefore > 0 ? Math.round((totalSaved / totalWasteBefore) * 100) : 0;

  return { totalWasteBefore, totalWasteAfter, totalSaved, reductionPercent };
}

// ── Build effect list (which recs contributed) ──

export function buildRecommendationEffects(
  recommendations: GeneratedRecommendation[]
): RecommendationEffect[] {
  return recommendations.map((rec) => ({
    id: rec.id,
    product: rec.product,
    action: rec.action,
    type: rec.type,
    unitsSaved: rec.units,
  }));
}
