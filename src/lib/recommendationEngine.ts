// ── Mock data & rule-based recommendation engine ──

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

// ── Mock inventory for the current store ──

export function getMockInventory(branch: string): InventoryItem[] {
  return [
    { product: "Milk (1L)", branch, stock: 50, expiryDays: 2, salesPerDay: 15 },
    { product: "Bread (White)", branch, stock: 80, expiryDays: 1, salesPerDay: 25 },
    { product: "Fresh Juice (500ml)", branch, stock: 35, expiryDays: 3, salesPerDay: 8 },
    { product: "Yogurt (200g)", branch, stock: 60, expiryDays: 4, salesPerDay: 18 },
    { product: "Paneer (200g)", branch, stock: 25, expiryDays: 2, salesPerDay: 5 },
    { product: "Eggs (12 pack)", branch, stock: 40, expiryDays: 7, salesPerDay: 12 },
    { product: "Butter (100g)", branch, stock: 30, expiryDays: 10, salesPerDay: 6 },
    { product: "Cheese Slices", branch, stock: 20, expiryDays: 5, salesPerDay: 4 },
  ];
}

// ── Mock demand from other branches ──

export function getMockBranchDemand(currentBranch: string): BranchDemand[] {
  const allBranches = [
    { branch: "Branch 1", product: "Milk (1L)", demandPerDay: 22, currentStock: 10 },
    { branch: "Branch 2", product: "Milk (1L)", demandPerDay: 18, currentStock: 40 },
    { branch: "Branch 9", product: "Milk (1L)", demandPerDay: 25, currentStock: 8 },

    { branch: "Branch 1", product: "Bread (White)", demandPerDay: 30, currentStock: 12 },
    { branch: "Branch 2", product: "Bread (White)", demandPerDay: 15, currentStock: 50 },
    { branch: "Branch 9", product: "Bread (White)", demandPerDay: 20, currentStock: 5 },

    { branch: "Branch 1", product: "Fresh Juice (500ml)", demandPerDay: 12, currentStock: 6 },
    { branch: "Branch 2", product: "Fresh Juice (500ml)", demandPerDay: 5, currentStock: 30 },

    { branch: "Branch 1", product: "Yogurt (200g)", demandPerDay: 20, currentStock: 15 },
    { branch: "Branch 9", product: "Yogurt (200g)", demandPerDay: 14, currentStock: 5 },

    { branch: "Branch 1", product: "Paneer (200g)", demandPerDay: 8, currentStock: 3 },
    { branch: "Branch 2", product: "Paneer (200g)", demandPerDay: 4, currentStock: 20 },

    { branch: "Branch 1", product: "Eggs (12 pack)", demandPerDay: 10, currentStock: 30 },
    { branch: "Branch 9", product: "Eggs (12 pack)", demandPerDay: 8, currentStock: 25 },

    { branch: "Branch 1", product: "Butter (100g)", demandPerDay: 5, currentStock: 20 },

    { branch: "Branch 1", product: "Cheese Slices", demandPerDay: 6, currentStock: 8 },
    { branch: "Branch 9", product: "Cheese Slices", demandPerDay: 3, currentStock: 15 },
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
