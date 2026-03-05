"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const companies = [
  { id: "reliance-smart", name: "Reliance Smart" },
  { id: "dmart", name: "DMart" },
  { id: "daily-fresh", name: "Daily Fresh" },
];

export default function SetupPage() {
  const { firebaseUser, profile, loading, completeSetup } = useAuth();
  const router = useRouter();

  const [company, setCompany] = useState("");
  const [branch, setBranch] = useState("");
  const [role] = useState("store_manager");
  const [submitting, setSubmitting] = useState(false);

  // If not logged in → login. If already set up → dashboard.
  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.replace("/login");
    }
    if (!loading && profile?.company && profile?.branch) {
      router.replace("/dashboard");
    }
  }, [loading, firebaseUser, profile, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !branch) return;
    setSubmitting(true);
    const companyName = companies.find((c) => c.id === company)?.name || company;
    completeSetup(companyName, branch, role);
    router.push("/dashboard");
  };

  if (loading || (!loading && !firebaseUser)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-xl font-bold text-white shadow-lg shadow-emerald-200">
            RI
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Complete Your Setup</h1>
          <p className="mt-2 text-sm text-slate-500">
            Welcome, {firebaseUser?.displayName || "there"}! Select your company and branch.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-5"
        >
          {/* Company */}
          <div>
            <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-slate-700">
              Company
            </label>
            <select
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Branch */}
          <div>
            <label htmlFor="branch" className="mb-1.5 block text-sm font-medium text-slate-700">
              Branch Name
            </label>
            <input
              id="branch"
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="e.g. Branch 5 - Mumbai Central"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Role (read-only for now) */}
          <div>
            <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-slate-700">
              Role
            </label>
            <select
              id="role"
              value={role}
              disabled
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600 cursor-not-allowed"
            >
              <option value="store_manager">Store Manager</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !company || !branch}
            className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving…" : "Continue to Dashboard →"}
          </button>
        </form>
      </div>
    </div>
  );
}
