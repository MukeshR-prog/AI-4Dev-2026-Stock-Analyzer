export interface InventoryItem {
  product: string;
  category: string;
  stock: number;
  expiryDays: number;
  salesPerDay: number;
  sku: string;
  unitPrice: number;
  lastRestocked: Date;
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

// Current date: March 7, 2026
const today = new Date(2026, 2, 7); // Month is 0-indexed

function daysAgo(days: number): Date {
  return new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
}

export const mockInventory: InventoryItem[] = [
  // DAIRY - High turnover, short shelf life
  { 
    product: "Organic Whole Milk (1 Gallon)", 
    category: "Dairy", 
    stock: 48, 
    expiryDays: 2, 
    salesPerDay: 18,
    sku: "DAI-MIL-001",
    unitPrice: 5.99,
    lastRestocked: daysAgo(1)
  },
  { 
    product: "2% Reduced Fat Milk (1 Gallon)", 
    category: "Dairy", 
    stock: 62, 
    expiryDays: 3, 
    salesPerDay: 22,
    sku: "DAI-MIL-002",
    unitPrice: 4.79,
    lastRestocked: daysAgo(2)
  },
  { 
    product: "Chobani Greek Yogurt (5.3oz)", 
    category: "Dairy", 
    stock: 85, 
    expiryDays: 12, 
    salesPerDay: 15,
    sku: "DAI-YOG-001",
    unitPrice: 1.89,
    lastRestocked: daysAgo(3)
  },
  { 
    product: "Kraft Singles American Cheese (24ct)", 
    category: "Dairy", 
    stock: 34, 
    expiryDays: 21, 
    salesPerDay: 8,
    sku: "DAI-CHE-001",
    unitPrice: 6.49,
    lastRestocked: daysAgo(5)
  },
  { 
    product: "Land O'Lakes Butter (1lb)", 
    category: "Dairy", 
    stock: 56, 
    expiryDays: 30, 
    salesPerDay: 12,
    sku: "DAI-BUT-001",
    unitPrice: 5.29,
    lastRestocked: daysAgo(4)
  },
  { 
    product: "Philadelphia Cream Cheese (8oz)", 
    category: "Dairy", 
    stock: 42, 
    expiryDays: 18, 
    salesPerDay: 9,
    sku: "DAI-CRM-001",
    unitPrice: 4.49,
    lastRestocked: daysAgo(2)
  },
  { 
    product: "Organic Valley Half & Half (32oz)", 
    category: "Dairy", 
    stock: 28, 
    expiryDays: 5, 
    salesPerDay: 6,
    sku: "DAI-CRM-002",
    unitPrice: 5.99,
    lastRestocked: daysAgo(3)
  },
  { 
    product: "Tillamook Sharp Cheddar (8oz)", 
    category: "Dairy", 
    stock: 38, 
    expiryDays: 45, 
    salesPerDay: 7,
    sku: "DAI-CHE-002",
    unitPrice: 5.99,
    lastRestocked: daysAgo(6)
  },

  // BAKERY - Very short shelf life
  { 
    product: "Artisan Sourdough Loaf", 
    category: "Bakery", 
    stock: 24, 
    expiryDays: 2, 
    salesPerDay: 14,
    sku: "BAK-BRE-001",
    unitPrice: 4.99,
    lastRestocked: daysAgo(0) // Today
  },
  { 
    product: "Whole Wheat Sandwich Bread", 
    category: "Bakery", 
    stock: 36, 
    expiryDays: 4, 
    salesPerDay: 10,
    sku: "BAK-BRE-002",
    unitPrice: 3.49,
    lastRestocked: daysAgo(1)
  },
  { 
    product: "Everything Bagels (6ct)", 
    category: "Bakery", 
    stock: 18, 
    expiryDays: 3, 
    salesPerDay: 8,
    sku: "BAK-BAG-001",
    unitPrice: 4.29,
    lastRestocked: daysAgo(1)
  },
  { 
    product: "Butter Croissants (4ct)", 
    category: "Bakery", 
    stock: 15, 
    expiryDays: 2, 
    salesPerDay: 12,
    sku: "BAK-PAS-001",
    unitPrice: 5.99,
    lastRestocked: daysAgo(0)
  },
  { 
    product: "Blueberry Muffins (4ct)", 
    category: "Bakery", 
    stock: 22, 
    expiryDays: 3, 
    salesPerDay: 9,
    sku: "BAK-MUF-001",
    unitPrice: 4.99,
    lastRestocked: daysAgo(1)
  },
  { 
    product: "Chocolate Chip Cookies (12ct)", 
    category: "Bakery", 
    stock: 30, 
    expiryDays: 5, 
    salesPerDay: 7,
    sku: "BAK-COO-001",
    unitPrice: 4.49,
    lastRestocked: daysAgo(2)
  },

  // MEAT & POULTRY - Short shelf life, high value
  { 
    product: "Organic Free-Range Eggs (18ct)", 
    category: "Poultry", 
    stock: 45, 
    expiryDays: 14, 
    salesPerDay: 16,
    sku: "PLT-EGG-001",
    unitPrice: 7.99,
    lastRestocked: daysAgo(2)
  },
  { 
    product: "Fresh Chicken Breast (per lb)", 
    category: "Meat", 
    stock: 68, 
    expiryDays: 3, 
    salesPerDay: 25,
    sku: "MEA-CHK-001",
    unitPrice: 8.99,
    lastRestocked: daysAgo(1)
  },
  { 
    product: "85% Lean Ground Beef (per lb)", 
    category: "Meat", 
    stock: 42, 
    expiryDays: 2, 
    salesPerDay: 18,
    sku: "MEA-BEF-001",
    unitPrice: 7.49,
    lastRestocked: daysAgo(0)
  },
  { 
    product: "Atlantic Salmon Fillet (per lb)", 
    category: "Meat", 
    stock: 28, 
    expiryDays: 2, 
    salesPerDay: 10,
    sku: "MEA-FSH-001",
    unitPrice: 12.99,
    lastRestocked: daysAgo(0)
  },
  { 
    product: "Applegate Turkey Deli Slices (7oz)", 
    category: "Meat", 
    stock: 35, 
    expiryDays: 7, 
    salesPerDay: 8,
    sku: "MEA-DEL-001",
    unitPrice: 6.99,
    lastRestocked: daysAgo(3)
  },
  { 
    product: "Italian Pork Sausage Links (5ct)", 
    category: "Meat", 
    stock: 24, 
    expiryDays: 4, 
    salesPerDay: 6,
    sku: "MEA-SAU-001",
    unitPrice: 5.49,
    lastRestocked: daysAgo(2)
  },

  // BEVERAGES - Longer shelf life
  { 
    product: "Tropicana Orange Juice (52oz)", 
    category: "Beverages", 
    stock: 54, 
    expiryDays: 10, 
    salesPerDay: 14,
    sku: "BEV-JUI-001",
    unitPrice: 4.99,
    lastRestocked: daysAgo(3)
  },
  { 
    product: "Cold Pressed Green Juice (12oz)", 
    category: "Beverages", 
    stock: 32, 
    expiryDays: 3, 
    salesPerDay: 12,
    sku: "BEV-JUI-002",
    unitPrice: 6.99,
    lastRestocked: daysAgo(1)
  },
  { 
    product: "Oatly Oat Milk Original (64oz)", 
    category: "Beverages", 
    stock: 28, 
    expiryDays: 14, 
    salesPerDay: 8,
    sku: "BEV-ALT-001",
    unitPrice: 5.49,
    lastRestocked: daysAgo(4)
  },
  { 
    product: "Califia Almond Milk (48oz)", 
    category: "Beverages", 
    stock: 36, 
    expiryDays: 21, 
    salesPerDay: 6,
    sku: "BEV-ALT-002",
    unitPrice: 4.99,
    lastRestocked: daysAgo(5)
  },
  { 
    product: "Kombucha Variety Pack (6ct)", 
    category: "Beverages", 
    stock: 18, 
    expiryDays: 30, 
    salesPerDay: 4,
    sku: "BEV-KOM-001",
    unitPrice: 14.99,
    lastRestocked: daysAgo(7)
  },

  // PRODUCE - Very short shelf life
  { 
    product: "Organic Baby Spinach (5oz)", 
    category: "Produce", 
    stock: 45, 
    expiryDays: 4, 
    salesPerDay: 18,
    sku: "PRO-LEF-001",
    unitPrice: 4.99,
    lastRestocked: daysAgo(1)
  },
  { 
    product: "Fresh Strawberries (16oz)", 
    category: "Produce", 
    stock: 38, 
    expiryDays: 3, 
    salesPerDay: 15,
    sku: "PRO-BER-001",
    unitPrice: 5.99,
    lastRestocked: daysAgo(1)
  },
  { 
    product: "Organic Avocados (4ct)", 
    category: "Produce", 
    stock: 52, 
    expiryDays: 5, 
    salesPerDay: 20,
    sku: "PRO-AVO-001",
    unitPrice: 5.49,
    lastRestocked: daysAgo(2)
  },
  { 
    product: "Mixed Salad Greens (10oz)", 
    category: "Produce", 
    stock: 28, 
    expiryDays: 4, 
    salesPerDay: 11,
    sku: "PRO-LEF-002",
    unitPrice: 4.49,
    lastRestocked: daysAgo(1)
  },

  // CONDIMENTS & PANTRY - Long shelf life
  { 
    product: "Heinz Tomato Ketchup (32oz)", 
    category: "Condiments", 
    stock: 65, 
    expiryDays: 180, 
    salesPerDay: 5,
    sku: "CON-KET-001",
    unitPrice: 4.99,
    lastRestocked: daysAgo(14)
  },
  { 
    product: "Sir Kensington's Mayo (10oz)", 
    category: "Condiments", 
    stock: 42, 
    expiryDays: 90, 
    salesPerDay: 4,
    sku: "CON-MAY-001",
    unitPrice: 5.49,
    lastRestocked: daysAgo(10)
  },
  { 
    product: "Bonne Maman Strawberry Jam (13oz)", 
    category: "Condiments", 
    stock: 38, 
    expiryDays: 120, 
    salesPerDay: 3,
    sku: "CON-JAM-001",
    unitPrice: 5.99,
    lastRestocked: daysAgo(12)
  },
];
