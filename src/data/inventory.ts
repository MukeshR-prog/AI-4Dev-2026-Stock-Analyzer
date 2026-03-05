export interface InventoryItem {
  product: string;
  category: string;
  stock: number;
  expiryDays: number;
  salesPerDay: number;
}

export type ExpiryRisk = "High" | "Medium" | "Low";

/**
 * Calculate expiry risk based on stock, sales rate, and days until expiry.
 * If the days needed to sell current stock exceeds expiryDays → High risk
 * If within 1.5x of expiryDays → Medium risk
 * Otherwise → Low risk
 */
export function calculateExpiryRisk(item: InventoryItem): ExpiryRisk {
  const daysToSell = item.salesPerDay > 0 ? item.stock / item.salesPerDay : Infinity;

  if (daysToSell > item.expiryDays) return "High";
  if (daysToSell > item.expiryDays * 0.7) return "Medium";
  return "Low";
}

export const mockInventory: InventoryItem[] = [
  { product: "Milk (1L)", category: "Dairy", stock: 50, expiryDays: 2, salesPerDay: 5 },
  { product: "Bread (White)", category: "Bakery", stock: 30, expiryDays: 3, salesPerDay: 6 },
  { product: "Yogurt (200g)", category: "Dairy", stock: 20, expiryDays: 5, salesPerDay: 4 },
  { product: "Cheese Slices", category: "Dairy", stock: 45, expiryDays: 12, salesPerDay: 4 },
  { product: "Fresh Juice (500ml)", category: "Beverages", stock: 20, expiryDays: 3, salesPerDay: 8 },
  { product: "Butter (100g)", category: "Dairy", stock: 60, expiryDays: 15, salesPerDay: 5 },
  { product: "Eggs (12 pack)", category: "Poultry", stock: 25, expiryDays: 7, salesPerDay: 6 },
  { product: "Paneer (200g)", category: "Dairy", stock: 15, expiryDays: 4, salesPerDay: 3 },
  { product: "Chicken Sausage", category: "Meat", stock: 18, expiryDays: 3, salesPerDay: 7 },
  { product: "Mixed Fruit Jam", category: "Condiments", stock: 40, expiryDays: 60, salesPerDay: 2 },
  { product: "Curd (400g)", category: "Dairy", stock: 35, expiryDays: 4, salesPerDay: 10 },
  { product: "Croissant", category: "Bakery", stock: 12, expiryDays: 2, salesPerDay: 8 },
];
