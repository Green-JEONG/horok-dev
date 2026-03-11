import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { findUserContributions, getUserIdByEmail } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json([], { status: 200 });
    }

    // email → users.id(BIGINT) 변환
    const userId = await getUserIdByEmail(session.user.email);
    if (!userId) {
      return NextResponse.json([], { status: 200 });
    }

    const data = await findUserContributions(userId);

    return NextResponse.json(data);
  } catch (err) {
    console.error("[contributions API error]", err);
    return NextResponse.json([], { status: 200 });
  }
}
