// ── Recommendation Service ──
// Business logic for recommendations + engine integration.

import { connectDB } from "@/lib/mongodb";
import Recommendation, { type IRecommendation, type RecommendationStatus } from "@/models/Recommendation";
import Branch from "@/models/Branch";
import { generateRecommendations, getMockInventory, getMockBranchDemand } from "@/lib/recommendationEngine";

// ── Read ──

export async function getRecommendations(filters?: {
  branchId?: string;
  branchName?: string;
  status?: RecommendationStatus;
  priority?: string;
}) {
  await connectDB();

  const query: Record<string, unknown> = {};
  if (filters?.branchId) query.branch = filters.branchId;
  if (filters?.branchName) query.branchName = filters.branchName;
  if (filters?.status) query.status = filters.status;
  if (filters?.priority) query.priority = filters.priority;

  const docs = await Recommendation.find(query)
    .sort({ priority: 1, createdAt: -1 })
    .lean<IRecommendation[]>();

  // Fallback: generate fresh from engine if DB is empty
  if (docs.length === 0) {
    const branch = filters?.branchName || "FreshMart Union Square";
    return generateFresh(branch);
  }

  return docs;
}

/** Generate recommendations from the engine (mock/live) and return them */
function generateFresh(branch: string) {
  const inventory = getMockInventory(branch);
  const demand = getMockBranchDemand(branch);
  return generateRecommendations(inventory, demand);
}

// ── Action (accept / reject / complete) ──

export async function actOnRecommendation(
  id: string,
  action: "accepted" | "rejected" | "completed",
  actor?: string,
  notes?: string
) {
  await connectDB();

  const updates: Record<string, unknown> = {
    status: action,
    actedBy: actor,
    actedAt: new Date(),
  };
  if (action === "completed" && notes) updates.completionNotes = notes;
  if (action === "rejected" && notes) updates.rejectionReason = notes;

  const doc = await Recommendation.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean<IRecommendation>();
  if (!doc) throw new Error("Recommendation not found");

  return doc;
}

// ── Sync: run engine and persist new recommendations ──

export async function syncRecommendations(branchName: string) {
  await connectDB();

  const branch = await Branch.findOne({ branchName });
  if (!branch) throw new Error("Branch not found");

  const fresh = generateFresh(branchName);

  const docs = await Promise.all(
    fresh.map((rec) =>
      Recommendation.findOneAndUpdate(
        { branchName, product: rec.product, type: rec.type, status: "pending" },
        {
          $setOnInsert: {
            branch: branch._id,
            branchName,
            product: rec.product,
            type: rec.type,
            issue: rec.issue,
            action: rec.action,
            reason: rec.reason,
            priority: rec.priority,
            units: rec.units,
            status: "pending",
          },
        },
        { upsert: true, new: true }
      ).lean<IRecommendation>()
    )
  );

  return docs;
}
