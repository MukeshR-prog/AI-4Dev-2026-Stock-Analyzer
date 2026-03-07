"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import InsightCard from "@/components/InsightCard";
import { mockInventory } from "@/data/inventory";
import { generateExpiryInsights, type Insight } from "@/lib/insightEngine";
import { motion } from "framer-motion";
import { BrainCircuit, ArrowLeft, Search, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, AlertTriangle, TrendingUp, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const insightTypes: { value: Insight["type"] | "all"; label: string; icon: React.ElementType; color: string }[] = [
  { value: "all", label: "All Types", icon: BrainCircuit, color: "text-foreground" },
  { value: "expiry-risk", label: "Expiry Risk", icon: AlertTriangle, color: "text-destructive" },
  { value: "demand-difference", label: "Demand Insight", icon: TrendingUp, color: "text-chart-4" },
  { value: "redistribution", label: "Redistribution", icon: ArrowRightLeft, color: "text-chart-2" },
];

const ITEMS_PER_PAGE_OPTIONS = [4, 8, 12, 16];

export default function InsightsPage() {
  const { profile } = useAuth();
  const [filter, setFilter] = useState<Insight["type"] | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const insights = useMemo(() => generateExpiryInsights(mockInventory), []);

  // Filter insights by type and search
  const filteredInsights = useMemo(() => {
    let result = filter === "all" ? insights : insights.filter((i) => i.type === filter);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(query) ||
          i.bullets.some((b) => b.toLowerCase().includes(query))
      );
    }
    return result;
  }, [insights, filter, searchQuery]);

  // Pagination
  const totalItems = filteredInsights.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInsights = filteredInsights.slice(startIndex, endIndex);

  // Type counts
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: insights.length };
    insights.forEach((i) => {
      counts[i.type] = (counts[i.type] || 0) + 1;
    });
    return counts;
  }, [insights]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: Insight["type"] | "all") => {
    setFilter(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/dashboard/my-store"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Store
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          AI Insights
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile.company} &middot; {profile.branch} &mdash; Transparent explanations for inventory recommendations
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {insightTypes.map((type, index) => {
          const Icon = type.icon;
          const count = typeCounts[type.value] || 0;
          if (type.value === "all") return null;
          return (
            <motion.div
              key={type.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              onClick={() => handleFilterChange(filter === type.value ? "all" : type.value)}
              className={cn(
                "cursor-pointer transition-all",
                filter === type.value && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <Card className="border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", 
                    type.value === "expiry-risk" && "bg-destructive/10",
                    type.value === "demand-difference" && "bg-chart-4/10",
                    type.value === "redistribution" && "bg-chart-2/10"
                  )}>
                    <Icon className={cn("h-5 w-5", type.color)} />
                  </div>
                  <p className="text-sm font-medium text-foreground">{type.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{count}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search insights..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              ×
            </button>
          )}
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1 flex-wrap">
            {insightTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => handleFilterChange(type.value)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    filter === type.value
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Items per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="px-2 py-1.5 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Results Info */}
      {(searchQuery || filter !== "all") && (
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{totalItems}</span> insight{totalItems !== 1 ? "s" : ""}
          {searchQuery && <> for &quot;{searchQuery}&quot;</>}
          {filter !== "all" && <> in {insightTypes.find(t => t.value === filter)?.label}</>}
        </div>
      )}

      {/* Insight Cards */}
      {currentInsights.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {currentInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <BrainCircuit className="mx-auto h-8 w-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">
            {searchQuery || filter !== "all"
              ? "No insights match your filters."
              : "No insights to display. All products are within safe thresholds."}
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-sm text-muted-foreground order-2 sm:order-1">
            Showing <span className="font-medium text-foreground">{startIndex + 1}</span> to{" "}
            <span className="font-medium text-foreground">{Math.min(endIndex, totalItems)}</span> of{" "}
            <span className="font-medium text-foreground">{totalItems}</span> insights
          </div>

          <div className="flex items-center gap-1 order-1 sm:order-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1 mx-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                      currentPage === pageNum
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
