"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import BranchTable from "@/components/BranchTable";
import type { BranchInsight, BranchContact } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Store,
  DollarSign,
  Users,
  Activity,
  Trash2,
  ArrowUpRight,
  Building2,
  MapPin,
  Loader2,
} from "lucide-react";

// Extended mock data — scoped to same company with additional metrics
// Current Date: March 7, 2026
const branchDataByCompany: Record<string, BranchInsight[]> = {
  "FreshMart": [
    { branch: "FreshMart Union Square", salesPerDay: 285, inventory: 1420, demandLevel: "High Demand", transferOpportunity: "Receive Stock", wastePercentage: 2.8, revenue: 42500, growthRate: 14.2, manager: "Sarah Mitchell", staffCount: 32, region: "Northeast", rating: 4.8, lastRestocked: "45 mins ago", topCategory: "Dairy" },
    { branch: "FreshMart Upper West Side", salesPerDay: 248, inventory: 1680, demandLevel: "High Demand", transferOpportunity: "Send Stock", wastePercentage: 2.4, revenue: 38200, growthRate: 11.5, manager: "David Chen", staffCount: 28, region: "Northeast", rating: 4.7, lastRestocked: "1 hour ago", topCategory: "Produce" },
    { branch: "FreshMart Park Slope", salesPerDay: 192, inventory: 980, demandLevel: "Balanced", transferOpportunity: "None", wastePercentage: 3.5, revenue: 29800, growthRate: 8.3, manager: "Jennifer Williams", staffCount: 22, region: "Northeast", rating: 4.5, lastRestocked: "2 hours ago", topCategory: "Bakery" },
    { branch: "FreshMart Jersey City", salesPerDay: 165, inventory: 890, demandLevel: "Balanced", transferOpportunity: "None", wastePercentage: 4.1, revenue: 24600, growthRate: 5.8, manager: "Michael Rodriguez", staffCount: 19, region: "Northeast", rating: 4.3, lastRestocked: "3 hours ago", topCategory: "Meat" },
    { branch: "FreshMart Back Bay", salesPerDay: 225, inventory: 1250, demandLevel: "High Demand", transferOpportunity: "Receive Stock", wastePercentage: 2.9, revenue: 35400, growthRate: 12.8, manager: "Emily Thompson", staffCount: 26, region: "Northeast", rating: 4.6, lastRestocked: "1.5 hours ago", topCategory: "Dairy" },
    { branch: "FreshMart Rittenhouse", salesPerDay: 178, inventory: 1020, demandLevel: "Balanced", transferOpportunity: "Send Stock", wastePercentage: 3.8, revenue: 27200, growthRate: 6.4, manager: "James Patterson", staffCount: 21, region: "Northeast", rating: 4.4, lastRestocked: "4 hours ago", topCategory: "Beverages" },
    { branch: "FreshMart Georgetown", salesPerDay: 198, inventory: 1150, demandLevel: "High Demand", transferOpportunity: "Receive Stock", wastePercentage: 3.2, revenue: 31200, growthRate: 9.7, manager: "Amanda Foster", staffCount: 24, region: "Mid-Atlantic", rating: 4.5, lastRestocked: "2.5 hours ago", topCategory: "Produce" },
    { branch: "FreshMart Dupont Circle", salesPerDay: 85, inventory: 420, demandLevel: "Low Demand", transferOpportunity: "Send Stock", wastePercentage: 6.8, revenue: 12800, growthRate: -2.1, manager: "Robert Kim", staffCount: 12, region: "Mid-Atlantic", rating: 3.9, lastRestocked: "Temporarily Closed", topCategory: "N/A" },
  ],
  "Whole Foods": [
    { branch: "Whole Foods Columbus Circle", salesPerDay: 320, inventory: 2100, demandLevel: "High Demand", transferOpportunity: "Receive Stock", wastePercentage: 2.2, revenue: 58500, growthRate: 16.5, manager: "Lisa Anderson", staffCount: 45, region: "Northeast", rating: 4.9, lastRestocked: "30 mins ago", topCategory: "Organic Produce" },
    { branch: "Whole Foods Tribeca", salesPerDay: 275, inventory: 1850, demandLevel: "High Demand", transferOpportunity: "None", wastePercentage: 2.6, revenue: 48200, growthRate: 13.2, manager: "Mark Thompson", staffCount: 38, region: "Northeast", rating: 4.7, lastRestocked: "1 hour ago", topCategory: "Prepared Foods" },
    { branch: "Whole Foods Williamsburg", salesPerDay: 195, inventory: 1320, demandLevel: "Balanced", transferOpportunity: "None", wastePercentage: 3.4, revenue: 32500, growthRate: 7.8, manager: "Rachel Green", staffCount: 28, region: "Northeast", rating: 4.5, lastRestocked: "2 hours ago", topCategory: "Dairy" },
    { branch: "Whole Foods Hoboken", salesPerDay: 155, inventory: 980, demandLevel: "Balanced", transferOpportunity: "Send Stock", wastePercentage: 4.5, revenue: 26800, growthRate: 4.2, manager: "Kevin Wright", staffCount: 22, region: "Northeast", rating: 4.3, lastRestocked: "4 hours ago", topCategory: "Bakery" },
  ],
  "Trader Joe's": [
    { branch: "Trader Joe's Chelsea", salesPerDay: 188, inventory: 920, demandLevel: "High Demand", transferOpportunity: "Receive Stock", wastePercentage: 3.1, revenue: 28500, growthRate: 10.5, manager: "Chris Martinez", staffCount: 24, region: "Northeast", rating: 4.6, lastRestocked: "1.5 hours ago", topCategory: "Frozen" },
    { branch: "Trader Joe's Brooklyn Heights", salesPerDay: 145, inventory: 780, demandLevel: "Balanced", transferOpportunity: "None", wastePercentage: 3.8, revenue: 22400, growthRate: 6.8, manager: "Amy Liu", staffCount: 18, region: "Northeast", rating: 4.4, lastRestocked: "3 hours ago", topCategory: "Snacks" },
    { branch: "Trader Joe's Paramus", salesPerDay: 125, inventory: 680, demandLevel: "Balanced", transferOpportunity: "Send Stock", wastePercentage: 4.2, revenue: 18900, growthRate: 3.5, manager: "Dan Cooper", staffCount: 15, region: "Northeast", rating: 4.2, lastRestocked: "5 hours ago", topCategory: "Wine" },
  ],
};

interface BranchSummary {
  totalBranches: number;
  totalRevenue: number;
  avgWaste: number;
  avgGrowth: number;
  highDemandBranches: number;
  lowDemandBranches: number;
  totalStaff: number;
}

export default function BranchInsightsPage() {
  const { profile } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [branchesFromAPI, setBranchesFromAPI] = useState<BranchContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBranches() {
      try {
        const res = await fetch("/api/branches?active=false");
        const data = await res.json();
        if (data.success) setBranchesFromAPI(data.data);
      } catch {
        // Keep defaults
      } finally {
        setLoading(false);
      }
    }
    fetchBranches();
  }, []);

  // Build branch insights from API data merged with analytics
  const companyBranches: BranchInsight[] = useMemo(() => {
    if (!profile) return [];
    // Use API branches to construct insights with computed analytics
    if (branchesFromAPI.length > 0) {
      return branchesFromAPI.map((b, i) => {
        // Use analytical data from static map if available
        const staticData = branchDataByCompany[profile.company]?.find(
          (s) => s.branch === b.branchName
        );
        return staticData || {
          branch: b.branchName,
          salesPerDay: 100 + i * 20,
          inventory: 500 + i * 100,
          demandLevel: "Balanced" as const,
          transferOpportunity: "None" as const,
          wastePercentage: 3.5,
          revenue: 20000 + i * 5000,
          growthRate: 5.0,
          manager: b.managerName,
          staffCount: 15 + i * 2,
          region: b.region,
          rating: 4.3,
          lastRestocked: "2 hours ago",
          topCategory: "General",
        };
      });
    }
    return branchDataByCompany[profile.company] || [];
  }, [profile, branchesFromAPI]);

  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(companyBranches.map((b) => b.region).filter(Boolean))] as string[];
    return ["All", ...uniqueRegions];
  }, [companyBranches]);

  const filteredBranches = useMemo(() => {
    if (selectedRegion === "All") return companyBranches;
    return companyBranches.filter((b) => b.region === selectedRegion);
  }, [companyBranches, selectedRegion]);

  const summary: BranchSummary = useMemo(() => {
    if (filteredBranches.length === 0) {
      return { totalBranches: 0, totalRevenue: 0, avgWaste: 0, avgGrowth: 0, highDemandBranches: 0, lowDemandBranches: 0, totalStaff: 0 };
    }
    const totalRevenue = filteredBranches.reduce((sum, b) => sum + (b.revenue || 0), 0);
    const avgWaste = filteredBranches.reduce((sum, b) => sum + (b.wastePercentage || 0), 0) / filteredBranches.length;
    const avgGrowth = filteredBranches.reduce((sum, b) => sum + (b.growthRate || 0), 0) / filteredBranches.length;
    const highDemandBranches = filteredBranches.filter((b) => b.demandLevel === "High Demand").length;
    const lowDemandBranches = filteredBranches.filter((b) => b.demandLevel === "Low Demand").length;
    const totalStaff = filteredBranches.reduce((sum, b) => sum + (b.staffCount || 0), 0);
    return { totalBranches: filteredBranches.length, totalRevenue, avgWaste, avgGrowth, highDemandBranches, lowDemandBranches, totalStaff };
  }, [filteredBranches]);

  const topPerformers = useMemo(() => {
    return [...filteredBranches].sort((a, b) => (b.revenue || 0) - (a.revenue || 0)).slice(0, 3);
  }, [filteredBranches]);

  const needsAttention = useMemo(() => {
    return filteredBranches.filter((b) => (b.wastePercentage || 0) > 5 || (b.growthRate || 0) < 0);
  }, [filteredBranches]);

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

      {/* Region Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground mr-2">Filter by Region:</span>
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedRegion === region
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {companyBranches.length > 0 ? (
        <>
          {/* Summary KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Branches</CardTitle>
                  <Building2 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.totalBranches}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-primary">{summary.highDemandBranches}</span> high demand, <span className="text-destructive">{summary.lowDemandBranches}</span> low demand
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{(summary.totalRevenue / 1000).toFixed(0)}K</div>
                  <p className="text-xs text-muted-foreground mt-1">Daily revenue across all branches</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Waste Rate</CardTitle>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.avgWaste.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {summary.avgWaste < 4 ? (
                      <span className="text-primary">Below target threshold</span>
                    ) : (
                      <span className="text-destructive">Above target threshold</span>
                    )}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Growth Rate</CardTitle>
                  {summary.avgGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-primary" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${summary.avgGrowth >= 0 ? "text-primary" : "text-destructive"}`}>
                    {summary.avgGrowth >= 0 ? "+" : ""}{summary.avgGrowth.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Month-over-month growth</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Top Performers & Needs Attention */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Performers */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Activity className="h-4 w-4 text-primary" />
                    Top Performing Branches
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topPerformers.map((branch, index) => (
                    <div key={branch.branch} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          index === 0 ? "bg-yellow-500/20 text-yellow-600" :
                          index === 1 ? "bg-gray-400/20 text-gray-500" :
                          "bg-amber-600/20 text-amber-700"
                        }`}>
                          <span className="text-sm font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{branch.branch}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {branch.region} • {branch.manager}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">₹{((branch.revenue || 0) / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-primary flex items-center justify-end gap-0.5">
                          <ArrowUpRight className="h-3 w-3" /> {branch.growthRate}%
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Needs Attention */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Trash2 className="h-4 w-4 text-destructive" />
                    Branches Needing Attention
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {needsAttention.length > 0 ? (
                    needsAttention.slice(0, 3).map((branch) => (
                      <div key={branch.branch} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                        <div className="flex items-center gap-3">
                          <Store className="h-5 w-5 text-destructive" />
                          <div>
                            <p className="font-medium text-foreground text-sm">{branch.branch}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {(branch.wastePercentage || 0) > 5 && (
                                <Badge variant="danger" className="text-[10px]">High Waste: {branch.wastePercentage}%</Badge>
                              )}
                              {(branch.growthRate || 0) < 0 && (
                                <Badge variant="warning" className="text-[10px]">Declining: {branch.growthRate}%</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{branch.manager}</p>
                          <p className="text-xs text-muted-foreground flex items-center justify-end gap-0.5">
                            <Users className="h-3 w-3" /> {branch.staffCount} staff
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">All branches performing well!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Staff Overview */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4 text-chart-3" />
                  Staff Distribution & Branch Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredBranches.slice(0, 6).map((branch) => (
                    <div key={branch.branch} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground text-sm truncate">{branch.branch.split(" - ")[1]}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{branch.staffCount} staff</span>
                          <span>•</span>
                          <span className="text-primary">{branch.rating}★</span>
                          <span>•</span>
                          <Badge variant="secondary" className="text-[10px]">{branch.topCategory}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Total Staff: <span className="font-semibold text-foreground">{summary.totalStaff}</span> across {summary.totalBranches} branches
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Branch Table */}
          <BranchTable data={filteredBranches} />
        </>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <p className="text-muted-foreground">No branch data available for {profile.company}.</p>
        </div>
      )}
    </div>
  );
}
