// POST /api/tasks/[id]/complete — mark task as completed

import { NextRequest, NextResponse } from "next/server";
import { completeTask } from "@/lib/services/taskService";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { completedBy, notes } = body;

    const task = await completeTask(id, completedBy, notes);
    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message === "Task not found" ? 404 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
