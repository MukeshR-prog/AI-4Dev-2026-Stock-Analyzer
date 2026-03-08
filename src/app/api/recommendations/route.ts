// GET /api/recommendations — list recommendations

import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "@/lib/services/recommendationService";
import type { RecommendationStatus } from "@/models/Recommendation";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const branchName = searchParams.get("branch") || undefined;
    const status = searchParams.get("status") as RecommendationStatus | null;
    const priority = searchParams.get("priority") || undefined;

    const recs = await getRecommendations({
      branchName,
      status: status || undefined,
      priority,
    });

    return NextResponse.json({ success: true, data: recs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
