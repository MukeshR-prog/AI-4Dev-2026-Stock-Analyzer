"use client";

import { useAuth } from "@/context/AuthContext";
import BranchTable from "@/components/BranchTable";
import type { BranchInsight } from "@/types";

// Mock data — scoped to same company
const branchDataByCompany: Record<string, BranchInsight[]> = {
  "Reliance Smart": [
    { branch: "Branch 1 - Mumbai Central", salesPerDay: 130, inventory: 520, demandLevel: "High Demand", transferOpportunity: "Receive Stock" },
    { branch: "Branch 2 - Andheri West", salesPerDay: 85, inventory: 410, demandLevel: "Balanced", transferOpportunity: "None" },
    { branch: "Branch 5 - Bangalore", salesPerDay: 40, inventory: 280, demandLevel: "Low Demand", transferOpportunity: "Send Stock" },
    { branch: "Branch 9 - Pune", salesPerDay: 110, inventory: 180, demandLevel: "High Demand", transferOpportunity: "Receive Stock" },
  ],
  DMart: [
    { branch: "Branch 1 - Malad", salesPerDay: 160, inventory: 600, demandLevel: "High Demand", transferOpportunity: "Receive Stock" },
    { branch: "Branch 2 - Borivali", salesPerDay: 95, inventory: 380, demandLevel: "Balanced", transferOpportunity: "None" },
    { branch: "Branch 3 - Hyderabad", salesPerDay: 55, inventory: 290, demandLevel: "Low Demand", transferOpportunity: "Send Stock" },
  ],
  "Daily Fresh": [
    { branch: "Branch 1 - Kochi", salesPerDay: 50, inventory: 210, demandLevel: "Balanced", transferOpportunity: "None" },
    { branch: "Branch 2 - Trivandrum", salesPerDay: 35, inventory: 170, demandLevel: "Low Demand", transferOpportunity: "Send Stock" },
    { branch: "Branch 3 - Calicut", salesPerDay: 80, inventory: 120, demandLevel: "High Demand", transferOpportunity: "Receive Stock" },
  ],
};

export default function BranchInsightsPage() {
  const { profile } = useAuth();

  if (!profile) return null;

  const companyBranches = branchDataByCompany[profile.company] || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Branch Insights</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Comparing branches across{" "}
          <span className="font-medium text-foreground">{profile.company}</span>
        </p>
      </div>

      {/* Info banner */}
      <div className="rounded-2xl border border-chart-2/30 bg-chart-2/10 px-5 py-4">
        <p className="text-sm text-foreground">
          <span className="font-semibold">Multi-tenant view:</span> You can only see branches belonging to{" "}
          <strong>{profile.company}</strong>. Data from other companies is not accessible.
        </p>
      </div>

      {companyBranches.length > 0 ? (
        <BranchTable data={companyBranches} />
      ) : (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <p className="text-muted-foreground">No branch data available for {profile.company}.</p>
        </div>
      )}
    </div>
  );
}
