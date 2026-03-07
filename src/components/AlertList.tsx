"use client";

import { useState, useMemo } from "react";
import type { SmartAlert, AlertPriority } from "@/lib/alertEngine";
import AlertItem from "./AlertItem";
import { Bell, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  alerts: SmartAlert[];
  showViewAll?: boolean;
  limit?: number;
}

const priorities: { value: AlertPriority | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const ITEMS_PER_PAGE = 3;

export default function AlertList({ alerts, showViewAll = true, limit }: Props) {
  const [filter, setFilter] = useState<AlertPriority | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const result = filter === "all" ? alerts : alerts.filter((a) => a.priority === filter);
    return limit ? result.slice(0, limit) : result;
  }, [alerts, filter, limit]);

  // Pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAlerts = filtered.slice(startIndex, endIndex);

  const handleFilterChange = (value: AlertPriority | "all") => {
    setFilter(value);
    setCurrentPage(1);
  };

  const highCount = alerts.filter((a) => a.priority === "high").length;
  const mediumCount = alerts.filter((a) => a.priority === "medium").length;
  const lowCount = alerts.filter((a) => a.priority === "low").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-foreground" />
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Smart Alerts
          </h2>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-foreground">
            {alerts.length}
          </span>
        </div>

        {/* Priority summary pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 font-medium text-destructive">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
            {highCount} high
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-chart-4/10 px-2.5 py-0.5 font-medium text-chart-4">
            <span className="h-1.5 w-1.5 rounded-full bg-chart-4" />
            {mediumCount} medium
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-chart-2/10 px-2.5 py-0.5 font-medium text-chart-2">
            <span className="h-1.5 w-1.5 rounded-full bg-chart-2" />
            {lowCount} low
          </span>
        </div>
      </div>

      {/* Filter bar */}
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

      {/* Alert items */}
      {currentAlerts.length > 0 ? (
        <div className="space-y-3">
          {currentAlerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No alerts match this filter.
          </p>
        </div>
      )}

      {/* Pagination / View All */}
      {(totalPages > 1 || (showViewAll && alerts.length > ITEMS_PER_PAGE)) && (
        <div className="flex items-center justify-between pt-2">
          {totalPages > 1 ? (
            <>
              <div className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage === 1) {
                    pageNum = i + 1;
                  } else if (currentPage === totalPages) {
                    pageNum = totalPages - 2 + i;
                  } else {
                    pageNum = currentPage - 1 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "w-7 h-7 rounded-lg text-xs font-medium transition-colors",
                        currentPage === pageNum
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div />
          )}

          {showViewAll && alerts.length > ITEMS_PER_PAGE && (
            <Link
              href="/dashboard/my-store/alerts"
              className="text-xs text-primary hover:underline font-medium"
            >
              View all alerts →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
