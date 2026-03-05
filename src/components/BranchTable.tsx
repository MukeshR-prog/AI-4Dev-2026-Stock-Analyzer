import type { BranchInsight } from "@/types";
import { cn } from "@/lib/utils";

const demandConfig: Record<BranchInsight["demandLevel"], { bg: string; text: string }> = {
  "High Demand": { bg: "bg-destructive/10", text: "text-destructive" },
  Balanced: { bg: "bg-primary/10", text: "text-primary" },
  "Low Demand": { bg: "bg-chart-4/10", text: "text-chart-4" },
};

const transferConfig: Record<BranchInsight["transferOpportunity"], { bg: string; text: string }> = {
  "Send Stock": { bg: "bg-chart-2/10", text: "text-chart-2" },
  "Receive Stock": { bg: "bg-chart-3/10", text: "text-chart-3" },
  None: { bg: "bg-muted", text: "text-muted-foreground" },
};

interface Props {
  data: BranchInsight[];
}

export default function BranchTable({ data }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left">
            <th className="px-5 py-3 font-semibold text-muted-foreground">Branch Name</th>
            <th className="px-5 py-3 text-right font-semibold text-muted-foreground">Sales / Day</th>
            <th className="px-5 py-3 text-right font-semibold text-muted-foreground">Inventory</th>
            <th className="px-5 py-3 font-semibold text-muted-foreground">Demand Level</th>
            <th className="px-5 py-3 font-semibold text-muted-foreground">Transfer Opportunity</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const demand = demandConfig[row.demandLevel];
            const transfer = transferConfig[row.transferOpportunity];
            return (
              <tr
                key={i}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-5 py-3 font-medium text-foreground">{row.branch}</td>
                <td className="px-5 py-3 text-right tabular-nums text-foreground">
                  {row.salesPerDay}
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-foreground">
                  {row.inventory}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      demand.bg,
                      demand.text,
                    )}
                  >
                    {row.demandLevel}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      transfer.bg,
                      transfer.text,
                    )}
                  >
                    {row.transferOpportunity}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
