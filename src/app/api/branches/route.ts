// GET /api/branches — list all branches

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Branch from "@/models/Branch";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const region = searchParams.get("region") || undefined;
    const activeOnly = searchParams.get("active") !== "false";

    const query: Record<string, unknown> = {};
    if (region) query.region = region;
    if (activeOnly) query.isActive = true;

    const branches = await Branch.find(query).sort({ branchName: 1 }).lean();

    return NextResponse.json({ success: true, data: branches });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
