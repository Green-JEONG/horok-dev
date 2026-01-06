import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { findUserContributions } from "@/lib/db";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json([], { status: 200 });
  }

  const data = await findUserContributions(session.user.id);
  return NextResponse.json(data);
}
