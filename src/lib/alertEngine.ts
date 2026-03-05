// ── Smart Alert Engine ──
// Generates proactive alerts from inventory data and branch demand.

import type { InventoryItem, ExpiryRisk } from "@/data/inventory";
import { calculateExpiryRisk } from "@/data/inventory";
import type { BranchDemand } from "./recommendationEngine";
import { getMockBranchDemand } from "./recommendationEngine";

export type AlertType =
  | "expiry-risk"
  | "surplus-inventory"
  | "demand-mismatch"
  | "recommendation";

export type AlertPriority = "high" | "medium" | "low";

export interface SmartAlert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  product: string;
  title: string;
  message: string;
  metric?: string; // e.g. "2 days left"
}

// ── Average stock across the inventory (used for surplus detection) ──
function avgStock(inventory: InventoryItem[]): number {
  if (inventory.length === 0) return 0;
  return Math.round(inventory.reduce((s, i) => s + i.stock, 0) / inventory.length);
}

// ── Generate all alerts ──

export function generateAlerts(
  inventory: InventoryItem[],
  branch: string
): SmartAlert[] {
  const alerts: SmartAlert[] = [];
  let id = 1;

  const avg = avgStock(inventory);
  const branchDemand: BranchDemand[] = getMockBranchDemand(branch);

  for (const item of inventory) {
    const risk: ExpiryRisk = calculateExpiryRisk(item);
    const daysToSell =
      item.salesPerDay > 0 ? item.stock / item.salesPerDay : Infinity;
    const expectedSales = Math.round(item.salesPerDay * item.expiryDays);
    const surplus = Math.max(0, item.stock - expectedSales);

    // ── 1. Expiry Risk Alert ──
    if (risk === "High") {
      alerts.push({
        id: `alert-${id++}`,
        type: "expiry-risk",
        priority: item.expiryDays <= 2 ? "high" : "medium",
        product: item.product,
        title: "Expiry Risk Detected",
        message: `${item.product} has ${item.stock} units but only ${expectedSales} can sell before expiry in ${item.expiryDays} day(s). ${surplus} units at risk of waste.`,
        metric: `${item.expiryDays}d left`,
      });
    } else if (risk === "Medium") {
      alerts.push({
        id: `alert-${id++}`,
        type: "expiry-risk",
        priority: "low",
        product: item.product,
        title: "Expiry Watch",
        message: `${item.product} is approaching the sell-through threshold. Stock takes ~${daysToSell.toFixed(1)} days to sell but expires in ${item.expiryDays} days.`,
        metric: `${item.expiryDays}d left`,
      });
    }

    // ── 2. Surplus Inventory Alert ──
    if (item.stock > avg * 1.8 && risk !== "Low") {
      alerts.push({
        id: `alert-${id++}`,
        type: "surplus-inventory",
        priority: item.stock > avg * 2.5 ? "high" : "medium",
        product: item.product,
        title: "Surplus Inventory",
        message: `${item.product} stock (${item.stock}) is significantly above the store average of ${avg} units. Consider redistribution or markdown.`,
        metric: `${item.stock} units`,
      });
    }

    // ── 3. Demand Mismatch Alert (another branch needs it more) ──
    const productDemand = branchDemand.filter(
      (d) => d.product === item.product && d.currentStock < d.demandPerDay
    );
    if (productDemand.length > 0 && surplus > 0) {
      const best = productDemand.sort(
        (a, b) => b.demandPerDay - a.demandPerDay
      )[0];
      alerts.push({
        id: `alert-${id++}`,
        type: "demand-mismatch",
        priority: surplus > 15 ? "high" : "medium",
        product: item.product,
        title: "Redistribution Opportunity",
        message: `${best.branch} needs ${item.product} (demand: ${best.demandPerDay}/day, stock: ${best.currentStock}). Your surplus of ${surplus} units could help.`,
        metric: `${surplus} surplus`,
      });
    }

    // ── 4. Recommendation Alert (urgent action needed) ──
    if (risk === "High" && item.expiryDays <= 1) {
      alerts.push({
        id: `alert-${id++}`,
        type: "recommendation",
        priority: "high",
        product: item.product,
        title: "Urgent Action Required",
        message: `${item.product} expires tomorrow. Immediate discount, transfer, or donation is recommended to prevent total loss of ${item.stock} units.`,
        metric: "Tomorrow",
      });
    }
  }

  // Sort by priority: high → medium → low
  const order: Record<AlertPriority, number> = { high: 0, medium: 1, low: 2 };
  alerts.sort((a, b) => order[a.priority] - order[b.priority]);

  return alerts;
}

// ── Get the most critical alert (for banner) ──

export function getCriticalAlert(alerts: SmartAlert[]): SmartAlert | null {
  return alerts.find((a) => a.priority === "high") ?? null;
}
