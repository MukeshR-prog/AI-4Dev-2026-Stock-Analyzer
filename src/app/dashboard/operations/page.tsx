"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  TrendingDown,
  Tag,
  Package,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  DollarSign,
  Sparkles,
  ChevronRight,
  BarChart3,
  Truck,
  Trash2,
  ShoppingCart,
  Brain,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  ActionItem,
  DiscountSuggestion,
  ReorderSuggestion,
  FinancialImpact,
  WeeklyMetrics,
  AIInsightResponse,
} from "@/lib/groqAI";

// ═══════════════════════════════════════════════════════════════════════════════
// PRIORITY BADGE
// ═══════════════════════════════════════════════════════════════════════════════

function PriorityBadge({ priority }: { priority: "critical" | "high" | "medium" | "low" }) {
  const config = {
    critical: { color: "bg-red-100 text-red-700 border-red-200", icon: AlertTriangle },
    high: { color: "bg-orange-100 text-orange-700 border-orange-200", icon: AlertTriangle },
    medium: { color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
    low: { color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
  };
  const { color, icon: Icon } = config[priority];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${color}`}>
      <Icon className="h-3 w-3" />
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTION TASK CARD
// ═══════════════════════════════════════════════════════════════════════════════

function ActionTaskCard({ task, onComplete }: { task: ActionItem; onComplete: (id: string) => void }) {
  const typeIcons = {
    move: Package,
    transfer: Truck,
    reorder: ShoppingCart,
    discount: Tag,
    review: ClipboardList,
  };
  const Icon = typeIcons[task.type] || ClipboardList;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-4 shadow-2xs hover:shadow-xs transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            task.priority === "critical" ? "bg-red-100" :
            task.priority === "high" ? "bg-orange-100" :
            task.priority === "medium" ? "bg-yellow-100" : "bg-green-100"
          }`}>
            <Icon className={`h-5 w-5 ${
              task.priority === "critical" ? "text-red-600" :
              task.priority === "high" ? "text-orange-600" :
              task.priority === "medium" ? "text-yellow-600" : "text-green-600"
            }`} />
          </div>
          <div>
            <p className="font-medium text-foreground">{task.product}</p>
            <p className="mt-1 text-sm text-muted-foreground">{task.action}</p>
          </div>
        </div>
        <PriorityBadge priority={task.priority} />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {task.deadline}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5" />
            {task.estimatedImpact}
          </span>
        </div>
        <button
          onClick={() => onComplete(task.id)}
          className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Complete
        </button>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DISCOUNT SUGGESTION CARD
// ═══════════════════════════════════════════════════════════════════════════════

function DiscountCard({ suggestion }: { suggestion: DiscountSuggestion }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-4 shadow-2xs"
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-foreground">{suggestion.product}</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {suggestion.currentStock} units • Expires in {suggestion.expiryDays} day{suggestion.expiryDays !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground line-through">${suggestion.currentPrice.toFixed(2)}</span>
            <span className="text-lg font-bold text-green-600">${suggestion.suggestedPrice.toFixed(2)}</span>
          </div>
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            -{suggestion.suggestedDiscount}% off
          </span>
        </div>
      </div>
      <div className="mt-3 rounded-lg bg-muted/50 p-3">
        <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
        <p className="mt-2 text-sm font-medium text-primary">
          Expected sales increase: +{suggestion.expectedSalesIncrease}%
        </p>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// REORDER SUGGESTION CARD
// ═══════════════════════════════════════════════════════════════════════════════

function ReorderCard({ suggestion }: { suggestion: ReorderSuggestion }) {
  const urgencyColors = {
    urgent: "bg-red-100 text-red-700 border-red-200",
    soon: "bg-yellow-100 text-yellow-700 border-yellow-200",
    planned: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-4 shadow-2xs"
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-foreground">{suggestion.product}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{suggestion.reasoning}</p>
        </div>
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${urgencyColors[suggestion.urgency]}`}>
          {suggestion.urgency.charAt(0).toUpperCase() + suggestion.urgency.slice(1)}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-xs text-muted-foreground">Current</p>
          <p className="text-lg font-bold text-foreground">{suggestion.currentStock}</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-xs text-muted-foreground">3-Day Demand</p>
          <p className="text-lg font-bold text-foreground">{suggestion.expectedDemand}</p>
        </div>
        <div className="rounded-lg bg-primary/10 p-2">
          <p className="text-xs text-primary">Reorder</p>
          <p className="text-lg font-bold text-primary">{suggestion.reorderQuantity}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FINANCIAL IMPACT CARD
// ═══════════════════════════════════════════════════════════════════════════════

function FinancialImpactCard({ impact }: { impact: FinancialImpact }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-4 shadow-2xs"
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-foreground">{impact.product}</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {impact.currentStock} units @ ${impact.unitPrice.toFixed(2)} each
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Potential Loss</p>
          <p className="text-xl font-bold text-red-600">${impact.estimatedLoss.toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Trash2 className="h-4 w-4" />
          {impact.predictedUnsold} unsold
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-4 w-4" />
          {impact.daysRemaining} day{impact.daysRemaining !== 1 ? "s" : ""} left
        </span>
      </div>
      <div className="mt-3 rounded-lg bg-primary/5 border border-primary/20 p-3">
        <p className="text-sm text-primary flex items-start gap-2">
          <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
          {impact.mitigationStrategy}
        </p>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WEEKLY SUMMARY SECTION
// ═══════════════════════════════════════════════════════════════════════════════

function WeeklySummarySection({ 
  metrics, 
  aiSummary,
  isLoading 
}: { 
  metrics: WeeklyMetrics; 
  aiSummary: AIInsightResponse | null;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Waste</p>
                <p className="text-2xl font-bold text-foreground">{metrics.totalWaste} units</p>
                <p className="text-sm text-red-600">${metrics.wasteValue.toFixed(2)} lost</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inventory Turnover</p>
                <p className="text-2xl font-bold text-foreground">{metrics.inventoryTurnover.toFixed(1)}x</p>
                <p className="text-sm text-green-600">+0.3 vs last week</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <RefreshCw className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transfers</p>
                <p className="text-2xl font-bold text-foreground">{metrics.transfersCompleted}</p>
                <p className="text-sm text-yellow-600">{metrics.transfersPending} pending</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Top Product</p>
                <p className="text-lg font-bold text-foreground truncate max-w-[140px]">
                  {metrics.topSellingProducts[0]?.product.split(" ")[0]}
                </p>
                <p className="text-sm text-primary">{metrics.topSellingProducts[0]?.units} units</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            AI Weekly Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-3 py-8">
              <RefreshCw className="h-5 w-5 animate-spin text-primary" />
              <span className="text-muted-foreground">Generating AI insights...</span>
            </div>
          ) : aiSummary ? (
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">{aiSummary.insight}</p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Recommendations:</p>
                <ul className="space-y-1">
                  {aiSummary.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">Confidence:</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${(aiSummary.confidence || 0.75) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-foreground">
                  {Math.round((aiSummary.confidence || 0.75) * 100)}%
                </span>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground py-4">Click refresh to generate AI analysis</p>
          )}
        </CardContent>
      </Card>

      {/* Top & Slow Products */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.topSellingProducts.map((product, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground">{product.product}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{product.units} units</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Slow Moving Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.slowMovingProducts.map((product, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-xs font-medium text-yellow-700">
                      !
                    </span>
                    <span className="text-sm text-foreground">{product.product}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{product.daysOnShelf} days</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function OperationsPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("tasks");
  const [isLoading, setIsLoading] = useState(false);
  const [actionTasks, setActionTasks] = useState<ActionItem[]>([]);
  const [discountSuggestions, setDiscountSuggestions] = useState<DiscountSuggestion[]>([]);
  const [reorderSuggestions, setReorderSuggestions] = useState<ReorderSuggestion[]>([]);
  const [financialImpacts, setFinancialImpacts] = useState<FinancialImpact[]>([]);
  const [aiSummary, setAiSummary] = useState<AIInsightResponse | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  // Weekly metrics (would come from API in production)
  const weeklyMetrics: WeeklyMetrics = useMemo(() => ({
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
  }), []);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const branch = profile?.branch || "FreshMart Union Square";
        
        switch (activeTab) {
          case "tasks": {
            const res = await fetch(`/api/ai-insights?type=actions&branch=${encodeURIComponent(branch)}`);
            const data = await res.json();
            if (data.success) setActionTasks(data.data);
            break;
          }
          case "discounts": {
            const res = await fetch("/api/ai-insights?type=discount");
            const data = await res.json();
            if (data.success) setDiscountSuggestions(data.data);
            break;
          }
          case "reorder": {
            const res = await fetch("/api/ai-insights?type=reorder");
            const data = await res.json();
            if (data.success) setReorderSuggestions(data.data);
            break;
          }
          case "financial": {
            const res = await fetch("/api/ai-insights?type=financial");
            const data = await res.json();
            if (data.success) setFinancialImpacts(data.data);
            break;
          }
          case "weekly": {
            const res = await fetch("/api/ai-insights", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                type: "weekly-summary", 
                branch: profile?.branch,
                context: { metrics: weeklyMetrics }
              }),
            });
            const data = await res.json();
            if (data.success) setAiSummary(data.data);
            break;
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, profile?.branch, weeklyMetrics]);

  const handleCompleteTask = (taskId: string) => {
    setCompletedTasks(prev => new Set([...prev, taskId]));
  };

  const activeTasks = actionTasks.filter(t => !completedTasks.has(t.id));
  const criticalCount = activeTasks.filter(t => t.priority === "critical").length;
  const highCount = activeTasks.filter(t => t.priority === "high").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Operations Center</h1>
          <p className="text-sm text-muted-foreground">
            AI-powered operational insights for {profile?.branch || "your store"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
              <AlertTriangle className="h-4 w-4" />
              {criticalCount} Critical
            </span>
          )}
          {highCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
              {highCount} High Priority
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tasks" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="tasks" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="discounts" className="gap-2">
            <Tag className="h-4 w-4" />
            <span className="hidden sm:inline">Discounts</span>
          </TabsTrigger>
          <TabsTrigger value="reorder" className="gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Reorder</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="gap-2">
            <TrendingDown className="h-4 w-4" />
            <span className="hidden sm:inline">Financial</span>
          </TabsTrigger>
          <TabsTrigger value="weekly" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Weekly</span>
          </TabsTrigger>
        </TabsList>

        {/* Staff Action Tasks */}
        <TabsContent value="tasks" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Today&apos;s Action Items</h2>
              <span className="text-sm text-muted-foreground">
                {activeTasks.length} pending • {completedTasks.size} completed
              </span>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : activeTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
                <p className="text-lg font-medium text-foreground">All caught up!</p>
                <p className="text-sm text-muted-foreground">No pending action items</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {activeTasks.map((task) => (
                    <ActionTaskCard
                      key={task.id}
                      task={task}
                      onComplete={handleCompleteTask}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Discount Suggestions */}
        <TabsContent value="discounts" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Smart Discount Suggestions</h2>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-primary" />
                AI-powered pricing
              </span>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : discountSuggestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Tag className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-lg font-medium text-foreground">No discount suggestions</p>
                <p className="text-sm text-muted-foreground">All products are within safe expiry windows</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {discountSuggestions.map((suggestion, i) => (
                  <DiscountCard key={i} suggestion={suggestion} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Reorder Suggestions */}
        <TabsContent value="reorder" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Demand-Based Reorder Suggestions</h2>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Brain className="h-4 w-4 text-primary" />
                Forecasted demand
              </span>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : reorderSuggestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-lg font-medium text-foreground">Stock levels healthy</p>
                <p className="text-sm text-muted-foreground">No immediate reorder needed</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {reorderSuggestions.map((suggestion, i) => (
                  <ReorderCard key={i} suggestion={suggestion} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Financial Impact */}
        <TabsContent value="financial" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Expiry Risk Financial Impact</h2>
              <span className="text-sm text-red-600 font-medium">
                Total at risk: ${financialImpacts.reduce((sum, i) => sum + i.estimatedLoss, 0).toFixed(2)}
              </span>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : financialImpacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <DollarSign className="h-12 w-12 text-green-500 mb-3" />
                <p className="text-lg font-medium text-foreground">No financial risk</p>
                <p className="text-sm text-muted-foreground">All inventory is on track to sell before expiry</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {financialImpacts.map((impact, i) => (
                  <FinancialImpactCard key={i} impact={impact} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Weekly Summary */}
        <TabsContent value="weekly" className="mt-6">
          <WeeklySummarySection
            metrics={weeklyMetrics}
            aiSummary={aiSummary}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
