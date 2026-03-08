// GET /api/alerts — list alerts for a branch

import { NextRequest, NextResponse } from "next/server";
import { getAlerts } from "@/lib/services/alertService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const branchName = searchParams.get("branch") || undefined;
    const priority = searchParams.get("priority") || undefined;

    const alerts = await getAlerts({ branchName, priority });

    return NextResponse.json({ success: true, data: alerts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
