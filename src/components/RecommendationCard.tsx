import type { Recommendation } from "@/types";

interface Props {
  data: Recommendation;
}

export default function RecommendationCard({ data }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-base">
          ⚠️
        </span>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{data.product}</h3>
          <p className="text-xs text-red-600 font-medium">{data.issue}</p>
        </div>
      </div>
      <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
        <p className="text-sm text-emerald-800 leading-relaxed">
          💡 {data.recommendation}
        </p>
      </div>
    </div>
  );
}
