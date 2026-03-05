"use client";

import { useState } from "react";
import type { SmartAlert, AlertPriority } from "@/lib/alertEngine";
import AlertItem from "./AlertItem";
import { Bell, Filter } from "lucide-react";

interface Props {
  alerts: SmartAlert[];
}

const priorities: { value: AlertPriority | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export default function AlertList({ alerts }: Props) {
  const [filter, setFilter] = useState<AlertPriority | "all">("all");

  const filtered =
    filter === "all" ? alerts : alerts.filter((a) => a.priority === filter);

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
              onClick={() => setFilter(p.value)}
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
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((alert) => (
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
    </div>
  );
}
