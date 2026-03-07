// ═══════════════════════════════════════════════════════════════════════════════
// GROQ AI SERVICE - Real-time AI Insights for Retail Intelligence
// ═══════════════════════════════════════════════════════════════════════════════

import type { InventoryItem } from "@/data/inventory";
import type { BranchContact, StockTransferRequest } from "@/types";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface AIInsightRequest {
  type: "discount" | "reorder" | "action" | "summary" | "financial" | "general";
  context: {
    inventory?: InventoryItem[];
    product?: InventoryItem;
    branch?: string;
    transfers?: StockTransferRequest[];
    contacts?: BranchContact[];
    weeklyData?: WeeklyMetrics;
  };
}

export interface WeeklyMetrics {
  totalWaste: number;
  wasteValue: number;
  inventoryTurnover: number;
  transfersCompleted: number;
  transfersPending: number;
  topSellingProducts: { product: string; units: number }[];
  slowMovingProducts: { product: string; units: number; daysOnShelf: number }[];
}

export interface AIInsightResponse {
  insight: string;
  recommendations: string[];
  confidence: number;
  actionItems?: ActionItem[];
}

export interface ActionItem {
  id: string;
  type: "move" | "transfer" | "reorder" | "discount" | "review";
  priority: "critical" | "high" | "medium" | "low";
  product: string;
  action: string;
  deadline: string;
  estimatedImpact: string;
}

export interface DiscountSuggestion {
  product: string;
  currentPrice: number;
  suggestedDiscount: number;
  suggestedPrice: number;
  expiryDays: number;
  currentStock: number;
  expectedSalesIncrease: number;
  reasoning: string;
}

export interface ReorderSuggestion {
  product: string;
  currentStock: number;
  expectedDemand: number;
  reorderQuantity: number;
  urgency: "urgent" | "soon" | "planned";
  reasoning: string;
}

export interface FinancialImpact {
  product: string;
  currentStock: number;
  predictedUnsold: number;
  unitPrice: number;
  estimatedLoss: number;
  daysRemaining: number;
  mitigationStrategy: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GROQ API CLIENT
// ═══════════════════════════════════════════════════════════════════════════════

async function callGroqAPI(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 1024
): Promise<string> {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
        top_p: 1,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Failed to call Groq API:", error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI-POWERED DISCOUNT SUGGESTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAIDiscountSuggestions(
  inventory: InventoryItem[]
): Promise<DiscountSuggestion[]> {
  const nearExpiryItems = inventory.filter((item) => item.expiryDays <= 3);
  
  if (nearExpiryItems.length === 0) {
    return [];
  }

  const systemPrompt = `You are a retail pricing strategist AI. Analyze near-expiry products and suggest optimal discount strategies to maximize sales while minimizing waste. Consider:
- Days until expiry
- Current stock levels
- Typical sales velocity
- Price elasticity for grocery items

Return JSON array with this exact structure:
[{
  "product": "string",
  "currentPrice": number,
  "suggestedDiscount": number (percentage 0-50),
  "suggestedPrice": number,
  "expiryDays": number,
  "currentStock": number,
  "expectedSalesIncrease": number (percentage),
  "reasoning": "string"
}]`;

  const userPrompt = `Analyze these near-expiry products and suggest discount strategies:

${JSON.stringify(nearExpiryItems.map(item => ({
  product: item.product,
  stock: item.stock,
  expiryDays: item.expiryDays,
  salesPerDay: item.salesPerDay,
  unitPrice: item.unitPrice || 5.99
})), null, 2)}

Provide discount suggestions for each product to maximize sales before expiry.`;

  try {
    const response = await callGroqAPI(systemPrompt, userPrompt);
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error("Failed to get discount suggestions:", error);
    // Fallback to rule-based suggestions
    return nearExpiryItems.map(item => ({
      product: item.product,
      currentPrice: item.unitPrice || 5.99,
      suggestedDiscount: item.expiryDays <= 1 ? 40 : item.expiryDays <= 2 ? 25 : 15,
      suggestedPrice: (item.unitPrice || 5.99) * (1 - (item.expiryDays <= 1 ? 0.4 : item.expiryDays <= 2 ? 0.25 : 0.15)),
      expiryDays: item.expiryDays,
      currentStock: item.stock,
      expectedSalesIncrease: item.expiryDays <= 1 ? 150 : item.expiryDays <= 2 ? 80 : 40,
      reasoning: `${item.expiryDays} day(s) until expiry with ${item.stock} units remaining. Discount will accelerate sales.`
    }));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI-POWERED REORDER SUGGESTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAIReorderSuggestions(
  inventory: InventoryItem[],
  dayOfWeek: number = new Date().getDay()
): Promise<ReorderSuggestion[]> {
  const lowStockItems = inventory.filter((item) => {
    const daysOfStock = item.salesPerDay > 0 ? item.stock / item.salesPerDay : Infinity;
    return daysOfStock < 3;
  });

  if (lowStockItems.length === 0) {
    return [];
  }

  const systemPrompt = `You are a retail inventory forecasting AI. Analyze low-stock products and suggest reorder quantities based on:
- Current stock levels
- Historical sales velocity  
- Day of week patterns (weekends typically have 30-40% higher sales)
- Buffer stock requirements (typically 2-3 days)

Current day: ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeek]}

Return JSON array with this exact structure:
[{
  "product": "string",
  "currentStock": number,
  "expectedDemand": number (next 3 days),
  "reorderQuantity": number,
  "urgency": "urgent" | "soon" | "planned",
  "reasoning": "string"
}]`;

  const userPrompt = `Analyze these low-stock products and suggest reorder quantities:

${JSON.stringify(lowStockItems.map(item => ({
  product: item.product,
  stock: item.stock,
  salesPerDay: item.salesPerDay,
  category: item.category
})), null, 2)}

Consider weekend demand patterns if applicable.`;

  try {
    const response = await callGroqAPI(systemPrompt, userPrompt);
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error("Failed to get reorder suggestions:", error);
    // Fallback to rule-based suggestions
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
    const demandMultiplier = isWeekend ? 1.35 : 1.0;
    
    return lowStockItems.map(item => {
      const expectedDemand = Math.round(item.salesPerDay * 3 * demandMultiplier);
      const daysOfStock = item.stock / item.salesPerDay;
      return {
        product: item.product,
        currentStock: item.stock,
        expectedDemand,
        reorderQuantity: Math.max(0, expectedDemand - item.stock + Math.round(item.salesPerDay * 2)),
        urgency: daysOfStock < 1 ? "urgent" : daysOfStock < 2 ? "soon" : "planned",
        reasoning: `Current stock covers ${daysOfStock.toFixed(1)} days. Expected 3-day demand: ${expectedDemand} units.`
      };
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI-POWERED STAFF ACTION TASKS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAIActionTasks(
  inventory: InventoryItem[],
  branch: string
): Promise<ActionItem[]> {
  const systemPrompt = `You are a retail operations AI assistant. Convert inventory data into specific, actionable tasks for store staff. Tasks should be:
- Clear and specific
- Time-bound  
- Prioritized by business impact
- Focused on reducing waste and maximizing sales

Task types: move (shelf reorganization), transfer (inter-store), reorder (from supplier), discount (pricing), review (check stock)

Return JSON array with this exact structure:
[{
  "id": "string",
  "type": "move" | "transfer" | "reorder" | "discount" | "review",
  "priority": "critical" | "high" | "medium" | "low",
  "product": "string",
  "action": "string (specific actionable instruction)",
  "deadline": "string (e.g., 'Today by 2 PM', 'Tomorrow morning')",
  "estimatedImpact": "string (e.g., 'Prevent $150 waste', 'Increase sales 30%')"
}]`;

  const userPrompt = `Generate actionable staff tasks for ${branch} based on this inventory:

${JSON.stringify(inventory.slice(0, 15).map(item => ({
  product: item.product,
  stock: item.stock,
  expiryDays: item.expiryDays,
  salesPerDay: item.salesPerDay,
  unitPrice: item.unitPrice || 5.99
})), null, 2)}

Focus on:
1. Products expiring within 2 days (critical)
2. Products with excess stock vs demand
3. Products running low
4. Products needing price adjustments`;

  try {
    const response = await callGroqAPI(systemPrompt, userPrompt, 1500);
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error("Failed to get action tasks:", error);
    // Fallback to rule-based tasks
    return generateFallbackActionTasks(inventory);
  }
}

function generateFallbackActionTasks(inventory: InventoryItem[]): ActionItem[] {
  const tasks: ActionItem[] = [];
  let id = 1;

  for (const item of inventory) {
    const daysToSell = item.salesPerDay > 0 ? item.stock / item.salesPerDay : Infinity;
    const expectedSales = Math.round(item.salesPerDay * item.expiryDays);
    const surplus = Math.max(0, item.stock - expectedSales);

    // Critical: Expires tomorrow
    if (item.expiryDays <= 1 && item.stock > 0) {
      tasks.push({
        id: `task-${id++}`,
        type: "discount",
        priority: "critical",
        product: item.product,
        action: `Apply 40% discount to ${item.stock} units of ${item.product}. Move to clearance section.`,
        deadline: "Today by 10 AM",
        estimatedImpact: `Prevent $${((item.unitPrice || 5.99) * surplus).toFixed(2)} waste`
      });
    }
    // High: Expires in 2 days
    else if (item.expiryDays <= 2 && surplus > 5) {
      tasks.push({
        id: `task-${id++}`,
        type: "move",
        priority: "high",
        product: item.product,
        action: `Move ${item.product} to front display. Apply 25% discount sticker.`,
        deadline: "Today by 2 PM",
        estimatedImpact: `Sell ${surplus} units before expiry`
      });
    }
    // Low stock
    if (daysToSell < 1.5) {
      tasks.push({
        id: `task-${id++}`,
        type: "reorder",
        priority: daysToSell < 0.5 ? "high" : "medium",
        product: item.product,
        action: `Reorder ${Math.round(item.salesPerDay * 5)} units of ${item.product}. Current stock covers ${daysToSell.toFixed(1)} days.`,
        deadline: daysToSell < 0.5 ? "Today" : "Tomorrow morning",
        estimatedImpact: "Prevent stockout"
      });
    }
  }

  return tasks.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  }).slice(0, 10);
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI-POWERED WEEKLY SUMMARY
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAIWeeklySummary(
  metrics: WeeklyMetrics,
  branch: string
): Promise<AIInsightResponse> {
  const systemPrompt = `You are a retail analytics AI. Generate an executive summary for a branch manager reviewing their weekly performance. Be concise, actionable, and focus on:
- Key wins and improvements
- Areas needing attention
- Specific recommendations for next week

Return JSON with this structure:
{
  "insight": "string (2-3 sentence summary)",
  "recommendations": ["string", "string", "string"],
  "confidence": number (0.0-1.0),
  "actionItems": [{
    "id": "string",
    "type": "move" | "transfer" | "reorder" | "discount" | "review",
    "priority": "critical" | "high" | "medium" | "low",
    "product": "string or 'General'",
    "action": "string",
    "deadline": "string",
    "estimatedImpact": "string"
  }]
}`;

  const userPrompt = `Generate weekly performance summary for ${branch}:

Weekly Metrics:
- Total Waste: ${metrics.totalWaste} units ($${metrics.wasteValue.toFixed(2)})
- Inventory Turnover: ${metrics.inventoryTurnover.toFixed(2)}x
- Transfers Completed: ${metrics.transfersCompleted}
- Transfers Pending: ${metrics.transfersPending}

Top Selling Products:
${metrics.topSellingProducts.map(p => `- ${p.product}: ${p.units} units`).join('\n')}

Slow Moving Products:
${metrics.slowMovingProducts.map(p => `- ${p.product}: ${p.units} units (${p.daysOnShelf} days on shelf)`).join('\n')}

Provide actionable insights and recommendations.`;

  try {
    const response = await callGroqAPI(systemPrompt, userPrompt, 1500);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Failed to get weekly summary:", error);
    // Fallback response
    return {
      insight: `This week, ${branch} processed ${metrics.transfersCompleted} transfers and experienced ${metrics.totalWaste} units of waste ($${metrics.wasteValue.toFixed(2)}). Inventory turnover was ${metrics.inventoryTurnover.toFixed(2)}x.`,
      recommendations: [
        metrics.totalWaste > 20 ? "Focus on reducing waste through earlier discounting" : "Maintain current waste prevention practices",
        metrics.transfersPending > 0 ? `Process ${metrics.transfersPending} pending transfers to optimize stock` : "Transfer pipeline is clear",
        "Review slow-moving products for potential markdowns"
      ],
      confidence: 0.75,
      actionItems: []
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FINANCIAL IMPACT ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

export function calculateFinancialImpact(inventory: InventoryItem[]): FinancialImpact[] {
  const impacts: FinancialImpact[] = [];

  for (const item of inventory) {
    const expectedSales = Math.round(item.salesPerDay * item.expiryDays);
    const predictedUnsold = Math.max(0, item.stock - expectedSales);
    
    if (predictedUnsold > 0) {
      const unitPrice = item.unitPrice || 5.99;
      const estimatedLoss = predictedUnsold * unitPrice;
      
      let mitigationStrategy: string;
      if (item.expiryDays <= 1) {
        mitigationStrategy = "Apply 40% discount immediately and move to clearance section";
      } else if (item.expiryDays <= 2) {
        mitigationStrategy = "Apply 25% discount and feature in promotional display";
      } else if (item.expiryDays <= 3) {
        mitigationStrategy = "Consider transferring to high-demand branch or apply 15% discount";
      } else {
        mitigationStrategy = "Monitor closely; schedule review in 2 days";
      }

      impacts.push({
        product: item.product,
        currentStock: item.stock,
        predictedUnsold,
        unitPrice,
        estimatedLoss,
        daysRemaining: item.expiryDays,
        mitigationStrategy
      });
    }
  }

  return impacts.sort((a, b) => b.estimatedLoss - a.estimatedLoss);
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERAL AI INSIGHT (for any context)
// ═══════════════════════════════════════════════════════════════════════════════

export async function getGeneralAIInsight(
  prompt: string,
  context?: string
): Promise<string> {
  const systemPrompt = `You are a retail intelligence AI assistant helping supermarket branch managers make better operational decisions. Be concise, practical, and focus on actionable advice. ${context || ""}`;
  
  try {
    return await callGroqAPI(systemPrompt, prompt, 500);
  } catch (error) {
    console.error("Failed to get AI insight:", error);
    return "Unable to generate insight at this time. Please try again.";
  }
}
