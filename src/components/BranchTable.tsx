import type { BranchInsight } from "@/types";

interface Props {
  data: BranchInsight[];
}

export default function BranchTable({ data }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left">
            <th className="px-5 py-3 font-semibold text-slate-600">Branch</th>
            <th className="px-5 py-3 font-semibold text-slate-600">Milk Sales</th>
            <th className="px-5 py-3 font-semibold text-slate-600">Inventory</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
            >
              <td className="px-5 py-3 font-medium text-slate-900">{row.branch}</td>
              <td className="px-5 py-3 text-slate-700">{row.milkSales}</td>
              <td className="px-5 py-3 text-slate-700">{row.inventory}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
