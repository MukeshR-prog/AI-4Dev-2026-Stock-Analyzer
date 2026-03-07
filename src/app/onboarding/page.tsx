"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  MapPin,
  Users,
  Package,
  Rocket,
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  Trash2,
  Upload,
  FileSpreadsheet,
  Sparkles,
} from "lucide-react";
import type { OnboardingBranch } from "@/types";

// ═══════════════════════════════════════════════════════════════════════════════
// STEP INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const steps = [
    { icon: Building2, label: "Company" },
    { icon: MapPin, label: "Branches" },
    { icon: Users, label: "Managers" },
    { icon: Package, label: "Inventory" },
    { icon: Rocket, label: "Activate" },
  ];

  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const Icon = step.icon;

        return (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCurrent
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-muted bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isCurrent ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`mx-2 h-0.5 w-10 ${
                  index < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1: COMPANY SETUP
// ═══════════════════════════════════════════════════════════════════════════════

interface CompanyStepProps {
  companyName: string;
  industry: string;
  onCompanyNameChange: (value: string) => void;
  onIndustryChange: (value: string) => void;
}

function CompanyStep({ companyName, industry, onCompanyNameChange, onIndustryChange }: CompanyStepProps) {
  const industries = [
    "Grocery & Supermarket",
    "Convenience Store",
    "Pharmacy & Health",
    "Restaurant & Food Service",
    "Bakery & Cafe",
    "Specialty Food",
    "Other",
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Building2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Set Up Your Company</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us about your company to get started
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            placeholder="Enter your company name"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Industry
          </label>
          <select
            value={industry}
            onChange={(e) => onIndustryChange(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select your industry…</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2: ADD BRANCHES
// ═══════════════════════════════════════════════════════════════════════════════

interface BranchesStepProps {
  branches: OnboardingBranch[];
  onAddBranch: () => void;
  onRemoveBranch: (id: string) => void;
  onUpdateBranch: (id: string, field: keyof OnboardingBranch, value: string) => void;
}

function BranchesStep({ branches, onAddBranch, onRemoveBranch, onUpdateBranch }: BranchesStepProps) {
  const regions = ["North", "South", "East", "West", "Central", "Northeast", "Southeast", "Southwest", "Northwest", "Midwest"];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Add Your Branches</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Add all store locations you want to monitor
        </p>
      </div>

      <div className="space-y-4">
        {branches.map((branch, index) => (
          <motion.div
            key={branch.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Branch {index + 1}</span>
              {branches.length > 1 && (
                <button
                  onClick={() => onRemoveBranch(branch.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={branch.name}
                onChange={(e) => onUpdateBranch(branch.id, "name", e.target.value)}
                placeholder="Branch name"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="text"
                value={branch.address}
                onChange={(e) => onUpdateBranch(branch.id, "address", e.target.value)}
                placeholder="Address"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="text"
                value={branch.city}
                onChange={(e) => onUpdateBranch(branch.id, "city", e.target.value)}
                placeholder="City"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <select
                value={branch.region}
                onChange={(e) => onUpdateBranch(branch.id, "region", e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select region…</option>
                {regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={onAddBranch}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="h-4 w-4" />
        Add Another Branch
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3: ASSIGN MANAGERS
// ═══════════════════════════════════════════════════════════════════════════════

interface ManagersStepProps {
  branches: OnboardingBranch[];
  onUpdateBranch: (id: string, field: keyof OnboardingBranch, value: string) => void;
}

function ManagersStep({ branches, onUpdateBranch }: ManagersStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Assign Branch Managers</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Add contact information for each branch manager
        </p>
      </div>

      <div className="space-y-4">
        {branches.map((branch) => (
          <div key={branch.id} className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 font-medium text-foreground">{branch.name || "Unnamed Branch"}</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                type="text"
                value={branch.managerName || ""}
                onChange={(e) => onUpdateBranch(branch.id, "managerName", e.target.value)}
                placeholder="Manager name"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="email"
                value={branch.managerEmail || ""}
                onChange={(e) => onUpdateBranch(branch.id, "managerEmail", e.target.value)}
                placeholder="Email address"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="tel"
                value={branch.managerPhone || ""}
                onChange={(e) => onUpdateBranch(branch.id, "managerPhone", e.target.value)}
                placeholder="Phone number"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 4: INVENTORY UPLOAD
// ═══════════════════════════════════════════════════════════════════════════════

interface InventoryStepProps {
  inventoryOption: string;
  onOptionChange: (option: string) => void;
}

function InventoryStep({ inventoryOption, onOptionChange }: InventoryStepProps) {
  const options = [
    {
      id: "upload",
      icon: Upload,
      title: "Upload CSV",
      description: "Import your existing inventory from a spreadsheet",
    },
    {
      id: "manual",
      icon: Package,
      title: "Enter Manually",
      description: "Add products one by one in the dashboard",
    },
    {
      id: "sample",
      icon: FileSpreadsheet,
      title: "Use Sample Data",
      description: "Start with demo data to explore the platform",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Package className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Initial Inventory</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          How would you like to set up your inventory?
        </p>
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = inventoryOption === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onOptionChange(option.id)}
              className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-colors ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                isSelected ? "bg-primary/10" : "bg-muted"
              }`}>
                <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {option.title}
                </h3>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
              {isSelected && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {inventoryOption === "upload" && (
        <div className="rounded-xl border-2 border-dashed border-border p-8 text-center">
          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            Drag and drop your CSV file here, or{" "}
            <span className="text-primary cursor-pointer hover:underline">browse</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Maximum file size: 5MB
          </p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 5: ACTIVATION
// ═══════════════════════════════════════════════════════════════════════════════

interface ActivationStepProps {
  companyName: string;
  branchCount: number;
}

function ActivationStep({ companyName, branchCount }: ActivationStepProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <Rocket className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-xl font-bold text-foreground">Ready to Launch!</h2>
      <p className="text-sm text-muted-foreground">
        You&apos;re all set to start monitoring your inventory
      </p>

      <div className="rounded-xl border border-border bg-muted/30 p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Company</span>
            <span className="font-medium text-foreground">{companyName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Branches</span>
            <span className="font-medium text-foreground">{branchCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
              <Check className="h-4 w-4" />
              Ready
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-primary/5 p-4">
        <div className="flex items-center justify-center gap-2 text-sm text-primary">
          <Sparkles className="h-4 w-4" />
          AI-powered monitoring will begin immediately
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ONBOARDING PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function OnboardingPage() {
  const router = useRouter();
  const { firebaseUser, completeSetup } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [branches, setBranches] = useState<OnboardingBranch[]>([
    { id: "1", name: "", address: "", city: "", region: "" },
  ]);
  const [inventoryOption, setInventoryOption] = useState("sample");

  // Redirect if not authenticated
  useEffect(() => {
    if (!firebaseUser) {
      router.replace("/login");
    }
  }, [firebaseUser, router]);

  const totalSteps = 5;

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return companyName.trim() !== "" && industry !== "";
      case 1:
        return branches.every((b) => b.name.trim() !== "" && b.city.trim() !== "");
      case 2:
        return true; // Manager info is optional
      case 3:
        return inventoryOption !== "";
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleAddBranch = () => {
    setBranches((prev) => [
      ...prev,
      { id: String(Date.now()), name: "", address: "", city: "", region: "" },
    ]);
  };

  const handleRemoveBranch = (id: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  const handleUpdateBranch = (id: string, field: keyof OnboardingBranch, value: string) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // Use the first branch as the user's assigned branch
      const firstBranch = branches[0]?.name || "Main Branch";
      await completeSetup(companyName, firstBranch, "Admin");
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to complete setup:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!firebaseUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground">
            <Sparkles className="h-6 w-6 text-background" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">Retail Intelligence</h1>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 0 && (
                <CompanyStep
                  companyName={companyName}
                  industry={industry}
                  onCompanyNameChange={setCompanyName}
                  onIndustryChange={setIndustry}
                />
              )}
              {currentStep === 1 && (
                <BranchesStep
                  branches={branches}
                  onAddBranch={handleAddBranch}
                  onRemoveBranch={handleRemoveBranch}
                  onUpdateBranch={handleUpdateBranch}
                />
              )}
              {currentStep === 2 && (
                <ManagersStep
                  branches={branches}
                  onUpdateBranch={handleUpdateBranch}
                />
              )}
              {currentStep === 3 && (
                <InventoryStep
                  inventoryOption={inventoryOption}
                  onOptionChange={setInventoryOption}
                />
              )}
              {currentStep === 4 && (
                <ActivationStep
                  companyName={companyName}
                  branchCount={branches.length}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            {currentStep < totalSteps - 1 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Activating…
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4" />
                    Launch Dashboard
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
