import type { Recommendation } from "@/types";
import { AlertTriangle, Lightbulb } from "lucide-react";

interface Props {
  data: Recommendation;
}

export default function RecommendationCard({ data }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-4/15">
          <AlertTriangle className="h-4 w-4 text-chart-4" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{data.product}</h3>
          <p className="text-xs text-destructive font-medium">{data.issue}</p>
        </div>
      </div>
      <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-3">
        <p className="text-sm text-foreground leading-relaxed flex items-start gap-2">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          {data.recommendation}
        </p>
      </div>
    </div>
  );
}
