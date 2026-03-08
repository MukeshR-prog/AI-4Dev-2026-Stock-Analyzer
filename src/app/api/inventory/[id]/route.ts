// PATCH /api/inventory/[id] — update inventory item

import { NextRequest, NextResponse } from "next/server";
import { updateInventoryItem, getInventoryAlerts } from "@/lib/services/inventoryService";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const allowedFields = ["stock", "salesPerDay", "expiryDays", "unitPrice"];
    const updates: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const item = await updateInventoryItem(id, updates);

    // After inventory update, regenerate alerts
    const alerts = await getInventoryAlerts("FreshMart Union Square");

    return NextResponse.json({
      success: true,
      data: item,
      alerts: alerts.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message === "Inventory item not found" ? 404 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
