import type { BranchInsight } from "@/types";

interface Props {
  data: BranchInsight[];
}

export default function BranchTable({ data }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted text-left">
            <th className="px-5 py-3 font-semibold text-muted-foreground">Branch</th>
            <th className="px-5 py-3 font-semibold text-muted-foreground">Milk Sales</th>
            <th className="px-5 py-3 font-semibold text-muted-foreground">Inventory</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-b border-border last:border-0 hover:bg-accent transition-colors"
            >
              <td className="px-5 py-3 font-medium text-foreground">{row.branch}</td>
              <td className="px-5 py-3 text-foreground">{row.milkSales}</td>
              <td className="px-5 py-3 text-foreground">{row.inventory}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
