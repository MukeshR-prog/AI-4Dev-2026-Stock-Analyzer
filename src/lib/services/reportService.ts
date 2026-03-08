// ── Report Service ──
// Generates weekly performance reports using engines + AI.

import { connectDB } from "@/lib/mongodb";
import WasteReport, { type IWasteReport } from "@/models/WasteReport";
import Branch from "@/models/Branch";
import { mockInventory } from "@/data/inventory";
import { generateRecommendations, getMockInventory, getMockBranchDemand } from "@/lib/recommendationEngine";
import { buildWasteProjections, calculateImpactTotals } from "@/lib/wasteSimulation";
import { calculateFinancialImpact, getAIWeeklySummary } from "@/lib/groqAI";
import type { WeeklyMetrics } from "@/lib/groqAI";

// ── Weekly report ──

export async function getWeeklyReport(branchName?: string): Promise<{
  metrics: WeeklyMetrics;
  wasteProjections: ReturnType<typeof buildWasteProjections>;
  financialImpacts: ReturnType<typeof calculateFinancialImpact>;
  aiSummary: { insight: string; recommendations: string[]; confidence: number } | null;
}> {
  const branch = branchName || "FreshMart Union Square";

  // 1. Build waste projections using existing engines
  const inventory = getMockInventory(branch);
  const demand = getMockBranchDemand(branch);
  const recommendations = generateRecommendations(inventory, demand);
  const projections = buildWasteProjections(inventory, recommendations);
  const totals = calculateImpactTotals(projections);

  // 2. Financial impacts
  const financialImpacts = calculateFinancialImpact(mockInventory);

  // 3. Build metrics
  const metrics: WeeklyMetrics = {
    totalWaste: totals.totalWasteBefore,
    wasteValue: financialImpacts.reduce((sum, f) => sum + f.estimatedLoss, 0),
    inventoryTurnover: 2.8,
    transfersCompleted: 12,
    transfersPending: 3,
    topSellingProducts: [
      { product: "Organic Whole Milk (1 Gallon)", units: 126 },
      { product: "Fresh Chicken Breast (per lb)", units: 175 },
      { product: "Chobani Greek Yogurt (5.3oz)", units: 105 },
      { product: "Artisan Sourdough Loaf", units: 98 },
      { product: "Organic Free-Range Eggs (18ct)", units: 112 },
    ],
    slowMovingProducts: [
      { product: "Kombucha Variety Pack (6ct)", units: 6, daysOnShelf: 12 },
      { product: "Sir Kensington's Mayo (10oz)", units: 8, daysOnShelf: 9 },
      { product: "Bonne Maman Strawberry Jam (13oz)", units: 5, daysOnShelf: 11 },
    ],
  };

  // 4. AI summary
  let aiSummary = null;
  try {
    aiSummary = await getAIWeeklySummary(metrics, branch);
  } catch {
    // AI unavailable — return null
  }

  return { metrics, wasteProjections: projections, financialImpacts, aiSummary };
}

// ── Persist a weekly report snapshot ──

export async function saveWeeklyReport(branchName: string) {
  await connectDB();

  const branch = await Branch.findOne({ branchName });
  if (!branch) throw new Error("Branch not found");

  const { metrics, wasteProjections, financialImpacts } = await getWeeklyReport(branchName);

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  const doc = await WasteReport.create({
    branch: branch._id,
    branchName,
    weekStartDate: weekStart,
    weekEndDate: now,
    totalWasteUnits: metrics.totalWaste,
    totalWasteValue: metrics.wasteValue,
    totalSavedUnits: wasteProjections.reduce((s, p) => s + p.savedUnits, 0),
    totalSavedValue: wasteProjections.reduce((s, p) => s + p.savedUnits * 5, 0),
    reductionPercent: 0,
    inventoryTurnover: metrics.inventoryTurnover,
    transfersCompleted: metrics.transfersCompleted,
    transfersPending: metrics.transfersPending,
    productBreakdown: wasteProjections.map((p) => ({
      product: p.product,
      wastedUnits: p.predictedWasteBefore,
      wastedValue: p.predictedWasteBefore * 5,
      savedUnits: p.savedUnits,
    })),
    topSellingProducts: metrics.topSellingProducts,
    slowMovingProducts: metrics.slowMovingProducts,
  });

  return doc.toObject();
}

// ── Get historical reports ──

export async function getHistoricalReports(branchName?: string, limit: number = 4) {
  await connectDB();

  const query: Record<string, unknown> = {};
  if (branchName) query.branchName = branchName;

  return WasteReport.find(query)
    .sort({ weekEndDate: -1 })
    .limit(limit)
    .lean<IWasteReport[]>();
}
