// POST /api/recommendations/[id]/action — accept/reject/complete a recommendation

import { NextRequest, NextResponse } from "next/server";
import { actOnRecommendation } from "@/lib/services/recommendationService";

const VALID_ACTIONS = ["accepted", "rejected", "completed"] as const;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, actor, notes } = body;

    if (!action || !VALID_ACTIONS.includes(action)) {
      return NextResponse.json(
        { success: false, error: `Invalid action. Must be one of: ${VALID_ACTIONS.join(", ")}` },
        { status: 400 }
      );
    }

    const rec = await actOnRecommendation(id, action, actor, notes);
    return NextResponse.json({ success: true, data: rec });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message === "Recommendation not found" ? 404 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
