// Mock data for Stock Transfers and Branch Directory
// Current Date: March 7, 2026

import type { StockTransferRequest, BranchContact } from "@/types";

// ═══════════════════════════════════════════════════════════════════════════════
// DATE HELPERS - Based on current date March 7, 2026
// ═══════════════════════════════════════════════════════════════════════════════

const TODAY = new Date(2026, 2, 7, 9, 0, 0); // March 7, 2026, 9:00 AM

function hoursAgo(hours: number): Date {
  return new Date(TODAY.getTime() - hours * 60 * 60 * 1000);
}

function daysAgo(days: number, hour: number = 10): Date {
  const date = new Date(TODAY.getTime() - days * 24 * 60 * 60 * 1000);
  date.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
  return date;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BRANCH CONTACT DIRECTORY - Real US locations for FreshMart grocery chain
// ═══════════════════════════════════════════════════════════════════════════════

export const mockBranchContacts: BranchContact[] = [
  {
    branchId: "FM-NYC-001",
    branchName: "FreshMart Union Square",
    managerName: "Sarah Mitchell",
    phone: "+1 (212) 555-0147",
    email: "sarah.mitchell@freshmart.com",
    address: "33 East 17th Street",
    city: "New York",
    region: "Northeast",
    isActive: true,
  },
  {
    branchId: "FM-NYC-002",
    branchName: "FreshMart Upper West Side",
    managerName: "David Chen",
    phone: "+1 (212) 555-0283",
    email: "david.chen@freshmart.com",
    address: "2187 Broadway",
    city: "New York",
    region: "Northeast",
    isActive: true,
  },
  {
    branchId: "FM-BRK-001",
    branchName: "FreshMart Park Slope",
    managerName: "Jennifer Williams",
    phone: "+1 (718) 555-0392",
    email: "jennifer.williams@freshmart.com",
    address: "267 7th Avenue",
    city: "Brooklyn",
    region: "Northeast",
    isActive: true,
  },
  {
    branchId: "FM-JC-001",
    branchName: "FreshMart Jersey City",
    managerName: "Michael Rodriguez",
    phone: "+1 (201) 555-0156",
    email: "michael.rodriguez@freshmart.com",
    address: "95 River Drive South",
    city: "Jersey City",
    region: "Northeast",
    isActive: true,
  },
  {
    branchId: "FM-BOS-001",
    branchName: "FreshMart Back Bay",
    managerName: "Emily Thompson",
    phone: "+1 (617) 555-0478",
    email: "emily.thompson@freshmart.com",
    address: "501 Boylston Street",
    city: "Boston",
    region: "Northeast",
    isActive: true,
  },
  {
    branchId: "FM-PHL-001",
    branchName: "FreshMart Rittenhouse",
    managerName: "James Patterson",
    phone: "+1 (215) 555-0294",
    email: "james.patterson@freshmart.com",
    address: "1735 Chestnut Street",
    city: "Philadelphia",
    region: "Northeast",
    isActive: true,
  },
  {
    branchId: "FM-DC-001",
    branchName: "FreshMart Georgetown",
    managerName: "Amanda Foster",
    phone: "+1 (202) 555-0518",
    email: "amanda.foster@freshmart.com",
    address: "3222 M Street NW",
    city: "Washington DC",
    region: "Mid-Atlantic",
    isActive: true,
  },
  {
    branchId: "FM-DC-002",
    branchName: "FreshMart Dupont Circle",
    managerName: "Robert Kim",
    phone: "+1 (202) 555-0631",
    email: "robert.kim@freshmart.com",
    address: "1601 Connecticut Ave NW",
    city: "Washington DC",
    region: "Mid-Atlantic",
    isActive: false, // Temporarily closed for renovation
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STOCK TRANSFER REQUESTS - Real scenarios for March 7, 2026
// ═══════════════════════════════════════════════════════════════════════════════

export const mockTransferRequests: StockTransferRequest[] = [
  // URGENT - This morning's request
  {
    id: "TR-2026-0307-001",
    fromBranch: "FreshMart Upper West Side",
    toBranch: "FreshMart Union Square",
    product: "Organic Whole Milk (1 Gallon)",
    quantity: 24,
    status: "pending",
    requestedBy: "Sarah Mitchell",
    requestedAt: hoursAgo(2), // 7:00 AM today
    notes: "Union Square sold out early due to weekend rush. Need by noon.",
  },
  // Pending from yesterday evening
  {
    id: "TR-2026-0306-003",
    fromBranch: "FreshMart Park Slope",
    toBranch: "FreshMart Union Square",
    product: "Fresh Strawberries (16oz)",
    quantity: 30,
    status: "pending",
    requestedBy: "Sarah Mitchell",
    requestedAt: daysAgo(1, 17), // Yesterday 5 PM
    notes: "High demand for weekend smoothie promotion",
  },
  // Approved yesterday, in transit
  {
    id: "TR-2026-0306-001",
    fromBranch: "FreshMart Jersey City",
    toBranch: "FreshMart Park Slope",
    product: "Butter Croissants (4ct)",
    quantity: 20,
    status: "in_transit",
    requestedBy: "Jennifer Williams",
    requestedAt: daysAgo(1, 8),
    respondedBy: "Michael Rodriguez",
    respondedAt: daysAgo(1, 9),
    notes: "Bakery delivery short this morning",
  },
  // Completed transfer from 2 days ago
  {
    id: "TR-2026-0305-002",
    fromBranch: "FreshMart Back Bay",
    toBranch: "FreshMart Rittenhouse",
    product: "Chobani Greek Yogurt (5.3oz)",
    quantity: 48,
    status: "completed",
    requestedBy: "James Patterson",
    requestedAt: daysAgo(2, 11),
    respondedBy: "Emily Thompson",
    respondedAt: daysAgo(2, 13),
    notes: "Yogurt promotion starting tomorrow",
  },
  // Rejected due to low stock
  {
    id: "TR-2026-0305-001",
    fromBranch: "FreshMart Union Square",
    toBranch: "FreshMart Georgetown",
    product: "Atlantic Salmon Fillet (per lb)",
    quantity: 15,
    status: "rejected",
    requestedBy: "Amanda Foster",
    requestedAt: daysAgo(2, 14),
    respondedBy: "Sarah Mitchell",
    respondedAt: daysAgo(2, 16),
    rejectionReason: "Insufficient stock - only 12 lbs available and expecting high weekend demand",
  },
  // Approved waiting for pickup
  {
    id: "TR-2026-0306-002",
    fromBranch: "FreshMart Georgetown",
    toBranch: "FreshMart Union Square",
    product: "Cold Pressed Green Juice (12oz)",
    quantity: 18,
    status: "approved",
    requestedBy: "Sarah Mitchell",
    requestedAt: daysAgo(1, 10),
    respondedBy: "Amanda Foster",
    respondedAt: daysAgo(1, 11),
    notes: "Pickup scheduled for today at 2 PM",
  },
  // Old completed transfer
  {
    id: "TR-2026-0303-001",
    fromBranch: "FreshMart Upper West Side",
    toBranch: "FreshMart Jersey City",
    product: "Organic Free-Range Eggs (18ct)",
    quantity: 24,
    status: "completed",
    requestedBy: "Michael Rodriguez",
    requestedAt: daysAgo(4, 9),
    respondedBy: "David Chen",
    respondedAt: daysAgo(4, 10),
  },
  // Recent pending from this morning
  {
    id: "TR-2026-0307-002",
    fromBranch: "FreshMart Rittenhouse",
    toBranch: "FreshMart Georgetown",
    product: "Artisan Sourdough Loaf",
    quantity: 12,
    status: "pending",
    requestedBy: "Amanda Foster",
    requestedAt: hoursAgo(1), // 8:00 AM today
    notes: "Weekend brunch demand",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// AVAILABLE PRODUCTS FOR TRANSFER - Current availability as of March 7, 2026
// ═══════════════════════════════════════════════════════════════════════════════

export interface TransferableProduct {
  product: string;
  category: string;
  availableStock: number;
  branch: string;
  expiryDays: number;
  unitPrice: number;
}

export const mockTransferableProducts: TransferableProduct[] = [
  // Union Square - Main store
  { product: "Organic Whole Milk (1 Gallon)", category: "Dairy", availableStock: 12, branch: "FreshMart Union Square", expiryDays: 2, unitPrice: 5.99 },
  { product: "Fresh Chicken Breast (per lb)", category: "Meat", availableStock: 38, branch: "FreshMart Union Square", expiryDays: 3, unitPrice: 8.99 },
  { product: "Artisan Sourdough Loaf", category: "Bakery", availableStock: 8, branch: "FreshMart Union Square", expiryDays: 2, unitPrice: 4.99 },
  
  // Upper West Side - Well stocked
  { product: "Organic Whole Milk (1 Gallon)", category: "Dairy", availableStock: 56, branch: "FreshMart Upper West Side", expiryDays: 3, unitPrice: 5.99 },
  { product: "Chobani Greek Yogurt (5.3oz)", category: "Dairy", availableStock: 92, branch: "FreshMart Upper West Side", expiryDays: 14, unitPrice: 1.89 },
  { product: "Organic Free-Range Eggs (18ct)", category: "Poultry", availableStock: 65, branch: "FreshMart Upper West Side", expiryDays: 12, unitPrice: 7.99 },
  
  // Park Slope - Fresh produce focus
  { product: "Fresh Strawberries (16oz)", category: "Produce", availableStock: 52, branch: "FreshMart Park Slope", expiryDays: 4, unitPrice: 5.99 },
  { product: "Organic Baby Spinach (5oz)", category: "Produce", availableStock: 68, branch: "FreshMart Park Slope", expiryDays: 5, unitPrice: 4.99 },
  { product: "Organic Avocados (4ct)", category: "Produce", availableStock: 44, branch: "FreshMart Park Slope", expiryDays: 4, unitPrice: 5.49 },
  
  // Jersey City
  { product: "Butter Croissants (4ct)", category: "Bakery", availableStock: 28, branch: "FreshMart Jersey City", expiryDays: 2, unitPrice: 5.99 },
  { product: "85% Lean Ground Beef (per lb)", category: "Meat", availableStock: 45, branch: "FreshMart Jersey City", expiryDays: 2, unitPrice: 7.49 },
  
  // Boston Back Bay
  { product: "Atlantic Salmon Fillet (per lb)", category: "Meat", availableStock: 32, branch: "FreshMart Back Bay", expiryDays: 2, unitPrice: 12.99 },
  { product: "Chobani Greek Yogurt (5.3oz)", category: "Dairy", availableStock: 78, branch: "FreshMart Back Bay", expiryDays: 10, unitPrice: 1.89 },
  
  // Philadelphia Rittenhouse
  { product: "Artisan Sourdough Loaf", category: "Bakery", availableStock: 22, branch: "FreshMart Rittenhouse", expiryDays: 2, unitPrice: 4.99 },
  { product: "Cold Pressed Green Juice (12oz)", category: "Beverages", availableStock: 45, branch: "FreshMart Rittenhouse", expiryDays: 3, unitPrice: 6.99 },
  
  // Georgetown DC
  { product: "Cold Pressed Green Juice (12oz)", category: "Beverages", availableStock: 38, branch: "FreshMart Georgetown", expiryDays: 4, unitPrice: 6.99 },
  { product: "Tropicana Orange Juice (52oz)", category: "Beverages", availableStock: 64, branch: "FreshMart Georgetown", expiryDays: 12, unitPrice: 4.99 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function getTransfersByBranch(branch: string): {
  incoming: StockTransferRequest[];
  outgoing: StockTransferRequest[];
} {
  return {
    incoming: mockTransferRequests.filter((t) => t.toBranch === branch),
    outgoing: mockTransferRequests.filter((t) => t.fromBranch === branch),
  };
}

export function getPendingTransfersCount(branch: string): number {
  return mockTransferRequests.filter(
    (t) => (t.toBranch === branch || t.fromBranch === branch) && t.status === "pending"
  ).length;
}

export function getBranchContactByName(branchName: string): BranchContact | undefined {
  return mockBranchContacts.find((b) => b.branchName === branchName);
}

export function getNearbyBranches(currentBranch: string, region?: string): BranchContact[] {
  return mockBranchContacts.filter((b) => {
    if (b.branchName === currentBranch) return false;
    if (!b.isActive) return false;
    if (region && b.region !== region) return false;
    return true;
  });
}

// Get branches within the same metro area (simulating proximity)
export function getBranchesInMetro(currentBranch: string): BranchContact[] {
  const currentContact = getBranchContactByName(currentBranch);
  if (!currentContact) return [];
  
  // Group branches by metro area
  const metroAreas: Record<string, string[]> = {
    "New York Metro": ["New York", "Brooklyn", "Jersey City"],
    "Boston Metro": ["Boston"],
    "Philadelphia Metro": ["Philadelphia"],
    "DC Metro": ["Washington DC"],
  };
  
  // Find which metro area the current branch is in
  let currentMetro: string | null = null;
  for (const [metro, cities] of Object.entries(metroAreas)) {
    if (cities.includes(currentContact.city || "")) {
      currentMetro = metro;
      break;
    }
  }
  
  if (!currentMetro) return [];
  
  const metroCities = metroAreas[currentMetro];
  return mockBranchContacts.filter((b) => {
    if (b.branchName === currentBranch) return false;
    if (!b.isActive) return false;
    return metroCities.includes(b.city || "");
  });
}

// Get transfer statistics for dashboard
export function getTransferStats() {
  const stats = {
    pending: mockTransferRequests.filter(t => t.status === "pending").length,
    approved: mockTransferRequests.filter(t => t.status === "approved").length,
    inTransit: mockTransferRequests.filter(t => t.status === "in_transit").length,
    completed: mockTransferRequests.filter(t => t.status === "completed").length,
    rejected: mockTransferRequests.filter(t => t.status === "rejected").length,
    totalThisWeek: mockTransferRequests.filter(t => {
      const daysDiff = (TODAY.getTime() - t.requestedAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length,
  };
  return stats;
}

// Format relative time for display
export function formatRelativeTime(date: Date): string {
  const now = TODAY;
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 60) {
    return diffMins <= 1 ? "Just now" : `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}
