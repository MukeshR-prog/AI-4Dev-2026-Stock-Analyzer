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
  { product: "Orange Juice (1L)", category: "Beverages", stock: 28, expiryDays: 5, salesPerDay: 6 },
  { product: "Whole Wheat Bread", category: "Bakery", stock: 22, expiryDays: 4, salesPerDay: 5 },
  { product: "Greek Yogurt (400g)", category: "Dairy", stock: 16, expiryDays: 6, salesPerDay: 4 },
  { product: "Mozzarella Cheese", category: "Dairy", stock: 32, expiryDays: 10, salesPerDay: 3 },
  { product: "Almond Milk (1L)", category: "Beverages", stock: 14, expiryDays: 8, salesPerDay: 3 },
  { product: "Chicken Breast (500g)", category: "Meat", stock: 24, expiryDays: 2, salesPerDay: 12 },
  { product: "Banana Cake", category: "Bakery", stock: 8, expiryDays: 3, salesPerDay: 4 },
  { product: "Cottage Cheese (200g)", category: "Dairy", stock: 18, expiryDays: 5, salesPerDay: 4 },
  { product: "Apple Cider (500ml)", category: "Beverages", stock: 30, expiryDays: 14, salesPerDay: 2 },
  { product: "Duck Eggs (6 pack)", category: "Poultry", stock: 10, expiryDays: 10, salesPerDay: 2 },
  { product: "Lamb Chops (400g)", category: "Meat", stock: 12, expiryDays: 2, salesPerDay: 5 },
  { product: "Tomato Ketchup", category: "Condiments", stock: 55, expiryDays: 90, salesPerDay: 3 },
  { product: "Chocolate Muffin", category: "Bakery", stock: 15, expiryDays: 2, salesPerDay: 7 },
  { product: "Soy Milk (1L)", category: "Beverages", stock: 20, expiryDays: 12, salesPerDay: 3 },
  { product: "Cream Cheese (150g)", category: "Dairy", stock: 25, expiryDays: 8, salesPerDay: 5 },
  { product: "Turkey Slices (200g)", category: "Meat", stock: 14, expiryDays: 4, salesPerDay: 4 },
  { product: "Mayonnaise (250g)", category: "Condiments", stock: 42, expiryDays: 45, salesPerDay: 2 },
  { product: "Blueberry Muffin", category: "Bakery", stock: 10, expiryDays: 2, salesPerDay: 5 },
];
