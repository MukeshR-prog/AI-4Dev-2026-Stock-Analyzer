"use client";

import type { ReactNode } from "react";

interface Props {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconBg: string;
  valueColor?: string;
  borderColor?: string;
}

export default function WasteImpactCard({
  label,
  value,
  subtitle,
  icon,
  iconBg,
  valueColor = "text-foreground",
  borderColor,
}: Props) {
  return (
    <div
      className={`rounded-xl border bg-card p-6 transition-shadow hover:shadow-md ${
        borderColor ? `border-l-4 ${borderColor} border-border` : "border-border"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}
        >
          {icon}
        </span>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <p className={`mt-4 text-4xl font-bold tracking-tight ${valueColor}`}>
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
