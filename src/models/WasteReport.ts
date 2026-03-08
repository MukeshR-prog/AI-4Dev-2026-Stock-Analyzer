import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IWasteReport extends Document {
  branch: Types.ObjectId;
  branchName: string;
  weekStartDate: Date;
  weekEndDate: Date;
  totalWasteUnits: number;
  totalWasteValue: number;
  totalSavedUnits: number;
  totalSavedValue: number;
  reductionPercent: number;
  inventoryTurnover: number;
  transfersCompleted: number;
  transfersPending: number;
  productBreakdown: {
    product: string;
    wastedUnits: number;
    wastedValue: number;
    savedUnits: number;
  }[];
  topSellingProducts: { product: string; units: number }[];
  slowMovingProducts: { product: string; units: number; daysOnShelf: number }[];
  createdAt: Date;
  updatedAt: Date;
}

const WasteReportSchema = new Schema<IWasteReport>(
  {
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    branchName: { type: String, required: true },
    weekStartDate: { type: Date, required: true },
    weekEndDate: { type: Date, required: true },
    totalWasteUnits: { type: Number, required: true },
    totalWasteValue: { type: Number, required: true },
    totalSavedUnits: { type: Number, default: 0 },
    totalSavedValue: { type: Number, default: 0 },
    reductionPercent: { type: Number, default: 0 },
    inventoryTurnover: { type: Number, default: 0 },
    transfersCompleted: { type: Number, default: 0 },
    transfersPending: { type: Number, default: 0 },
    productBreakdown: [
      {
        product: { type: String, required: true },
        wastedUnits: { type: Number, required: true },
        wastedValue: { type: Number, required: true },
        savedUnits: { type: Number, default: 0 },
      },
    ],
    topSellingProducts: [
      {
        product: { type: String, required: true },
        units: { type: Number, required: true },
      },
    ],
    slowMovingProducts: [
      {
        product: { type: String, required: true },
        units: { type: Number, required: true },
        daysOnShelf: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

WasteReportSchema.index({ branch: 1, weekStartDate: -1 });

const WasteReport: Model<IWasteReport> =
  mongoose.models.WasteReport ||
  mongoose.model<IWasteReport>("WasteReport", WasteReportSchema);

export default WasteReport;
