// Types for the Retail Intelligence Platform

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  company: string;
  branch: string;
  role: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface StoreProduct {
  product: string;
  stock: number;
  expiryDays: number;
  expiryRisk: "High" | "Medium" | "Low";
}

export interface BranchInsight {
  branch: string;
  salesPerDay: number;
  inventory: number;
  demandLevel: "High Demand" | "Balanced" | "Low Demand";
  transferOpportunity: "Send Stock" | "Receive Stock" | "None";
  wastePercentage?: number;
  revenue?: number;
  growthRate?: number;
  manager?: string;
  staffCount?: number;
  region?: string;
  rating?: number;
  lastRestocked?: string;
  topCategory?: string;
}

export interface Recommendation {
  product: string;
  issue: string;
  recommendation: string;
}
