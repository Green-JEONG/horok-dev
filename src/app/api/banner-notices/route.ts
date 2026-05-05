import { NextResponse } from "next/server";
import { findBannerNotices } from "@/lib/notices";

export async function GET() {
  try {
    const notices = await findBannerNotices();
    return NextResponse.json(notices);
  } catch (error) {
    console.error("Failed to load banner notices", error);
    return NextResponse.json([], { status: 200 });
  }
}
