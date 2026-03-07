"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AlertBanner from "@/components/AlertBanner";
import AlertItem from "@/components/AlertItem";
import { mockInventory } from "@/data/inventory";
import { generateAlerts, getCriticalAlert, type AlertPriority } from "@/lib/alertEngine";
import { motion } from "framer-motion";
import { Bell, Filter, ArrowLeft, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const priorities: { value: AlertPriority | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20];

export default function AlertsPage() {
  const { profile } = useAuth();
  const [filter, setFilter] = useState<AlertPriority | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const alerts = useMemo(
    () => generateAlerts(mockInventory, profile?.branch || ""),
    [profile?.branch],
  );
  const criticalAlert = getCriticalAlert(alerts);

  // Filter alerts by priority and search
  const filteredAlerts = useMemo(() => {
    let result = filter === "all" ? alerts : alerts.filter((a) => a.priority === filter);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.product.toLowerCase().includes(query) ||
          a.message.toLowerCase().includes(query)
      );
    }
    return result;
  }, [alerts, filter, searchQuery]);

  // Pagination
  const totalItems = filteredAlerts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAlerts = filteredAlerts.slice(startIndex, endIndex);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: AlertPriority | "all") => {
    setFilter(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  if (!profile) return null;

  const highCount = alerts.filter((a) => a.priority === "high").length;
  const mediumCount = alerts.filter((a) => a.priority === "medium").length;
  const lowCount = alerts.filter((a) => a.priority === "low").length;

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
          Alert Center
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile.company} &middot; {profile.branch} &mdash; Monitor and manage all inventory alerts
        </p>
      </motion.div>

      {/* Critical Alert Banner */}
      {criticalAlert && <AlertBanner alert={criticalAlert} />}

      {/* Summary Pills */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-foreground" />
          <span className="text-lg font-semibold text-foreground">
            {alerts.length} Total Alerts
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs ml-auto">
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 font-medium text-destructive">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
            {highCount} high
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-chart-4/10 px-2.5 py-1 font-medium text-chart-4">
            <span className="h-1.5 w-1.5 rounded-full bg-chart-4" />
            {mediumCount} medium
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-chart-2/10 px-2.5 py-1 font-medium text-chart-2">
            <span className="h-1.5 w-1.5 rounded-full bg-chart-2" />
            {lowCount} low
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search alerts by product or message..."
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

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1">
            {priorities.map((p) => (
              <button
                key={p.value}
                onClick={() => handleFilterChange(p.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === p.value
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
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
      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          Found <span className="font-medium text-foreground">{totalItems}</span> result{totalItems !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
        </div>
      )}

      {/* Alert Items */}
      {currentAlerts.length > 0 ? (
        <div className="space-y-3">
          {currentAlerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <Bell className="mx-auto h-8 w-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">
            {searchQuery || filter !== "all"
              ? "No alerts match your filters."
              : "No alerts at this time. Your inventory looks healthy!"}
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-sm text-muted-foreground order-2 sm:order-1">
            Showing <span className="font-medium text-foreground">{startIndex + 1}</span> to{" "}
            <span className="font-medium text-foreground">{Math.min(endIndex, totalItems)}</span> of{" "}
            <span className="font-medium text-foreground">{totalItems}</span> alerts
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
