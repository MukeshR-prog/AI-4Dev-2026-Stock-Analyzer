// ── Task Service ──
// Business logic for staff action tasks + Groq AI integration.

import { connectDB } from "@/lib/mongodb";
import Task, { type ITask } from "@/models/Task";
import Branch from "@/models/Branch";
import { getAIActionTasks } from "@/lib/groqAI";
import { mockInventory } from "@/data/inventory";

// ── Read ──

export async function getTasks(filters?: {
  branchId?: string;
  branchName?: string;
  status?: string;
}) {
  await connectDB();

  const query: Record<string, unknown> = {};
  if (filters?.branchId) query.branch = filters.branchId;
  if (filters?.branchName) query.branchName = filters.branchName;
  if (filters?.status) query.status = filters.status;

  const docs = await Task.find(query)
    .sort({ priority: 1, createdAt: -1 })
    .lean<ITask[]>();

  // Fallback: generate tasks from AI engine
  if (docs.length === 0) {
    const branch = filters?.branchName || "FreshMart Union Square";
    return getAIActionTasks(mockInventory, branch);
  }

  return docs;
}

// ── Complete ──

export async function completeTask(id: string, completedBy?: string, notes?: string) {
  await connectDB();

  const doc = await Task.findByIdAndUpdate(
    id,
    {
      $set: {
        status: "completed",
        completedBy,
        completedAt: new Date(),
        notes,
      },
    },
    { new: true }
  ).lean<ITask>();

  if (!doc) throw new Error("Task not found");
  return doc;
}

// ── Sync: generate tasks from AI and persist ──

export async function syncTasks(branchName: string) {
  await connectDB();

  const branch = await Branch.findOne({ branchName });
  if (!branch) throw new Error("Branch not found");

  const aiTasks = await getAIActionTasks(mockInventory, branchName);

  const docs = await Promise.all(
    aiTasks.map((task) =>
      Task.findOneAndUpdate(
        { branchName, product: task.product, type: task.type, status: "pending" },
        {
          $setOnInsert: {
            branch: branch._id,
            branchName,
            type: task.type,
            priority: task.priority,
            product: task.product,
            action: task.action,
            deadline: task.deadline,
            estimatedImpact: task.estimatedImpact,
            status: "pending",
          },
        },
        { upsert: true, new: true }
      ).lean<ITask>()
    )
  );

  return docs;
}
