// GET /api/reports/weekly — weekly performance report

import { NextRequest, NextResponse } from "next/server";
import { getWeeklyReport, getHistoricalReports } from "@/lib/services/reportService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const branch = searchParams.get("branch") || undefined;
    const history = searchParams.get("history") === "true";

    if (history) {
      const reports = await getHistoricalReports(branch);
      return NextResponse.json({ success: true, data: reports });
    }

    const report = await getWeeklyReport(branch);
    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
