// ── Mock data & rule-based recommendation engine ──
// Current Date: March 7, 2026

export type RecommendationType = "transfer" | "discount" | "donation";

export interface InventoryItem {
  product: string;
  branch: string;
  stock: number;
  expiryDays: number;
  salesPerDay: number;
}

export interface BranchDemand {
  branch: string;
  product: string;
  demandPerDay: number;
  currentStock: number;
}

export interface GeneratedRecommendation {
  id: string;
  product: string;
  type: RecommendationType;
  issue: string;
  action: string;
  reason: string;
  priority: "high" | "medium" | "low";
  units: number;
}

// ── Mock inventory for the current store (FreshMart Union Square - March 7, 2026) ──

export function getMockInventory(branch: string): InventoryItem[] {
  return [
    { product: "Organic Whole Milk (1 Gallon)", branch, stock: 12, expiryDays: 2, salesPerDay: 18 },
    { product: "Butter Croissants (4ct)", branch, stock: 8, expiryDays: 1, salesPerDay: 12 },
    { product: "Cold Pressed Green Juice (12oz)", branch, stock: 28, expiryDays: 2, salesPerDay: 12 },
    { product: "Chobani Greek Yogurt (5.3oz)", branch, stock: 45, expiryDays: 8, salesPerDay: 15 },
    { product: "Fresh Chicken Breast (per lb)", branch, stock: 38, expiryDays: 2, salesPerDay: 25 },
    { product: "Organic Free-Range Eggs (18ct)", branch, stock: 32, expiryDays: 12, salesPerDay: 16 },
    { product: "Land O'Lakes Butter (1lb)", branch, stock: 42, expiryDays: 25, salesPerDay: 12 },
    { product: "Tillamook Sharp Cheddar (8oz)", branch, stock: 28, expiryDays: 38, salesPerDay: 7 },
    { product: "Fresh Strawberries (16oz)", branch, stock: 22, expiryDays: 2, salesPerDay: 15 },
    { product: "Artisan Sourdough Loaf", branch, stock: 6, expiryDays: 1, salesPerDay: 14 },
    { product: "Atlantic Salmon Fillet (per lb)", branch, stock: 18, expiryDays: 1, salesPerDay: 10 },
    { product: "85% Lean Ground Beef (per lb)", branch, stock: 24, expiryDays: 1, salesPerDay: 18 },
  ];
}

// ── Mock demand from other FreshMart branches ──

export function getMockBranchDemand(currentBranch: string): BranchDemand[] {
  const allBranches = [
    // Organic Whole Milk - High demand across stores
    { branch: "FreshMart Upper West Side", product: "Organic Whole Milk (1 Gallon)", demandPerDay: 22, currentStock: 56 },
    { branch: "FreshMart Park Slope", product: "Organic Whole Milk (1 Gallon)", demandPerDay: 14, currentStock: 18 },
    { branch: "FreshMart Jersey City", product: "Organic Whole Milk (1 Gallon)", demandPerDay: 12, currentStock: 8 },
    { branch: "FreshMart Back Bay", product: "Organic Whole Milk (1 Gallon)", demandPerDay: 16, currentStock: 24 },

    // Butter Croissants - Bakery high turnover
    { branch: "FreshMart Upper West Side", product: "Butter Croissants (4ct)", demandPerDay: 14, currentStock: 12 },
    { branch: "FreshMart Jersey City", product: "Butter Croissants (4ct)", demandPerDay: 10, currentStock: 28 },
    { branch: "FreshMart Rittenhouse", product: "Butter Croissants (4ct)", demandPerDay: 8, currentStock: 6 },

    // Green Juice - Premium item
    { branch: "FreshMart Georgetown", product: "Cold Pressed Green Juice (12oz)", demandPerDay: 10, currentStock: 38 },
    { branch: "FreshMart Rittenhouse", product: "Cold Pressed Green Juice (12oz)", demandPerDay: 8, currentStock: 45 },

    // Yogurt - Steady demand
    { branch: "FreshMart Back Bay", product: "Chobani Greek Yogurt (5.3oz)", demandPerDay: 18, currentStock: 78 },
    { branch: "FreshMart Park Slope", product: "Chobani Greek Yogurt (5.3oz)", demandPerDay: 12, currentStock: 32 },

    // Fresh Chicken - High demand meat
    { branch: "FreshMart Upper West Side", product: "Fresh Chicken Breast (per lb)", demandPerDay: 28, currentStock: 42 },
    { branch: "FreshMart Georgetown", product: "Fresh Chicken Breast (per lb)", demandPerDay: 22, currentStock: 18 },

    // Eggs - Weekend brunch demand
    { branch: "FreshMart Park Slope", product: "Organic Free-Range Eggs (18ct)", demandPerDay: 14, currentStock: 22 },
    { branch: "FreshMart Jersey City", product: "Organic Free-Range Eggs (18ct)", demandPerDay: 12, currentStock: 18 },

    // Fresh Strawberries - Seasonal
    { branch: "FreshMart Upper West Side", product: "Fresh Strawberries (16oz)", demandPerDay: 18, currentStock: 24 },
    { branch: "FreshMart Back Bay", product: "Fresh Strawberries (16oz)", demandPerDay: 12, currentStock: 16 },

    // Sourdough - Popular artisan bread
    { branch: "FreshMart Rittenhouse", product: "Artisan Sourdough Loaf", demandPerDay: 10, currentStock: 22 },
    { branch: "FreshMart Georgetown", product: "Artisan Sourdough Loaf", demandPerDay: 12, currentStock: 8 },

    // Salmon - Premium seafood
    { branch: "FreshMart Back Bay", product: "Atlantic Salmon Fillet (per lb)", demandPerDay: 14, currentStock: 32 },
    { branch: "FreshMart Georgetown", product: "Atlantic Salmon Fillet (per lb)", demandPerDay: 10, currentStock: 12 },

    // Ground Beef - Steady demand
    { branch: "FreshMart Jersey City", product: "85% Lean Ground Beef (per lb)", demandPerDay: 20, currentStock: 45 },
    { branch: "FreshMart Park Slope", product: "85% Lean Ground Beef (per lb)", demandPerDay: 15, currentStock: 28 },
  ];

  return allBranches.filter((d) => d.branch !== currentBranch);
}

// ── Rule-based engine ──

export function generateRecommendations(
  inventory: InventoryItem[],
  branchDemand: BranchDemand[]
): GeneratedRecommendation[] {
  const results: GeneratedRecommendation[] = [];
  let idCounter = 1;

  for (const item of inventory) {
    const daysOfStock = item.salesPerDay > 0 ? item.stock / item.salesPerDay : Infinity;
    const hasExpiryRisk = daysOfStock > item.expiryDays;

    if (!hasExpiryRisk) continue; // product sells before expiry — no action needed

    const surplus = Math.round(item.stock - item.salesPerDay * item.expiryDays);
    if (surplus <= 0) continue;

    // Find branches with higher demand & low stock for this product
    const candidates = branchDemand
      .filter((d) => d.product === item.product && d.currentStock < d.demandPerDay * 2)
      .sort((a, b) => b.demandPerDay - a.demandPerDay);

    const bestCandidate = candidates[0];

    if (item.expiryDays <= 1) {
      // ── Donation: extremely close to expiry ──
      const donateUnits = Math.min(surplus, item.stock);
      results.push({
        id: `rec-${idCounter++}`,
        product: item.product,
        type: "donation",
        issue: `${item.stock} units expiring tomorrow — cannot sell in time.`,
        action: `Donate ${donateUnits} units to a local food bank or charity.`,
        reason: `With only ${item.expiryDays} day(s) left, selling ${item.stock} units is unlikely at ${item.salesPerDay}/day. Donation avoids waste and supports the community.`,
        priority: "high",
        units: donateUnits,
      });
    } else if (bestCandidate) {
      // ── Transfer: another branch needs it ──
      const transferUnits = Math.min(surplus, Math.round(bestCandidate.demandPerDay * 2));
      results.push({
        id: `rec-${idCounter++}`,
        product: item.product,
        type: "transfer",
        issue: `High expiry risk — ${item.stock} units with ${item.expiryDays} day(s) left, but only ${item.salesPerDay}/day local demand.`,
        action: `Transfer ${transferUnits} units to ${bestCandidate.branch}.`,
        reason: `${bestCandidate.branch} has demand of ${bestCandidate.demandPerDay}/day but only ${bestCandidate.currentStock} units in stock. Transferring reduces your surplus and prevents waste.`,
        priority: item.expiryDays <= 3 ? "high" : "medium",
        units: transferUnits,
      });
    } else {
      // ── Discount: no branch demand, but expiry approaching ──
      const discountUnits = surplus;
      results.push({
        id: `rec-${idCounter++}`,
        product: item.product,
        type: "discount",
        issue: `${surplus} surplus units expiring in ${item.expiryDays} days — no nearby branch demand found.`,
        action: `Apply a 30% flash discount on ${discountUnits} units at your branch.`,
        reason: `No other branch needs this product right now. A discount can accelerate sales and recover partial revenue instead of full waste.`,
        priority: item.expiryDays <= 3 ? "high" : "medium",
        units: discountUnits,
      });
    }
  }

  // Sort: high priority first
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  results.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return results;
}
