"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Search,
  Filter,
  User,
  ArrowLeftRight,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import type { BranchContact } from "@/types";

// ═══════════════════════════════════════════════════════════════════════════════
// BRANCH CONTACT CARD
// ═══════════════════════════════════════════════════════════════════════════════

interface BranchCardProps {
  branch: BranchContact;
  isCurrentBranch: boolean;
  onRequestTransfer: (branchName: string) => void;
}

function BranchCard({ branch, isCurrentBranch, onRequestTransfer }: BranchCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border bg-card p-5 shadow-2xs transition-all hover:shadow-xs ${
        isCurrentBranch ? "border-primary ring-2 ring-primary/20" : "border-border"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            isCurrentBranch ? "bg-primary/10" : "bg-muted"
          }`}>
            <Building2 className={`h-6 w-6 ${isCurrentBranch ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{branch.branchName}</h3>
              {isCurrentBranch && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  YOUR BRANCH
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{branch.region}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
          branch.isActive 
            ? "bg-green-100 text-green-700" 
            : "bg-gray-100 text-gray-600"
        }`}>
          {branch.isActive ? (
            <>
              <CheckCircle2 className="h-3 w-3" />
              Active
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3" />
              Inactive
            </>
          )}
        </span>
      </div>

      {/* Manager Info */}
      <div className="mt-4 rounded-xl bg-muted/50 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <User className="h-4 w-4 text-muted-foreground" />
          {branch.managerName}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">Branch Manager</p>
      </div>

      {/* Contact Details */}
      <div className="mt-4 space-y-3">
        <a
          href={`tel:${branch.phone}`}
          className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Phone className="h-4 w-4" />
          {branch.phone}
        </a>
        <a
          href={`mailto:${branch.email}`}
          className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Mail className="h-4 w-4" />
          {branch.email}
        </a>
        <div className="flex items-start gap-3 px-2 py-1.5 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {branch.address}
            <br />
            {branch.city}
          </span>
        </div>
      </div>

      {/* Actions */}
      {!isCurrentBranch && branch.isActive && (
        <div className="mt-4 border-t border-border pt-4">
          <button
            onClick={() => onRequestTransfer(branch.branchName)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeftRight className="h-4 w-4" />
            Request Transfer
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function DirectoryPage() {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [branchContacts, setBranchContacts] = useState<BranchContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBranches() {
      try {
        const res = await fetch("/api/branches?active=false");
        const data = await res.json();
        if (data.success) setBranchContacts(data.data);
      } catch {
        // Keep defaults
      } finally {
        setLoading(false);
      }
    }
    fetchBranches();
  }, []);

  const currentBranchName = profile?.branch || "";

  const regions = useMemo(() => {
    const uniqueRegions = new Set(branchContacts.map((b) => b.region));
    return Array.from(uniqueRegions).sort();
  }, [branchContacts]);

  const filteredBranches = useMemo(() => {
    return branchContacts.filter((branch) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          branch.branchName.toLowerCase().includes(query) ||
          branch.managerName.toLowerCase().includes(query) ||
          (branch.city?.toLowerCase().includes(query) ?? false) ||
          branch.region.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Region filter
      if (regionFilter !== "all" && branch.region !== regionFilter) {
        return false;
      }

      // Active filter
      if (showActiveOnly && !branch.isActive) {
        return false;
      }

      return true;
    });
  }, [searchQuery, regionFilter, showActiveOnly]);

  const handleRequestTransfer = (branchName: string) => {
    // In a real app, this would open a modal or navigate to transfers page
    window.location.href = `/dashboard/transfers?from=${encodeURIComponent(branchName)}`;
  };

  if (!profile) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Branch Directory
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Contact information for all branches in your company
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-3xl font-bold text-foreground">{branchContacts.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">Total Branches</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-3xl font-bold text-green-600">
            {branchContacts.filter((b) => b.isActive).length}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Active Branches</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-3xl font-bold text-foreground">{regions.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">Regions Covered</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search branches, managers, cities…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Active Only Toggle */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={(e) => setShowActiveOnly(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
          />
          <span className="text-muted-foreground">Active only</span>
        </label>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredBranches.length} of {branchContacts.length} branches
      </p>

      {/* Branch Cards Grid */}
      {filteredBranches.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBranches.map((branch, index) => (
            <motion.div
              key={branch.branchId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <BranchCard
                branch={branch}
                isCurrentBranch={branch.branchName === currentBranchName}
                onRequestTransfer={handleRequestTransfer}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <Building2 className="mx-auto h-8 w-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">
            No branches found matching your filters
          </p>
        </div>
      )}
    </div>
  );
}
