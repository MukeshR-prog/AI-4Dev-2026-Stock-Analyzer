"use client";

import { useAuth } from "@/context/AuthContext";
import StoreTable from "@/components/StoreTable";
import type { StoreProduct } from "@/types";

// Mock data — later replaced with API calls
const mockStoreData: StoreProduct[] = [
  { product: "Milk (1L)", stock: 50, expiryDays: 2, expiryRisk: "High" },
  { product: "Yogurt (200g)", stock: 30, expiryDays: 5, expiryRisk: "Medium" },
  { product: "Bread (White)", stock: 80, expiryDays: 1, expiryRisk: "High" },
  { product: "Cheese Slices", stock: 45, expiryDays: 12, expiryRisk: "Low" },
  { product: "Fresh Juice (500ml)", stock: 20, expiryDays: 3, expiryRisk: "High" },
  { product: "Butter (100g)", stock: 60, expiryDays: 15, expiryRisk: "Low" },
  { product: "Eggs (12 pack)", stock: 25, expiryDays: 7, expiryRisk: "Medium" },
  { product: "Paneer (200g)", stock: 15, expiryDays: 4, expiryRisk: "Medium" },
];

export default function MyStorePage() {
  const { profile } = useAuth();

  if (!profile) return null;

  const highRiskCount = mockStoreData.filter((p) => p.expiryRisk === "High").length;
  const totalStock = mockStoreData.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">🏪 My Store</h1>
        <p className="mt-1 text-sm text-slate-500">
          Inventory for <span className="font-medium text-slate-700">{profile.branch}</span> — {profile.company}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Products</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{mockStoreData.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Stock</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{totalStock}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-600">High Expiry Risk</p>
          <p className="mt-1 text-2xl font-bold text-red-700">{highRiskCount}</p>
        </div>
      </div>

      {/* Table */}
      <StoreTable data={mockStoreData} />
    </div>
  );
}
