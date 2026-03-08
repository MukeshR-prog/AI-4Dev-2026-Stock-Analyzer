// GET /api/inventory — list inventory
// POST /api/inventory — create inventory item

import { NextRequest, NextResponse } from "next/server";
import { getInventory, createInventoryItem } from "@/lib/services/inventoryService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const branchId = searchParams.get("branchId") || undefined;

    const items = await getInventory(branchId);
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName, sku, category, stock, unitPrice, salesPerDay, expiryDays, branchId } = body;

    if (!productName || !sku || !category || stock == null || !unitPrice || !branchId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: productName, sku, category, stock, unitPrice, branchId" },
        { status: 400 }
      );
    }

    const item = await createInventoryItem({
      productName,
      sku,
      category,
      stock,
      unitPrice,
      salesPerDay: salesPerDay || 0,
      expiryDays: expiryDays || 7,
      branchId,
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
