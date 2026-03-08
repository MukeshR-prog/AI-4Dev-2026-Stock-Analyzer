import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IInventory extends Document {
  product: Types.ObjectId;
  branch: Types.ObjectId;
  productName: string;
  sku: string;
  category: string;
  stock: number;
  unitPrice: number;
  salesPerDay: number;
  expiryDays: number;
  expiryDate: Date;
  lastRestocked: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema = new Schema<IInventory>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true, index: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true },
    salesPerDay: { type: Number, required: true, default: 0 },
    expiryDays: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    lastRestocked: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

InventorySchema.index({ branch: 1, sku: 1 }, { unique: true });
InventorySchema.index({ expiryDate: 1 });
InventorySchema.index({ category: 1 });

const Inventory: Model<IInventory> =
  mongoose.models.Inventory || mongoose.model<IInventory>("Inventory", InventorySchema);

export default Inventory;
