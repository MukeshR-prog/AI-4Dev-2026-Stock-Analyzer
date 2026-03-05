"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { WasteProjection } from "@/lib/wasteSimulation";

interface Props {
  projections: WasteProjection[];
}

export default function WasteComparisonChart({ projections }: Props) {
  // Only show products that had waste before recommendations
  const chartData = projections
    .filter((p) => p.predictedWasteBefore > 0)
    .map((p) => ({
      name: p.product.length > 14 ? p.product.slice(0, 12) + "…" : p.product,
      fullName: p.product,
      before: p.predictedWasteBefore,
      after: p.predictedWasteAfter,
    }));

  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-muted-foreground">No waste data to display.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs">
      <h3 className="mb-1 text-base font-semibold text-foreground">
        Waste Comparison by Product
      </h3>
      <p className="mb-6 text-sm text-muted-foreground">
        Current predicted waste vs. projected waste after applying recommendations
      </p>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border, #e2e8f0)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground, #64748b)" }}
              axisLine={{ stroke: "var(--color-border, #e2e8f0)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground, #64748b)" }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "Units",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 12, fill: "var(--color-muted-foreground, #64748b)" },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card, #fff)",
                border: "1px solid var(--color-border, #e2e8f0)",
                borderRadius: "0.75rem",
                fontSize: 13,
              }}
              formatter={(value: number | undefined, name?: string) => [
                `${value ?? 0} units`,
                name === "before" ? "Current Waste" : "After Actions",
              ]}
              labelFormatter={(_label, payload) =>
                payload?.[0]?.payload?.fullName || _label
              }
            />
            <Legend
              formatter={(value) =>
                value === "before" ? "Current Waste" : "After Actions"
              }
              wrapperStyle={{ fontSize: 13 }}
            />
            <Bar dataKey="before" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {chartData.map((_, index) => (
                <Cell key={`before-${index}`} fill="var(--color-destructive, #ef4444)" fillOpacity={0.8} />
              ))}
            </Bar>
            <Bar dataKey="after" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {chartData.map((_, index) => (
                <Cell key={`after-${index}`} fill="var(--color-primary, #22c55e)" fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
