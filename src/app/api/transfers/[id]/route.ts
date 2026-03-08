// PATCH /api/transfers/[id] — update transfer status

import { NextRequest, NextResponse } from "next/server";
import { updateTransferStatus } from "@/lib/services/transferService";
import type { TransferStatus } from "@/models/TransferRequest";

const VALID_STATUSES: TransferStatus[] = ["pending", "approved", "rejected", "in_transit", "completed"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, respondedBy, rejectionReason } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const transfer = await updateTransferStatus(id, status, respondedBy, rejectionReason);
    return NextResponse.json({ success: true, data: transfer });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message === "Transfer not found" ? 404 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
