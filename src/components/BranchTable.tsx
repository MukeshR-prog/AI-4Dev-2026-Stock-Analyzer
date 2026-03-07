"use client";

import { useState, useMemo } from "react";
import type { BranchInsight } from "@/types";
import { cn } from "@/lib/utils";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter } from "lucide-react";

const demandConfig: Record<BranchInsight["demandLevel"], { bg: string; text: string }> = {
  "High Demand": { bg: "bg-destructive/10", text: "text-destructive" },
  Balanced: { bg: "bg-primary/10", text: "text-primary" },
  "Low Demand": { bg: "bg-chart-4/10", text: "text-chart-4" },
};

const transferConfig: Record<BranchInsight["transferOpportunity"], { bg: string; text: string }> = {
  "Send Stock": { bg: "bg-chart-2/10", text: "text-chart-2" },
  "Receive Stock": { bg: "bg-chart-3/10", text: "text-chart-3" },
  None: { bg: "bg-muted", text: "text-muted-foreground" },
};

interface Props {
  data: BranchInsight[];
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20];

type DemandFilter = BranchInsight["demandLevel"] | "all";
type TransferFilter = BranchInsight["transferOpportunity"] | "all";

export default function BranchTable({ data }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [demandFilter, setDemandFilter] = useState<DemandFilter>("all");
  const [transferFilter, setTransferFilter] = useState<TransferFilter>("all");

  // Filter data
  const filteredData = useMemo(() => {
    let result = data;
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        item.branch.toLowerCase().includes(query) ||
        (item.manager && item.manager.toLowerCase().includes(query)) ||
        (item.region && item.region.toLowerCase().includes(query))
      );
    }
    
    // Demand filter
    if (demandFilter !== "all") {
      result = result.filter((item) => item.demandLevel === demandFilter);
    }
    
    // Transfer filter
    if (transferFilter !== "all") {
      result = result.filter((item) => item.transferOpportunity === transferFilter);
    }
    
    return result;
  }, [data, searchQuery, demandFilter, transferFilter]);

  // Pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleDemandFilterChange = (value: DemandFilter) => {
    setDemandFilter(value);
    setCurrentPage(1);
  };

  const handleTransferFilterChange = (value: TransferFilter) => {
    setTransferFilter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDemandFilter("all");
    setTransferFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || demandFilter !== "all" || transferFilter !== "all";

  return (
    <div className="space-y-4">
      {/* Search and Controls Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by branch, manager, or region..."
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
            <span className="text-sm text-muted-foreground">per page</span>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filters:</span>
          </div>
          
          {/* Demand Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">Demand:</span>
            {(["all", "High Demand", "Balanced", "Low Demand"] as const).map((level) => (
              <button
                key={level}
                onClick={() => handleDemandFilterChange(level)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                  demandFilter === level
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {level === "all" ? "All" : level}
              </button>
            ))}
          </div>

          {/* Transfer Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">Transfer:</span>
            {(["all", "Send Stock", "Receive Stock", "None"] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleTransferFilterChange(type)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                  transferFilter === type
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {type === "all" ? "All" : type}
              </button>
            ))}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-destructive hover:text-destructive/80 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      {hasActiveFilters && (
        <div className="text-sm text-muted-foreground">
          Found <span className="font-medium text-foreground">{totalItems}</span> branch{totalItems !== 1 ? "es" : ""}
          {searchQuery && <> matching &quot;{searchQuery}&quot;</>}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left">
              <th className="px-5 py-3 font-semibold text-muted-foreground">Branch Name</th>
              <th className="px-5 py-3 text-right font-semibold text-muted-foreground">Sales / Day</th>
              <th className="px-5 py-3 text-right font-semibold text-muted-foreground">Inventory</th>
              <th className="px-5 py-3 font-semibold text-muted-foreground">Demand Level</th>
              <th className="px-5 py-3 font-semibold text-muted-foreground">Transfer Opportunity</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, i) => {
                const demand = demandConfig[row.demandLevel];
                const transfer = transferConfig[row.transferOpportunity];
                return (
                  <tr
                    key={`${row.branch}-${i}`}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-foreground">{row.branch}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-foreground">
                      {row.salesPerDay}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-foreground">
                      {row.inventory}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          demand.bg,
                          demand.text,
                        )}
                      >
                        {row.demandLevel}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          transfer.bg,
                          transfer.text,
                        )}
                      >
                        {row.transferOpportunity}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                  {hasActiveFilters ? "No branches match your filters." : "No branch data available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-sm text-muted-foreground order-2 sm:order-1">
            Showing <span className="font-medium text-foreground">{startIndex + 1}</span> to{" "}
            <span className="font-medium text-foreground">{Math.min(endIndex, totalItems)}</span> of{" "}
            <span className="font-medium text-foreground">{totalItems}</span> branches
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
