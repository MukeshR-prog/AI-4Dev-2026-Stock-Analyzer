import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBranch extends Document {
  branchId: string;
  branchName: string;
  managerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string;
  isActive: boolean;
  company: string;
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema = new Schema<IBranch>(
  {
    branchId: { type: String, required: true, unique: true, index: true },
    branchName: { type: String, required: true },
    managerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, default: "" },
    region: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    company: { type: String, default: "FreshMart" },
  },
  { timestamps: true }
);

const Branch: Model<IBranch> =
  mongoose.models.Branch || mongoose.model<IBranch>("Branch", BranchSchema);

export default Branch;
