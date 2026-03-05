import type { GeneratedRecommendation } from "@/lib/recommendationEngine";
import RecommendationBadge from "./RecommendationBadge";
import { AlertTriangle, Lightbulb, Info } from "lucide-react";

interface Props {
  data: GeneratedRecommendation;
}

export default function RecommendationCard({ data }: Props) {
  const priorityStyles = {
    high: "",
    medium: "",
    low: "",
  };

  return (
    <div
      className={`rounded-2xl border border-border bg-card p-6 shadow-2xs transition-shadow hover:shadow-xs ${priorityStyles[data.priority]}`}
    >
      {/* Header: product name + badge */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
            <AlertTriangle className="h-4.5 w-4.5 text-destructive" />
          </span>
          <h3 className="text-base font-semibold text-foreground">{data.product}</h3>
        </div>
        <RecommendationBadge type={data.type} />
      </div>

      {/* Issue */}
      <div className="mt-4 rounded-xl bg-destructive/5 border border-destructive/20 px-4 py-3">
        <p className="text-sm text-destructive leading-relaxed flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <span className="font-medium">Issue Detected:</span> {data.issue}
          </span>
        </p>
      </div>

      {/* Action */}
      <div className="mt-3 rounded-xl bg-primary/10 border border-primary/20 px-4 py-3">
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

      {/* Footer: units affected */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Units affected: <span className="font-semibold text-foreground">{data.units}</span>
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
          {data.priority} priority
        </span>
      </div>
    </div>
  );
}
