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
  milkSales: string;
  inventory: number;
}

export interface Recommendation {
  product: string;
  issue: string;
  recommendation: string;
}
