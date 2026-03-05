"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const companiesData = [
  {
    id: "reliance-smart",
    name: "Reliance Smart",
    branches: ["Branch 1", "Branch 2", "Branch 3", "Branch 4", "Branch 5"],
  },
  {
    id: "dmart",
    name: "DMart",
    branches: ["Branch 1", "Branch 2", "Branch 3"],
  },
  {
    id: "daily-fresh",
    name: "Daily Fresh",
    branches: ["Branch 1", "Branch 2", "Branch 3"],
  },
];

export default function SetupPage() {
  const { firebaseUser, profile, loading, completeSetup } = useAuth();
  const router = useRouter();

  const [company, setCompany] = useState("");
  const [branch, setBranch] = useState("");
  const [role] = useState("store_manager");
  const [submitting, setSubmitting] = useState(false);

  const selectedCompany = companiesData.find((c) => c.id === company);

  // Reset branch when company changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBranch("");
  }, [company]);

  // If not logged in → login. If already set up → dashboard.
  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.replace("/login");
    }
    if (!loading && profile?.company && profile?.branch) {
      router.replace("/dashboard");
    }
  }, [loading, firebaseUser, profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !branch) return;
    setSubmitting(true);
    const companyName = selectedCompany?.name || company;
    await completeSetup(companyName, branch, role);
    router.push("/dashboard");
  };

  if (loading || (!loading && !firebaseUser)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
            RI
          </div>
          <h1 className="text-2xl font-bold text-foreground">Complete Your Setup</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome, {firebaseUser?.displayName || "there"}! Select your company and branch.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-8 shadow-sm space-y-5"
        >
          {/* Company */}
          <div>
            <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-foreground">
              Company
            </label>
            <select
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"
            >
              <option value="">Select Company</option>
              {companiesData.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Branch */}
          <div>
            <label htmlFor="branch" className="mb-1.5 block text-sm font-medium text-foreground">
              Branch
            </label>
            <select
              id="branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
              disabled={!company}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
              <option value="">Select Branch</option>
              {selectedCompany?.branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Role (read-only for now) */}
          <div>
            <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-foreground">
              Role
            </label>
            <select
              id="role"
              value={role}
              disabled
              className="w-full rounded-xl border border-input bg-muted px-4 py-3 text-sm text-muted-foreground cursor-not-allowed"
            >
              <option value="store_manager">Store Manager</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !company || !branch}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving…" : "Continue to Dashboard →"}
          </button>
        </form>
      </div>
    </div>
  );
}
