import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type RecommendationType = "transfer" | "discount" | "donation";
export type RecommendationStatus = "pending" | "accepted" | "rejected" | "completed";

export interface IRecommendation extends Document {
  branch: Types.ObjectId;
  branchName: string;
  product: string;
  type: RecommendationType;
  issue: string;
  action: string;
  reason: string;
  priority: "critical" | "high" | "medium" | "low";
  units: number;
  status: RecommendationStatus;
  actedBy?: string;
  actedAt?: Date;
  completionNotes?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RecommendationSchema = new Schema<IRecommendation>(
  {
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    branchName: { type: String, required: true },
    product: { type: String, required: true },
    type: {
      type: String,
      enum: ["transfer", "discount", "donation"],
      required: true,
    },
    issue: { type: String, required: true },
    action: { type: String, required: true },
    reason: { type: String, required: true },
    priority: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      default: "medium",
      index: true,
    },
    units: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
      index: true,
    },
    actedBy: { type: String },
    actedAt: { type: Date },
    completionNotes: { type: String },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

RecommendationSchema.index({ branch: 1, status: 1 });

const Recommendation: Model<IRecommendation> =
  mongoose.models.Recommendation ||
  mongoose.model<IRecommendation>("Recommendation", RecommendationSchema);

export default Recommendation;
