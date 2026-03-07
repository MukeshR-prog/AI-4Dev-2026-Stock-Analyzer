"use client";

import { useState } from "react";
import type { GeneratedRecommendation } from "@/lib/recommendationEngine";
import type { RecommendationStatus } from "@/types";
import RecommendationBadge from "./RecommendationBadge";
import { 
  AlertTriangle, 
  Lightbulb, 
  Info, 
  Check, 
  X, 
  CheckCircle2, 
  Clock,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface Props {
  data: GeneratedRecommendation;
  onStatusChange?: (id: string, status: RecommendationStatus, notes?: string) => void;
}

export default function RecommendationCard({ data, onStatusChange }: Props) {
  const [status, setStatus] = useState<RecommendationStatus>("pending");
  const [isExpanded, setIsExpanded] = useState(false);
  const [completionNotes, setCompletionNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [showCompletionForm, setShowCompletionForm] = useState(false);

  const handleAccept = () => {
    setStatus("accepted");
    setShowRejectionForm(false);
    onStatusChange?.(data.product, "accepted");
  };

  const handleReject = () => {
    if (showRejectionForm && rejectionReason.trim()) {
      setStatus("rejected");
      onStatusChange?.(data.product, "rejected", rejectionReason);
      setShowRejectionForm(false);
    } else {
      setShowRejectionForm(true);
      setShowCompletionForm(false);
    }
  };

  const handleComplete = () => {
    if (showCompletionForm) {
      setStatus("completed");
      onStatusChange?.(data.product, "completed", completionNotes);
      setShowCompletionForm(false);
    } else {
      setShowCompletionForm(true);
      setShowRejectionForm(false);
    }
  };

  const cancelForms = () => {
    setShowRejectionForm(false);
    setShowCompletionForm(false);
    setRejectionReason("");
    setCompletionNotes("");
  };

  const statusStyles = {
    pending: "border-border",
    accepted: "border-primary/30 bg-primary/5",
    rejected: "border-muted bg-muted/30",
    completed: "border-green-500/30 bg-green-50 dark:bg-green-950/20",
  };

  const statusBadges = {
    pending: null,
    accepted: (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
        <Clock className="h-3 w-3" />
        In Progress
      </span>
    ),
    rejected: (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
        <X className="h-3 w-3" />
        Rejected
      </span>
    ),
    completed: (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
        <CheckCircle2 className="h-3 w-3" />
        Completed
      </span>
    ),
  };

  return (
    <div
      className={`rounded-2xl border bg-card p-6 shadow-2xs transition-all hover:shadow-xs ${statusStyles[status]}`}
    >
      {/* Header: product name + badge + status */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            status === "completed" ? "bg-green-100 dark:bg-green-900/30" : "bg-destructive/10"
          }`}>
            {status === "completed" ? (
              <CheckCircle2 className="h-4.5 w-4.5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertTriangle className="h-4.5 w-4.5 text-destructive" />
            )}
          </span>
          <h3 className="text-base font-semibold text-foreground">{data.product}</h3>
        </div>
        <div className="flex items-center gap-2">
          {statusBadges[status]}
          <RecommendationBadge type={data.type} />
        </div>
      </div>

      {/* Issue */}
      <div className={`mt-4 rounded-xl border px-4 py-3 ${
        status === "completed" 
          ? "bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-800"
          : status === "rejected"
            ? "bg-muted/50 border-border"
            : "bg-destructive/5 border-destructive/20"
      }`}>
        <p className={`text-sm leading-relaxed flex items-start gap-2 ${
          status === "completed" 
            ? "text-green-700 dark:text-green-400"
            : status === "rejected"
              ? "text-muted-foreground"
              : "text-destructive"
        }`}>
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <span className="font-medium">Issue Detected:</span> {data.issue}
          </span>
        </p>
      </div>

      {/* Expandable details */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-3 flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
      >
        <span>View details</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {isExpanded && (
        <>
          {/* Action */}
          <div className="mt-2 rounded-xl bg-primary/10 border border-primary/20 px-4 py-3">
            <p className="text-sm text-foreground leading-relaxed flex items-start gap-2">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <span className="font-medium">Recommended Action:</span> {data.action}
              </span>
            </p>
          </div>

          {/* Reason */}
          <div className="mt-3 rounded-xl bg-muted/50 px-4 py-3">
            <p className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <span className="font-medium text-foreground">Reason:</span> {data.reason}
              </span>
            </p>
          </div>
        </>
      )}

      {/* Rejection Form */}
      {showRejectionForm && (
        <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Why are you rejecting this recommendation?
          </label>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter reason…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            rows={2}
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
              className="rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
            >
              Confirm Reject
            </button>
            <button
              onClick={cancelForms}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Completion Form */}
      {showCompletionForm && (
        <div className="mt-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 p-4">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Add completion notes (optional)
          </label>
          <textarea
            value={completionNotes}
            onChange={(e) => setCompletionNotes(e.target.value)}
            placeholder="What actions did you take?"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            rows={2}
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleComplete}
              className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
            >
              Mark as Completed
            </button>
            <button
              onClick={cancelForms}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Footer: units affected + actions */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            Units: <span className="font-semibold text-foreground">{data.units}</span>
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
              data.priority === "high"
                ? "bg-destructive/10 text-destructive"
                : data.priority === "medium"
                  ? "bg-chart-4/10 text-chart-4"
                  : "bg-chart-2/10 text-chart-2"
            }`}
          >
            {data.priority}
          </span>
        </div>

        {/* Action buttons - only show when pending or accepted */}
        {(status === "pending" || status === "accepted") && !showRejectionForm && !showCompletionForm && (
          <div className="flex items-center gap-2">
            {status === "pending" && (
              <>
                <button
                  onClick={handleReject}
                  className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                  Reject
                </button>
                <button
                  onClick={handleAccept}
                  className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Check className="h-3.5 w-3.5" />
                  Accept
                </button>
              </>
            )}
            {status === "accepted" && (
              <button
                onClick={handleComplete}
                className="flex items-center gap-1 rounded-lg bg-green-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark Complete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
