"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import RecommendationCard from "@/components/RecommendationCard";
import RecommendationSummary from "@/components/RecommendationSummary";
import InsightCard from "@/components/InsightCard";
import {
  getMockInventory,
  getMockBranchDemand,
  generateRecommendations,
} from "@/lib/recommendationEngine";
import { generateRecommendationInsights } from "@/lib/insightEngine";
import { BrainCircuit, Milk, Croissant, Coffee, Drumstick, Egg, Package, Filter, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// Category definitions with icons and colors
const categoryConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  Dairy: { icon: Milk, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  Bakery: { icon: Croissant, color: "text-amber-600", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
  Beverages: { icon: Coffee, color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
  Meat: { icon: Drumstick, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
  Poultry: { icon: Egg, color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
  Other: { icon: Package, color: "text-gray-600", bgColor: "bg-gray-100 dark:bg-gray-900/30" },
};

// Map products to categories
const productCategoryMap: Record<string, string> = {
  "Milk (1L)": "Dairy",
  "Yogurt (200g)": "Dairy",
  "Paneer (200g)": "Dairy",
  "Butter (100g)": "Dairy",
  "Cheese Slices": "Dairy",
  "Curd (400g)": "Dairy",
  "Bread (White)": "Bakery",
  "Croissant": "Bakery",
  "Fresh Juice (500ml)": "Beverages",
  "Chicken Sausage": "Meat",
  "Eggs (12 pack)": "Poultry",
  "Mixed Fruit Jam": "Other",
};

function getProductCategory(productName: string): string {
  return productCategoryMap[productName] || "Other";
}

export default function RecommendationsPage() {
  const { profile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const { recommendations, insights } = useMemo(() => {
    if (!profile) return { recommendations: [], insights: [] };
    const inventory = getMockInventory(profile.branch);
    const demand = getMockBranchDemand(profile.branch);
    const recs = generateRecommendations(inventory, demand);
    const ins = generateRecommendationInsights(recs, inventory, demand);
    return { recommendations: recs, insights: ins };
  }, [profile]);

  // Add category to each recommendation
  const recommendationsWithCategory = useMemo(() => {
    return recommendations.map((rec) => ({
      ...rec,
      category: getProductCategory(rec.product),
    }));
  }, [recommendations]);

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    recommendationsWithCategory.forEach((rec) => {
      counts[rec.category] = (counts[rec.category] || 0) + 1;
    });
    return counts;
  }, [recommendationsWithCategory]);

  // Get priority counts
  const priorityCounts = useMemo(() => {
    const counts: Record<string, number> = { high: 0, medium: 0, low: 0 };
    recommendationsWithCategory.forEach((rec) => {
      counts[rec.priority] = (counts[rec.priority] || 0) + 1;
    });
    return counts;
  }, [recommendationsWithCategory]);

  // Filter recommendations based on selected category and priority
  const filteredRecommendations = useMemo(() => {
    return recommendationsWithCategory.filter((rec) => {
      if (selectedCategory && rec.category !== selectedCategory) return false;
      if (selectedPriority && rec.priority !== selectedPriority) return false;
      return true;
    });
  }, [recommendationsWithCategory, selectedCategory, selectedPriority]);

  if (!profile) return null;

  const highPriority = recommendations.filter((r) => r.priority === "high").length;
  const wasteReduction = recommendations.reduce((sum, r) => sum + r.units, 0);
  const availableCategories = Object.keys(categoryCounts);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedPriority(null);
  };

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Recommendations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile.company} &mdash;{" "}
          <span className="font-medium text-foreground">{profile.branch}</span>
        </p>
      </div>

      {/* ── Summary KPI Cards ── */}
      <RecommendationSummary
        total={recommendations.length}
        highPriority={highPriority}
        wasteReduction={wasteReduction}
      />

      {/* ── Info Banner ── */}
      <div className="rounded-2xl border border-primary/20 bg-primary/10 px-5 py-4">
        <p className="text-sm text-foreground">
          <span className="font-semibold">Smart Insights:</span> These recommendations are
          generated by cross-referencing your store&apos;s expiry data with demand patterns
          from other <strong>{profile.company}</strong> branches.
        </p>
      </div>

      {/* ── Categories Section ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="h-4 w-4 text-primary" />
              Filter by Category & Priority
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category Filters */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">CATEGORIES</p>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((category) => {
                  const config = categoryConfig[category] || categoryConfig.Other;
                  const IconComponent = config.icon;
                  const isSelected = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(isSelected ? null : category)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? `${config.bgColor} ${config.color} ring-2 ring-offset-1 ring-primary/30`
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      {category}
                      <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                        {categoryCounts[category]}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority Filters */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">PRIORITY LEVEL</p>
              <div className="flex flex-wrap gap-2">
                {(["high", "medium", "low"] as const).map((priority) => {
                  const isSelected = selectedPriority === priority;
                  const priorityConfig = {
                    high: { color: "text-destructive", bgColor: "bg-destructive/10", ring: "ring-destructive/30" },
                    medium: { color: "text-chart-4", bgColor: "bg-chart-4/10", ring: "ring-chart-4/30" },
                    low: { color: "text-chart-2", bgColor: "bg-chart-2/10", ring: "ring-chart-2/30" },
                  };
                  const config = priorityConfig[priority];
                  return (
                    <button
                      key={priority}
                      onClick={() => setSelectedPriority(isSelected ? null : priority)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                        isSelected
                          ? `${config.bgColor} ${config.color} ring-2 ring-offset-1 ${config.ring}`
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        priority === "high" ? "bg-destructive" :
                        priority === "medium" ? "bg-chart-4" : "bg-chart-2"
                      }`} />
                      {priority}
                      <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                        {priorityCounts[priority]}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategory || selectedPriority) && (
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredRecommendations.length}</span> of{" "}
                  <span className="font-semibold text-foreground">{recommendations.length}</span> recommendations
                </p>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors"
                >
                  <X className="h-3 w-3" />
                  Clear Filters
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Category Summary Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Object.entries(categoryConfig).map(([category, config], index) => {
          const count = categoryCounts[category] || 0;
          if (count === 0) return null;
          const IconComponent = config.icon;
          const unitsInCategory = recommendationsWithCategory
            .filter((r) => r.category === category)
            .reduce((sum, r) => sum + r.units, 0);
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className={`cursor-pointer transition-all ${
                selectedCategory === category ? "ring-2 ring-primary ring-offset-2" : ""
              }`}
            >
              <Card className="border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center mb-3`}>
                    <IconComponent className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <p className="text-sm font-medium text-foreground">{category}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {count} {count === 1 ? "item" : "items"} • {unitsInCategory} units
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ── Recommendation Cards ── */}
      {filteredRecommendations.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredRecommendations.map((rec) => (
            <RecommendationCard key={rec.id} data={rec} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <p className="text-muted-foreground">
            {selectedCategory || selectedPriority
              ? "No recommendations match the selected filters."
              : "No recommendations at this time. Your inventory looks healthy!"}
          </p>
          {(selectedCategory || selectedPriority) && (
            <button
              onClick={clearFilters}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Clear filters to see all recommendations
            </button>
          )}
        </div>
      )}

      {/* ── AI Insights Panel ── */}
      {insights.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              AI Insights
            </h2>
          </div>
          <p className="text-sm text-muted-foreground -mt-2">
            Why each recommendation was generated — full decision transparency.
          </p>
          <div className="grid gap-5 lg:grid-cols-2">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
