import type { GeneratedRecommendation } from "@/lib/recommendationEngine";
import RecommendationBadge from "./RecommendationBadge";
import { AlertTriangle, Lightbulb, Info } from "lucide-react";

interface Props {
  data: GeneratedRecommendation;
}

export default function RecommendationCard({ data }: Props) {
  const priorityStyles = {
    high: "border-l-red-500",
    medium: "border-l-amber-400",
    low: "border-l-blue-400",
  };

  return (
    <div
      className={`rounded-xl border border-border border-l-4 ${priorityStyles[data.priority]} bg-card p-6 transition-shadow hover:shadow-md`}
    >
      {/* Header: product name + badge */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/40">
            <AlertTriangle className="h-4.5 w-4.5 text-red-600 dark:text-red-400" />
          </span>
          <h3 className="text-base font-semibold text-foreground">{data.product}</h3>
        </div>
        <RecommendationBadge type={data.type} />
      </div>

      {/* Issue */}
      <div className="mt-4 rounded-lg bg-red-50/60 dark:bg-red-950/20 border border-red-200/60 dark:border-red-800/40 px-4 py-3">
        <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <span className="font-medium">Issue Detected:</span> {data.issue}
          </span>
        </p>
      </div>

      {/* Action */}
      <div className="mt-3 rounded-lg bg-primary/10 border border-primary/20 px-4 py-3">
        <p className="text-sm text-foreground leading-relaxed flex items-start gap-2">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>
            <span className="font-medium">Recommended Action:</span> {data.action}
          </span>
        </p>
      </div>

      {/* Reason */}
      <div className="mt-3 rounded-lg bg-muted/50 px-4 py-3">
        <p className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <span className="font-medium text-foreground">Reason:</span> {data.reason}
          </span>
        </p>
      </div>

      {/* Footer: units affected */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Units affected: <span className="font-semibold text-foreground">{data.units}</span>
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            data.priority === "high"
              ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
              : data.priority === "medium"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                : "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
          }`}
        >
          {data.priority} priority
        </span>
      </div>
    </div>
  );
}
