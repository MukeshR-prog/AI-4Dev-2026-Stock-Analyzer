// ═══════════════════════════════════════════════════════════════════════════════
// AI INSIGHTS API - Real-time AI-powered retail insights using Groq
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import {
  getAIDiscountSuggestions,
  getAIReorderSuggestions,
  getAIActionTasks,
  getAIWeeklySummary,
  calculateFinancialImpact,
  getGeneralAIInsight,
  type WeeklyMetrics,
} from "@/lib/groqAI";
import { connectDB } from "@/lib/mongodb";
import Inventory from "@/models/Inventory";
import type { InventoryItem } from "@/data/inventory";

async function getInventoryFromDB(): Promise<InventoryItem[]> {
  await connectDB();
  const items = await Inventory.find({}).lean();
  return items.map((item) => ({
    product: item.productName,
    category: item.category,
    stock: item.stock,
    expiryDays: item.expiryDays,
    salesPerDay: item.salesPerDay,
    sku: item.sku,
    unitPrice: item.unitPrice,
    lastRestocked: item.lastRestocked,
  }));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, branch = "FreshMart Union Square", context } = body;
    const inventory = await getInventoryFromDB();

    switch (type) {
      case "discount": {
        const suggestions = await getAIDiscountSuggestions(inventory);
        return NextResponse.json({ success: true, data: suggestions });
      }

      case "reorder": {
        const suggestions = await getAIReorderSuggestions(inventory);
        return NextResponse.json({ success: true, data: suggestions });
      }

      case "actions": {
        const tasks = await getAIActionTasks(inventory, branch);
        return NextResponse.json({ success: true, data: tasks });
      }

      case "financial": {
        const impacts = calculateFinancialImpact(inventory);
        return NextResponse.json({ success: true, data: impacts });
      }

      case "weekly-summary": {
        const metrics: WeeklyMetrics = context?.metrics || {
          totalWaste: 47,
          wasteValue: 284.53,
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
        const summary = await getAIWeeklySummary(metrics, branch);
        return NextResponse.json({ success: true, data: summary });
      }

      case "general": {
        const insight = await getGeneralAIInsight(context?.prompt || "", context?.additionalContext);
        return NextResponse.json({ success: true, data: { insight } });
      }

      default:
        return NextResponse.json(
          { success: false, error: "Invalid insight type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("AI Insights API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "financial";
  const branch = searchParams.get("branch") || "FreshMart Union Square";

  try {
    const inventory = await getInventoryFromDB();

    switch (type) {
      case "financial": {
        const impacts = calculateFinancialImpact(inventory);
        return NextResponse.json({ success: true, data: impacts });
      }

      case "discount": {
        const suggestions = await getAIDiscountSuggestions(inventory);
        return NextResponse.json({ success: true, data: suggestions });
      }

      case "reorder": {
        const suggestions = await getAIReorderSuggestions(inventory);
        return NextResponse.json({ success: true, data: suggestions });
      }

      case "actions": {
        const tasks = await getAIActionTasks(inventory, branch);
        return NextResponse.json({ success: true, data: tasks });
      }

      default:
        return NextResponse.json(
          { success: false, error: "Invalid insight type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("AI Insights API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
