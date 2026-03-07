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

// ═══════════════════════════════════════════════════════════════════════════════
// NEW TYPES FOR ADDITIONAL FEATURES
// ═══════════════════════════════════════════════════════════════════════════════

// Stock Transfer Request Types
export type TransferStatus = 'pending' | 'approved' | 'rejected' | 'in_transit' | 'completed';

export interface StockTransferRequest {
  id: string;
  fromBranch: string;
  toBranch: string;
  product: string;
  quantity: number;
  status: TransferStatus;
  requestedBy: string;
  requestedAt: Date;
  respondedBy?: string;
  respondedAt?: Date;
  notes?: string;
  rejectionReason?: string;
}

// Branch Contact Directory Types
export interface BranchContact {
  branchId: string;
  branchName: string;
  managerName: string;
  phone: string;
  email: string;
  address: string;
  region: string;
  city?: string;
  isActive: boolean;
}

// Recommendation Feedback Types
export type RecommendationStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface RecommendationFeedback {
  recommendationId: string;
  status: RecommendationStatus;
  actedBy?: string;
  actedAt?: Date;
  completionNotes?: string;
  rejectionReason?: string;
}

// Onboarding Types
export interface OnboardingCompany {
  name: string;
  industry: string;
  logo?: string;
}

export interface OnboardingBranch {
  id: string;
  name: string;
  address: string;
  city: string;
  region: string;
  managerName?: string;
  managerEmail?: string;
  managerPhone?: string;
}

export interface OnboardingState {
  step: number;
  company: OnboardingCompany | null;
  branches: OnboardingBranch[];
  inventoryUploaded: boolean;
  isComplete: boolean;
}
