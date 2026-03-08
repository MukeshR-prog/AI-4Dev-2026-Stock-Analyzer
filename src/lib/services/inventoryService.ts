// ── Inventory Service ──
// Business logic for inventory CRUD + engine integration.

import { connectDB } from "@/lib/mongodb";
import Inventory, { type IInventory } from "@/models/Inventory";
import Product from "@/models/Product";
import Branch from "@/models/Branch";
import { generateAlerts } from "@/lib/alertEngine";
import type { InventoryItem } from "@/data/inventory";
import { mockInventory } from "@/data/inventory";

// ── Helpers ──

/** Convert a DB inventory doc to the InventoryItem shape the engines expect. */
function toEngineItem(doc: IInventory): InventoryItem {
  return {
    product: doc.productName,
    category: doc.category,
    stock: doc.stock,
    expiryDays: doc.expiryDays,
    salesPerDay: doc.salesPerDay,
    sku: doc.sku,
    unitPrice: doc.unitPrice,
    lastRestocked: doc.lastRestocked,
  };
}

// ── Read ──

export async function getInventory(branchId?: string): Promise<InventoryItem[]> {
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (branchId) filter.branch = branchId;

  const docs = await Inventory.find(filter).lean<IInventory[]>();

  // If no DB records yet, return mock data so the UI still works
  if (docs.length === 0) {
    return mockInventory;
  }

  return docs.map(toEngineItem);
}

export async function getInventoryById(id: string) {
  await connectDB();
  return Inventory.findById(id).lean<IInventory>();
}

// ── Create ──

export async function createInventoryItem(data: {
  productName: string;
  sku: string;
  category: string;
  stock: number;
  unitPrice: number;
  salesPerDay: number;
  expiryDays: number;
  branchId: string;
}) {
  await connectDB();

  // Ensure branch exists
  const branch = await Branch.findById(data.branchId);
  if (!branch) throw new Error("Branch not found");

  // Ensure product exists (create if new)
  let product = await Product.findOne({ sku: data.sku });
  if (!product) {
    product = await Product.create({
      sku: data.sku,
      name: data.productName,
      category: data.category,
      unitPrice: data.unitPrice,
      shelfLifeDays: data.expiryDays,
    });
  }

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + data.expiryDays);

  const doc = await Inventory.create({
    product: product._id,
    branch: branch._id,
    productName: data.productName,
    sku: data.sku,
    category: data.category,
    stock: data.stock,
    unitPrice: data.unitPrice,
    salesPerDay: data.salesPerDay,
    expiryDays: data.expiryDays,
    expiryDate,
    lastRestocked: new Date(),
  });

  return doc.toObject();
}

// ── Update ──

export async function updateInventoryItem(
  id: string,
  updates: Partial<Pick<IInventory, "stock" | "salesPerDay" | "expiryDays" | "unitPrice">>
) {
  await connectDB();

  const doc = await Inventory.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean<IInventory>();
  if (!doc) throw new Error("Inventory item not found");

  return doc;
}

// ── Engine integration: generate alerts from current inventory ──

export async function getInventoryAlerts(branchName: string) {
  const items = await getInventory();
  return generateAlerts(items, branchName);
}
