// ── Transfer Service ──
// Business logic for stock transfer requests.

import { connectDB } from "@/lib/mongodb";
import TransferRequest, { type ITransferRequest, type TransferStatus } from "@/models/TransferRequest";
import Branch from "@/models/Branch";
import { mockTransferRequests } from "@/data/transfers";

// ── Read ──

export async function getTransfers(filters?: {
  branchId?: string;
  status?: TransferStatus;
}) {
  await connectDB();

  const query: Record<string, unknown> = {};
  if (filters?.branchId) {
    query.$or = [{ fromBranch: filters.branchId }, { toBranch: filters.branchId }];
  }
  if (filters?.status) {
    query.status = filters.status;
  }

  const docs = await TransferRequest.find(query)
    .sort({ requestedAt: -1 })
    .lean<ITransferRequest[]>();

  // Fallback to mock data if empty
  if (docs.length === 0) {
    let filtered = [...mockTransferRequests];
    if (filters?.status) {
      filtered = filtered.filter((t) => t.status === filters.status);
    }
    return filtered;
  }

  return docs;
}

export async function getTransferById(id: string) {
  await connectDB();
  return TransferRequest.findById(id).lean<ITransferRequest>();
}

// ── Create ──

export async function createTransfer(data: {
  fromBranchName: string;
  toBranchName: string;
  product: string;
  sku?: string;
  quantity: number;
  requestedBy: string;
  notes?: string;
}) {
  await connectDB();

  const fromBranch = await Branch.findOne({ branchName: data.fromBranchName });
  const toBranch = await Branch.findOne({ branchName: data.toBranchName });

  // Generate transfer ID like TR-2026-0307-XXX
  const now = new Date();
  const datePart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const count = await TransferRequest.countDocuments();
  const transferId = `TR-${datePart}-${String(count + 1).padStart(3, "0")}`;

  const doc = await TransferRequest.create({
    transferId,
    fromBranch: fromBranch?._id,
    toBranch: toBranch?._id,
    fromBranchName: data.fromBranchName,
    toBranchName: data.toBranchName,
    product: data.product,
    sku: data.sku || "",
    quantity: data.quantity,
    status: "pending",
    requestedBy: data.requestedBy,
    requestedAt: now,
    notes: data.notes,
  });

  return doc.toObject();
}

// ── Update status ──

export async function updateTransferStatus(
  id: string,
  status: TransferStatus,
  respondedBy?: string,
  rejectionReason?: string
) {
  await connectDB();

  const updates: Record<string, unknown> = { status };
  if (respondedBy) {
    updates.respondedBy = respondedBy;
    updates.respondedAt = new Date();
  }
  if (rejectionReason) {
    updates.rejectionReason = rejectionReason;
  }

  const doc = await TransferRequest.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean<ITransferRequest>();
  if (!doc) throw new Error("Transfer not found");

  return doc;
}

// ── Stats ──

export async function getTransferStats() {
  await connectDB();

  const counts = await TransferRequest.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const stats: Record<string, number> = {
    pending: 0,
    approved: 0,
    in_transit: 0,
    completed: 0,
    rejected: 0,
  };

  for (const c of counts) {
    stats[c._id as string] = c.count;
  }

  return stats;
}
