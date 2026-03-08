// ── Alert Service ──
// Business logic for alerts + engine integration.

import { connectDB } from "@/lib/mongodb";
import Alert, { type IAlert } from "@/models/Alert";
import Branch from "@/models/Branch";
import { generateAlerts } from "@/lib/alertEngine";
import { mockInventory } from "@/data/inventory";

// ── Read ──

export async function getAlerts(filters?: {
  branchId?: string;
  branchName?: string;
  priority?: string;
  dismissed?: boolean;
}) {
  await connectDB();

  const query: Record<string, unknown> = {};
  if (filters?.branchId) query.branch = filters.branchId;
  if (filters?.branchName) query.branchName = filters.branchName;
  if (filters?.priority) query.priority = filters.priority;
  query.isDismissed = filters?.dismissed ?? false;

  const docs = await Alert.find(query)
    .sort({ priority: 1, createdAt: -1 })
    .lean<IAlert[]>();

  // Fallback: generate from engine if DB is empty
  if (docs.length === 0) {
    const branch = filters?.branchName || "FreshMart Union Square";
    return generateAlerts(mockInventory, branch);
  }

  return docs;
}

// ── Sync: run engine and persist alerts ──

export async function syncAlerts(branchName: string) {
  await connectDB();

  const branch = await Branch.findOne({ branchName });
  if (!branch) throw new Error("Branch not found");

  const engineAlerts = generateAlerts(mockInventory, branchName);

  const docs = await Promise.all(
    engineAlerts.map((alert) =>
      Alert.findOneAndUpdate(
        { branchName, product: alert.product, type: alert.type, isDismissed: false },
        {
          $set: {
            branch: branch._id,
            branchName,
            type: alert.type,
            priority: alert.priority,
            product: alert.product,
            title: alert.title,
            message: alert.message,
            metric: alert.metric,
          },
        },
        { upsert: true, new: true }
      ).lean<IAlert>()
    )
  );

  return docs;
}

// ── Dismiss ──

export async function dismissAlert(id: string) {
  await connectDB();
  const doc = await Alert.findByIdAndUpdate(id, { $set: { isDismissed: true } }, { new: true }).lean<IAlert>();
  if (!doc) throw new Error("Alert not found");
  return doc;
}
