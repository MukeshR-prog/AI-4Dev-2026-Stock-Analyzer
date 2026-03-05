import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// GET /api/auth/user?uid=<firebaseUid>
export async function GET(req: NextRequest) {
  try {
    const uid = req.nextUrl.searchParams.get("uid");
    if (!uid) {
      return NextResponse.json({ error: "uid is required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ firebaseUid: uid }).lean();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("GET /api/auth/user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/auth/user  — upsert user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firebaseUid, email, displayName, photoURL, company, branch, role } = body;

    if (!firebaseUid || !email) {
      return NextResponse.json(
        { error: "firebaseUid and email are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const isSetupComplete = !!(company && branch);

    const user = await User.findOneAndUpdate(
      { firebaseUid },
      {
        firebaseUid,
        email,
        displayName: displayName || "",
        photoURL: photoURL || "",
        company: company || "",
        branch: branch || "",
        role: role || "store_manager",
        isSetupComplete,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("POST /api/auth/user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
