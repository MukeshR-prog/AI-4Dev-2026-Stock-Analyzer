import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type TaskType = "move" | "transfer" | "reorder" | "discount" | "review";
export type TaskPriority = "critical" | "high" | "medium" | "low";
export type TaskStatus = "pending" | "in_progress" | "completed" | "skipped";

export interface ITask extends Document {
  branch: Types.ObjectId;
  branchName: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  product: string;
  action: string;
  deadline: string;
  estimatedImpact: string;
  assignedTo?: string;
  completedBy?: string;
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    branchName: { type: String, required: true },
    type: {
      type: String,
      enum: ["move", "transfer", "reorder", "discount", "review"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "skipped"],
      default: "pending",
      index: true,
    },
    product: { type: String, required: true },
    action: { type: String, required: true },
    deadline: { type: String, required: true },
    estimatedImpact: { type: String, required: true },
    assignedTo: { type: String },
    completedBy: { type: String },
    completedAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

TaskSchema.index({ branch: 1, status: 1 });

const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);

export default Task;
