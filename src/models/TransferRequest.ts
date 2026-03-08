import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type TransferStatus = "pending" | "approved" | "rejected" | "in_transit" | "completed";

export interface ITransferRequest extends Document {
  transferId: string;
  fromBranch: Types.ObjectId;
  toBranch: Types.ObjectId;
  fromBranchName: string;
  toBranchName: string;
  product: string;
  sku: string;
  quantity: number;
  status: TransferStatus;
  requestedBy: string;
  requestedAt: Date;
  respondedBy?: string;
  respondedAt?: Date;
  notes?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransferRequestSchema = new Schema<ITransferRequest>(
  {
    transferId: { type: String, required: true, unique: true, index: true },
    fromBranch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    toBranch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    fromBranchName: { type: String, required: true },
    toBranchName: { type: String, required: true },
    product: { type: String, required: true },
    sku: { type: String, default: "" },
    quantity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "in_transit", "completed"],
      default: "pending",
      index: true,
    },
    requestedBy: { type: String, required: true },
    requestedAt: { type: Date, default: Date.now },
    respondedBy: { type: String },
    respondedAt: { type: Date },
    notes: { type: String },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

TransferRequestSchema.index({ fromBranch: 1, status: 1 });
TransferRequestSchema.index({ toBranch: 1, status: 1 });

const TransferRequest: Model<ITransferRequest> =
  mongoose.models.TransferRequest ||
  mongoose.model<ITransferRequest>("TransferRequest", TransferRequestSchema);

export default TransferRequest;
