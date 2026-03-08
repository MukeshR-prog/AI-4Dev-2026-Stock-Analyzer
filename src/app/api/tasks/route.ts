// GET /api/tasks — list tasks
// (Complete via POST /api/tasks/[id]/complete)

import { NextRequest, NextResponse } from "next/server";
import { getTasks } from "@/lib/services/taskService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const branchName = searchParams.get("branch") || undefined;
    const status = searchParams.get("status") || undefined;

    const tasks = await getTasks({ branchName, status });

    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
