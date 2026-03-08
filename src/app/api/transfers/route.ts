// GET /api/transfers — list transfers
// POST /api/transfers — create transfer request

import { NextRequest, NextResponse } from "next/server";
import { getTransfers, createTransfer } from "@/lib/services/transferService";
import type { TransferStatus } from "@/models/TransferRequest";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const branchId = searchParams.get("branchId") || undefined;
    const status = searchParams.get("status") as TransferStatus | null;

    const transfers = await getTransfers({
      branchId,
      status: status || undefined,
    });

    return NextResponse.json({ success: true, data: transfers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fromBranchName, toBranchName, product, sku, quantity, requestedBy, notes } = body;

    if (!fromBranchName || !toBranchName || !product || !quantity || !requestedBy) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: fromBranchName, toBranchName, product, quantity, requestedBy" },
        { status: 400 }
      );
    }

    const transfer = await createTransfer({
      fromBranchName,
      toBranchName,
      product,
      sku,
      quantity,
      requestedBy,
      notes,
    });

    return NextResponse.json({ success: true, data: transfer }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
