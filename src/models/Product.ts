import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
  shelfLifeDays: number;
  reorderThreshold: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    sku: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, required: true, index: true },
    unitPrice: { type: Number, required: true },
    shelfLifeDays: { type: Number, required: true },
    reorderThreshold: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
