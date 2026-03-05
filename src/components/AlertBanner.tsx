"use client";

import { useState } from "react";
import type { SmartAlert } from "@/lib/alertEngine";
import { AlertTriangle, X } from "lucide-react";

interface Props {
  alert: SmartAlert;
}

export default function AlertBanner({ alert }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-destructive/30 bg-destructive/5">
      {/* Animated pulse accent */}
      <div className="absolute left-0 top-0 h-full w-1 bg-destructive animate-pulse" />

      <div className="flex items-start gap-4 px-5 py-4 pl-6">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
          <AlertTriangle className="h-4.5 w-4.5 text-destructive" />
        </span>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground">
            High Risk Alert
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
            {alert.message}
          </p>
        </div>

        {alert.metric && (
          <span className="shrink-0 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive">
            {alert.metric}
          </span>
        )}

        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
