"use client";

import { useAuth } from "@/context/AuthContext";
import BranchTable from "@/components/BranchTable";
import type { BranchInsight } from "@/types";

// Mock data — scoped to same company
const branchDataByCompany: Record<string, BranchInsight[]> = {
  "Reliance Smart": [
    { branch: "Branch 1 - Mumbai Central", milkSales: "30/day", inventory: 120 },
    { branch: "Branch 2 - Andheri West", milkSales: "18/day", inventory: 85 },
    { branch: "Branch 5 - Bangalore", milkSales: "5/day", inventory: 50 },
    { branch: "Branch 9 - Pune", milkSales: "25/day", inventory: 10 },
  ],
  DMart: [
    { branch: "Branch 1 - Malad", milkSales: "40/day", inventory: 200 },
    { branch: "Branch 2 - Borivali", milkSales: "22/day", inventory: 95 },
    { branch: "Branch 3 - Hyderabad", milkSales: "15/day", inventory: 60 },
  ],
  "Daily Fresh": [
    { branch: "Branch 1 - Kochi", milkSales: "12/day", inventory: 70 },
    { branch: "Branch 2 - Trivandrum", milkSales: "8/day", inventory: 45 },
    { branch: "Branch 3 - Calicut", milkSales: "20/day", inventory: 30 },
  ],
};

export default function BranchInsightsPage() {
  const { profile } = useAuth();

  if (!profile) return null;

  const companyBranches = branchDataByCompany[profile.company] || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">📊 Branch Insights</h1>
        <p className="mt-1 text-sm text-slate-500">
          Comparing branches across{" "}
          <span className="font-medium text-slate-700">{profile.company}</span>
        </p>
      </div>

      {/* Info banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Multi-tenant view:</span> You can only see branches belonging to{" "}
          <strong>{profile.company}</strong>. Data from other companies is not accessible.
        </p>
      </div>

      {companyBranches.length > 0 ? (
        <BranchTable data={companyBranches} />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-slate-500">No branch data available for {profile.company}.</p>
        </div>
      )}
    </div>
  );
}
