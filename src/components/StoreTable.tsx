import type { StoreProduct } from "@/types";

const riskColors: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-emerald-100 text-emerald-700",
};

interface Props {
  data: StoreProduct[];
}

export default function StoreTable({ data }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left">
            <th className="px-5 py-3 font-semibold text-slate-600">Product</th>
            <th className="px-5 py-3 font-semibold text-slate-600">Stock</th>
            <th className="px-5 py-3 font-semibold text-slate-600">Expiry Days</th>
            <th className="px-5 py-3 font-semibold text-slate-600">Expiry Risk</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
            >
              <td className="px-5 py-3 font-medium text-slate-900">{row.product}</td>
              <td className="px-5 py-3 text-slate-700">{row.stock}</td>
              <td className="px-5 py-3 text-slate-700">{row.expiryDays}</td>
              <td className="px-5 py-3">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    riskColors[row.expiryRisk] || "bg-slate-100 text-slate-600"
                  }`}
                >
                  {row.expiryRisk}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
