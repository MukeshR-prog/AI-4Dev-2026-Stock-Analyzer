import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type AlertType = "expiry-risk" | "surplus-inventory" | "demand-mismatch" | "recommendation";
export type AlertPriority = "critical" | "high" | "medium" | "low";

export interface IAlert extends Document {
  branch: Types.ObjectId;
  branchName: string;
  type: AlertType;
  priority: AlertPriority;
  product: string;
  title: string;
  message: string;
  metric?: string;
  isRead: boolean;
  isDismissed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    branchName: { type: String, required: true },
    type: {
      type: String,
      enum: ["expiry-risk", "surplus-inventory", "demand-mismatch", "recommendation"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      required: true,
      index: true,
    },
    product: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    metric: { type: String },
    isRead: { type: Boolean, default: false },
    isDismissed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AlertSchema.index({ branch: 1, priority: 1 });
AlertSchema.index({ branch: 1, isDismissed: 1 });

const Alert: Model<IAlert> =
  mongoose.models.Alert || mongoose.model<IAlert>("Alert", AlertSchema);

export default Alert;
